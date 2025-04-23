// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyD8r6mmkOSAtUUvTFib_0sw2u3FRcdwAsA",
    authDomain: "optional-25cd8.firebaseapp.com",
    projectId: "optional-25cd8",
    storageBucket: "optional-25cd8.firebasestorage.app",
    messagingSenderId: "232340431847",
    appId: "1:232340431847:web:191ada6ed1d393d66f5342",
    measurementId: "G-HQVLL3SN9H"
};

// Initialize Firebase - Using the already loaded Firebase scripts from HTML
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

// Global references to important DOM elements
const modalContainer = document.querySelector('.modal-container');
const loader = document.getElementById('loader');
let loginBtn, registerBtn;

// Initialize the app when DOM is fully loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM fully loaded and parsed');
    
    // Get references to auth buttons
    loginBtn = document.querySelector('.login-btn');
    registerBtn = document.querySelector('.register-btn');
    
    // Add event listeners to buttons
    if (loginBtn) {
        loginBtn.addEventListener('click', showLoginModal);
    }
    
    if (registerBtn) {
        registerBtn.addEventListener('click', showRegisterModal);
    }
    
    // Set up auth state observer
    setupAuthObserver();
});

// Authentication state observer
function setupAuthObserver() {
    auth.onAuthStateChanged(user => {
        if (user) {
            // User is signed in
            console.log('User is signed in:', user.email);
            
            // Update UI to show logged-in state
            if (loginBtn) {
                loginBtn.textContent = 'Logout';
                loginBtn.removeEventListener('click', showLoginModal);
                loginBtn.addEventListener('click', handleLogout);
            }
            
            // Hide register button when logged in
            if (registerBtn) {
                registerBtn.style.display = 'none';
            }
            
            // Update user info display
            updateUserInfoDisplay(user);
        } else {
            // User is signed out
            console.log('User is signed out');
            
            // Update UI to show logged-out state
            if (loginBtn) {
                loginBtn.textContent = 'Login';
                loginBtn.removeEventListener('click', handleLogout);
                loginBtn.addEventListener('click', showLoginModal);
            }
            
            // Show register button
            if (registerBtn) {
                registerBtn.style.display = 'inline-block';
            }
            
            // Clear user info display
            clearUserInfoDisplay();
        }
    });
}

// Display user information
function updateUserInfoDisplay(user) {
    const userInfoDiv = document.querySelector('.user-info');
    if (userInfoDiv) {
        userInfoDiv.innerHTML = `
            <p>Welcome, ${user.email}</p>
        `;
    }
}

// Clear user information
function clearUserInfoDisplay() {
    const userInfoDiv = document.querySelector('.user-info');
    if (userInfoDiv) {
        userInfoDiv.innerHTML = '';
    }
}

// Show loading indicator
function showLoader() {
    if (loader) loader.style.display = 'flex';
}

// Hide loading indicator
function hideLoader() {
    if (loader) loader.style.display = 'none';
}

// Modal Functions
function showLoginModal() {
    if (!modalContainer) return;
    
    modalContainer.innerHTML = `
      <div class="auth-modal">
        <div class="modal-header">
          <h2>Login</h2>
          <button class="close-modal">&times;</button>
        </div>
        <form id="login-form">
          <div class="form-group">
            <label for="login-email">Email</label>
            <input type="email" id="login-email" required>
          </div>
          <div class="form-group">
            <label for="login-password">Password</label>
            <input type="password" id="login-password" required>
          </div>
          <button type="submit" class="submit-btn">Login</button>
        </form>
        <p class="switch-form">Don't have an account? <a href="#" id="switch-to-register">Register</a></p>
        <p class="error-message" id="login-error"></p>
      </div>
    `;

    // Show modal
    modalContainer.style.display = 'flex';

    // Add event listeners
    document.querySelector('.close-modal').addEventListener('click', closeModal);
    document.getElementById('switch-to-register').addEventListener('click', (e) => {
        e.preventDefault();
        showRegisterModal();
    });

    // Login form submission
    document.getElementById('login-form').addEventListener('submit', handleLogin);
}

