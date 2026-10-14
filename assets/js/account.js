// Account page for the Optional app: sign in, see the account, sign out, delete it.
// Uses the Firebase project the Optional app signs users into. Deleting removes the
// user's Firestore profile (users/{uid}) and then the sign-in account itself.
(() => {
  const config = {
    apiKey: 'AIzaSyD8r6mmkOSAtUUvTFib_0sw2u3FRcdwAsA',
    authDomain: 'optional-25cd8.firebaseapp.com',
    projectId: 'optional-25cd8',
    storageBucket: 'optional-25cd8.appspot.com',
    messagingSenderId: '232340431847',
    appId: '1:232340431847:web:191ada6ed1d393d66f5342',
  };

  const $ = (sel) => document.querySelector(sel);
  const states = document.querySelectorAll('[data-state]');
  const statusEl = $('[data-status]');

  const show = (name) => states.forEach((s) => { s.hidden = s.dataset.state !== name; });
  const say = (text, kind = 'info') => {
    statusEl.textContent = text;
    statusEl.dataset.kind = kind;
    statusEl.hidden = !text;
  };
  const busy = (btn, on, label) => {
    if (!btn) return;
    if (on) { btn.dataset.label = btn.textContent; btn.textContent = label; }
    else if (btn.dataset.label) btn.textContent = btn.dataset.label;
    btn.disabled = on;
  };

  if (typeof firebase === 'undefined') {
    show('unavailable');
    return;
  }
  if (!firebase.apps.length) firebase.initializeApp(config);
  const auth = firebase.auth();
  const db = firebase.firestore();

  const friendly = (err) => {
    const map = {
      'auth/invalid-email': 'That email address does not look right.',
      'auth/user-not-found': 'No account uses that email. Check it, or sign in with Google or Apple.',
      'auth/wrong-password': 'That password is not right. Try again, or reset it below.',
      'auth/invalid-credential': 'That email and password do not match an account.',
      'auth/invalid-login-credentials': 'That email and password do not match an account.',
      'auth/too-many-requests': 'Too many tries. Wait a few minutes, then try again.',
      'auth/popup-closed-by-user': 'The sign-in window was closed before finishing.',
      'auth/popup-blocked': 'Your browser blocked the sign-in window. Allow pop-ups for this site and try again.',
      'auth/network-request-failed': 'No connection. Check your internet and try again.',
      'auth/account-exists-with-different-credential': 'This email already signs in another way. Use the method you first signed up with.',
    };
    return map[err && err.code] || 'Something went wrong. Please try again.';
  };

  const fmt = (iso) => (iso ? new Date(iso).toLocaleDateString(undefined, { day: 'numeric', month: 'long', year: 'numeric' }) : 'Not available');

  // Signed-in view
  auth.onAuthStateChanged((user) => {
    if (!user) { if ($('[data-state="deleted"]').hidden) show('signed-out'); return; }
    $('[data-email]').textContent = user.email || 'No email on this account';
    $('[data-method]').textContent = (user.providerData[0] && {
      'google.com': 'Google', 'apple.com': 'Apple', password: 'Email and password',
    }[user.providerData[0].providerId]) || 'Email and password';
    $('[data-created]').textContent = fmt(user.metadata.creationTime);
    $('[data-last]').textContent = fmt(user.metadata.lastSignInTime);
    $('#confirm-email').placeholder = user.email || '';
    show('signed-in');
  });

  // Sign in with email and password
  $('#signin-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = e.submitter || $('#signin-form button[type="submit"]');
    say('');
    busy(btn, true, 'Signing in…');
    try {
      await auth.signInWithEmailAndPassword($('#email').value.trim(), $('#password').value);
    } catch (err) {
      say(friendly(err), 'error');
    } finally {
      busy(btn, false);
    }
  });

  // Google and Apple
  const providers = {
    google: () => new firebase.auth.GoogleAuthProvider(),
    apple: () => { const p = new firebase.auth.OAuthProvider('apple.com'); p.addScope('email'); return p; },
  };
  document.querySelectorAll('[data-provider]').forEach((btn) => btn.addEventListener('click', async () => {
    say('');
    busy(btn, true, 'Opening…');
    try {
      await auth.signInWithPopup(providers[btn.dataset.provider]());
    } catch (err) {
      say(friendly(err), 'error');
    } finally {
      busy(btn, false);
    }
  }));

  // Password reset
  $('#reset').addEventListener('click', async () => {
    const email = $('#email').value.trim();
    if (!email) { say('Type your email address above first, then choose Reset password.', 'error'); $('#email').focus(); return; }
    try {
      await auth.sendPasswordResetEmail(email);
      say(`If an account uses ${email}, a reset link is on its way.`, 'success');
    } catch (err) {
      say(friendly(err), 'error');
    }
  });

  // Sign out
  $('#signout').addEventListener('click', async () => {
    await auth.signOut();
    say('You are signed out.', 'success');
  });

  // Delete: open the confirmation, then delete data and account
  const confirmBox = $('#delete-confirm');
  $('#delete-start').addEventListener('click', () => {
    confirmBox.hidden = false;
    $('#delete-start').hidden = true;
    $('#confirm-email').focus();
  });
  $('#delete-cancel').addEventListener('click', () => {
    confirmBox.hidden = true;
    $('#delete-start').hidden = false;
    $('#confirm-email').value = '';
    say('');
  });

  $('#delete-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const user = auth.currentUser;
    if (!user) { show('signed-out'); return; }
    const typed = $('#confirm-email').value.trim().toLowerCase();
    if (user.email && typed !== user.email.toLowerCase()) {
      say('The email you typed does not match this account.', 'error');
      $('#confirm-email').focus();
      return;
    }
    const btn = $('#delete-form button[type="submit"]');
    say('');
    busy(btn, true, 'Deleting…');
    try {
      await db.collection('users').doc(user.uid).delete();
      await user.delete();
      show('deleted');
      say('');
    } catch (err) {
      if (err && err.code === 'auth/requires-recent-login') {
        await auth.signOut();
        say('For your security, please sign in again, then delete your account.', 'error');
      } else if (err && err.code === 'permission-denied') {
        say('We could not delete your account data. Please email contact@optionallabs.com and we will delete it for you.', 'error');
      } else {
        say(friendly(err), 'error');
      }
    } finally {
      busy(btn, false);
    }
  });
})();
