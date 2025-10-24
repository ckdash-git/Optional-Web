// Shared Firebase initialization for pages referencing script.js (Firebase v8)
(function () {
  if (typeof firebase === 'undefined') {
    console.error('Firebase SDK not loaded before script.js');
    return;
  }

  var firebaseConfig = {
    apiKey: "AIzaSyD8r6mmkOSAtUUvTFib_0sw2u3FRcdwAsA",
    authDomain: "optional-25cd8.firebaseapp.com",
    projectId: "optional-25cd8",
    storageBucket: "optional-25cd8.appspot.com",
    messagingSenderId: "232340431847",
    appId: "1:232340431847:web:191ada6ed1d393d66f5342",
    measurementId: "G-HQVLL3SN9H"
  };

  if (!firebase.apps || !firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
  }
})();