function showRegisterModal() {
    if (!modalContainer) return;
    
    modalContainer.innerHTML = `
      <div class="auth-modal">
        <div class="modal-header">
          <h2>Register</h2>
          <button class="close-modal">&times;</button>
        </div>
        <form id="register-form">
          <div class="form-group">
            <label for="register-name">Name</label>
            <input type="text" id="register-name" required>
          </div>
          <div class="form-group">
            <label for="register-email">Email</label>
            <input type="email" id="register-email" required>
          </div>
          <div class="form-group">
            <label for="register-password">Password</label>
            <input type="password" id="register-password" required>
          </div>
          <div class="form-group">
            <label for="register-confirm-password">Confirm Password</label>
            <input type="password" id="register-confirm-password" required>
          </div>
          <button type="submit" class="submit-btn">Register</button>
        </form>
        <p class="switch-form">Already have an account? <a href="#" id="switch-to-login">Login</a></p>
        <p class="error-message" id="register-error"></p>
      </div>
    `;

    // Show modal
    modalContainer.style.display = 'flex';

    // Add event listeners
    document.querySelector('.close-modal').addEventListener('click', closeModal);
    document.getElementById('switch-to-login').addEventListener('click', (e) => {
        e.preventDefault();
        showLoginModal();
    });

    // Register form submission
    document.getElementById('register-form').addEventListener('submit', handleRegister);
}

function closeModal() {
    if (modalContainer) {
        modalContainer.style.display = 'none';
    }
}

// Authentication Functions
async function handleLogin(e) {
    e.preventDefault();
    
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    const errorElement = document.getElementById('login-error');
    
    // Clear previous errors
    if (errorElement) errorElement.textContent = '';
    
    try {
        showLoader();
        
        // Sign in with Firebase Auth
        await auth.signInWithEmailAndPassword(email, password);
        
        const currentUser = auth.currentUser;
        if (currentUser && !currentUser.emailVerified) {
            await auth.signOut();
            throw new Error("Please verify your email before logging in.");
        }
        
        // Close modal on success
        closeModal();
        
        // Success message
        alert('Login successful!');
        
    } catch (error) {
        console.error('Login error:', error);
        if (errorElement) errorElement.textContent = error.message;
    } finally {
        hideLoader();
    }
}

async function handleRegister(e) {
    e.preventDefault();
    
    const name = document.getElementById('register-name').value;
    const email = document.getElementById('register-email').value;
    const password = document.getElementById('register-password').value;
    const confirmPassword = document.getElementById('register-confirm-password').value;
    const errorElement = document.getElementById('register-error');
    
    // Clear previous errors
    if (errorElement) errorElement.textContent = '';
    
    // Validate passwords match
    if (password !== confirmPassword) {
        if (errorElement) errorElement.textContent = 'Passwords do not match';
        return;
    }
    
    try {
        showLoader();
        
        // Create user in Firebase Auth
        const userCredential = await auth.createUserWithEmailAndPassword(email, password);
        const user = userCredential.user;
        
        // Send verification email
        await user.sendEmailVerification();
        
        // Add user to Firestore database
        await db.collection('users').doc(user.uid).set({
            name: name,
            email: email,
            createdAt: firebase.firestore.FieldValue.serverTimestamp()
        });
        
        // Close modal on success
        closeModal();
        
        // Sign out the user until they verify email
        await auth.signOut();
        
        // Success message
        alert('Registration successful! Verification email sent. Please verify your email before logging in.');
        
    } catch (error) {
        console.error('Registration error:', error);
        if (errorElement) errorElement.textContent = error.message;
    } finally {
        hideLoader();
    }
}

// Logout function
async function handleLogout() {
    try {
        showLoader();
        await auth.signOut();
        alert('Logged out successfully!');
    } catch (error) {
        console.error('Logout error:', error);
    } finally {
        hideLoader();
    }
}

// QR Code visibility toggle
let lastScrollTop = 0;
const qrCodeImg = document.querySelector('.qr-code');

window.addEventListener('scroll', function() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    if (qrCodeImg) {
        if (scrollTop > lastScrollTop) {
            // Scroll down - show QR code
            qrCodeImg.classList.add('visible');
            qrCodeImg.classList.remove('hidden');
        } else {
            // Scroll up - hide QR code
            qrCodeImg.classList.add('hidden');
            qrCodeImg.classList.remove('visible');
        }
    }
    
    lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
});

// Email link functionality
document.addEventListener('DOMContentLoaded', function() {
    const sendLinkBtn = document.getElementById('sendLinkBtn');
    if (sendLinkBtn) {
        sendLinkBtn.addEventListener('click', function() {
            const email = document.getElementById('emailInput').value;
            if (email) {
                alert(`App link sent to ${email}`);
                // Here you would typically integrate with a service to send the email
            } else {
                alert('Please enter a valid email address');
            }
        });
    }
});