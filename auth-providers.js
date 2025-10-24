// Authentication providers module for Google and Apple Sign-In
// This module handles OAuth authentication flows with proper error handling and security

class AuthProviders {
    constructor() {
        this.isGoogleLoading = false;
        this.isAppleLoading = false;
        this.initializeProviders();
    }

    initializeProviders() {
        try {
            // Wait for Firebase to be ready
            if (typeof firebase === 'undefined') {
                console.error('Firebase not loaded');
                return;
            }

            // Initialize Google Auth Provider
            this.googleProvider = new firebase.auth.GoogleAuthProvider();
            this.googleProvider.addScope('email');
            this.googleProvider.addScope('profile');
            
            // Initialize Apple Auth Provider (OAuthProvider for Apple)
            this.appleProvider = new firebase.auth.OAuthProvider('apple.com');
            this.appleProvider.addScope('email');
            this.appleProvider.addScope('name');

            console.log('OAuth providers initialized successfully');
        } catch (error) {
            console.error('Error initializing OAuth providers:', error);
            this.showError('Authentication providers failed to initialize.');
        }
    }

    // Google Sign-In implementation
    async signInWithGoogle() {
        if (this.isGoogleLoading) return;
        
        try {
            this.isGoogleLoading = true;
            this.updateLoadingState('google', true);
            this.clearError();

            // Set custom parameters for better UX
            this.googleProvider.setCustomParameters({
                'prompt': 'select_account'
            });

            const result = await firebase.auth().signInWithPopup(this.googleProvider);
            const user = result.user;
            
            console.log('Google Sign-In successful:', user.email);
            
            // Handle new user registration
            if (result?.additionalUserInfo?.isNewUser) {
                await this.handleNewUser(user, 'google');
            }
            
            // Store additional user info if needed
            await this.handleSuccessfulAuth(user, 'google');
            
            return { success: true, user };
        } catch (error) {
            console.error('Google Sign-In Error:', error);
            
            // Comprehensive error handling
            switch (error.code) {
                case 'auth/popup-closed-by-user':
                    this.showError('Sign-in was cancelled. Please try again.');
                    break;
                case 'auth/popup-blocked':
                    this.showError('Popup was blocked. Please allow popups and try again.');
                    break;
                case 'auth/account-exists-with-different-credential':
                    this.showError('An account already exists with this email using a different sign-in method.');
                    break;
                case 'auth/network-request-failed':
                    this.showError('Network error. Please check your connection and try again.');
                    break;
                case 'auth/too-many-requests':
                    this.showError('Too many failed attempts. Please try again later.');
                    break;
                case 'auth/user-disabled':
                    this.showError('This account has been disabled. Please contact support.');
                    break;
                case 'auth/operation-not-allowed':
                    this.showError('Google Sign-In is not enabled. Please contact support.');
                    break;
                case 'auth/invalid-api-key':
                    this.showError('Authentication configuration error. Please contact support.');
                    break;
                default:
                    this.showError(`Google Sign-In failed: ${error.message || 'Please try again.'}`);
            }
            return this.handleAuthError(error, 'google');
        } finally {
            this.isGoogleLoading = false;
            this.updateLoadingState('google', false);
        }
    }

    // Apple Sign-In implementation
    async signInWithApple() {
        if (this.isAppleLoading) return;
        
        try {
            this.isAppleLoading = true;
            this.updateLoadingState('apple', true);
            this.clearError();

            // Set custom parameters for Apple Sign-In
            this.appleProvider.setCustomParameters({
                'locale': 'en'
            });

            const result = await firebase.auth().signInWithPopup(this.appleProvider);
            const user = result.user;
            
            console.log('Apple Sign-In successful:', user.email);
            
            // Handle new user registration
            if (result?.additionalUserInfo?.isNewUser) {
                await this.handleNewUser(user, 'apple');
            }
            
            // Store additional user info if needed
            await this.handleSuccessfulAuth(user, 'apple');
            
            return { success: true, user };
        } catch (error) {
            console.error('Apple Sign-In Error:', error);
            
            // Comprehensive error handling for Apple Sign-In
            switch (error.code) {
                case 'auth/popup-closed-by-user':
                    this.showError('Sign-in was cancelled. Please try again.');
                    break;
                case 'auth/popup-blocked':
                    this.showError('Popup was blocked. Please allow popups and try again.');
                    break;
                case 'auth/account-exists-with-different-credential':
                    this.showError('An account already exists with this email using a different sign-in method.');
                    break;
                case 'auth/operation-not-supported-in-this-environment':
                    this.showError('Apple Sign-In is not supported in this environment.');
                    break;
                case 'auth/network-request-failed':
                    this.showError('Network error. Please check your connection and try again.');
                    break;
                case 'auth/too-many-requests':
                    this.showError('Too many failed attempts. Please try again later.');
                    break;
                case 'auth/user-disabled':
                    this.showError('This account has been disabled. Please contact support.');
                    break;
                case 'auth/operation-not-allowed':
                    this.showError('Apple Sign-In is not enabled. Please contact support.');
                    break;
                case 'auth/invalid-api-key':
                    this.showError('Authentication configuration error. Please contact support.');
                    break;
                default:
                    this.showError(`Apple Sign-In failed: ${error.message || 'Please try again.'}`);
            }
            return this.handleAuthError(error, 'apple');
        } finally {
            this.isAppleLoading = false;
            this.updateLoadingState('apple', false);
        }
    }

    // Handle new user registration
    async handleNewUser(user, provider) {
        try {
            if (typeof firebase.firestore !== 'undefined') {
                const userData = {
                    uid: user.uid,
                    email: user.email,
                    displayName: user.displayName,
                    photoURL: user.photoURL,
                    provider: provider,
                    createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                    isNewUser: true
                };
                
                await firebase.firestore().collection('users').doc(user.uid).set(userData);
            }
        } catch (error) {
            console.error('Error creating new user record:', error);
        }
    }

    // Handle successful authentication
    async handleSuccessfulAuth(user, provider) {
        try {
            console.log(`Authentication successful for ${user.email} via ${provider}`);
            
            // Show success message briefly before redirect
            this.showError(`Welcome ${user.displayName || user.email}! Redirecting...`, 'success');
            
            // Check if Firestore is available
            if (typeof firebase.firestore !== 'undefined' && typeof firebase.firestore.FieldValue !== 'undefined') {
                const userDocRef = firebase.firestore().collection('users').doc(user.uid);
                const userDoc = await userDocRef.get();
                
                if (userDoc.exists) {
                    // User document exists, only update lastLogin and other updatable fields
                    const updateData = {
                        displayName: user.displayName,
                        photoURL: user.photoURL,
                        provider: provider,
                        lastLogin: firebase.firestore.FieldValue.serverTimestamp()
                    };
                    await userDocRef.update(updateData);
                    console.log('User data updated successfully');
                } else {
                    // User document doesn't exist, create it with createdAt
                    const userData = {
                        uid: user.uid,
                        email: user.email,
                        displayName: user.displayName,
                        photoURL: user.photoURL,
                        provider: provider,
                        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                        lastLogin: firebase.firestore.FieldValue.serverTimestamp()
                    };
                    await userDocRef.set(userData, { merge: false });
                    console.log('User data created successfully');
                }
            }

            // Add a small delay to show success message, then redirect
            setTimeout(() => {
                console.log('Redirecting to welcome page...');
                window.location.href = 'welcome.html';
            }, 1500);
            
        } catch (error) {
            console.error('Error storing user data:', error);
            // Still redirect even if storage fails
            this.showError('Authentication successful! Redirecting...', 'success');
            setTimeout(() => {
                console.log('Redirecting to welcome page (after error)...');
                window.location.href = 'welcome.html';
            }, 1500);
        }
    }

    // Handle authentication errors
    handleAuthError(error, provider) {
        let errorMessage = 'Authentication failed. Please try again.';
        
        switch (error.code) {
            case 'auth/popup-closed-by-user':
                errorMessage = 'Sign-in was cancelled.';
                break;
            case 'auth/popup-blocked':
                errorMessage = 'Pop-up was blocked. Please allow pop-ups and try again.';
                break;
            case 'auth/cancelled-popup-request':
                errorMessage = 'Sign-in was cancelled.';
                break;
            case 'auth/network-request-failed':
                errorMessage = 'Network error. Please check your connection and try again.';
                break;
            case 'auth/too-many-requests':
                errorMessage = 'Too many attempts. Please try again later.';
                break;
            case 'auth/user-disabled':
                errorMessage = 'This account has been disabled.';
                break;
            default:
                errorMessage = `${provider} sign-in failed: ${error.message}`;
        }

        this.showError(errorMessage);
        return { success: false, error: errorMessage };
    }

    // Update loading states for buttons
    updateLoadingState(provider, isLoading) {
        const button = document.getElementById(`${provider}-signin-btn`);
        const loader = button?.querySelector('.auth-loader');
        const text = button?.querySelector('.auth-btn-text');
        
        if (button) {
            button.disabled = isLoading;
            if (loader) {
                loader.style.display = isLoading ? 'inline-block' : 'none';
            }
            if (text) {
                text.textContent = isLoading ? 'Signing in...' : `Continue with ${provider.charAt(0).toUpperCase() + provider.slice(1)}`;
            }
        }
    }

    // Show error messages
    showError(message, type = 'error') {
        let errorDiv = document.getElementById('auth-error-message');
        if (!errorDiv) {
            errorDiv = document.createElement('div');
            errorDiv.id = 'auth-error-message';
            errorDiv.style.cssText = `
                border-radius: 6px;
                padding: 12px;
                margin: 10px 0;
                font-size: 14px;
                text-align: center;
            `;
            
            // Insert after the form or at the end of login container
            const container = document.querySelector('.login-container') || document.querySelector('.right-panel');
            if (container) {
                container.appendChild(errorDiv);
            }
        }
        
        errorDiv.textContent = message;
        errorDiv.style.display = 'block';
        
        // Add styling based on message type
        if (type === 'error') {
            errorDiv.style.color = '#dc2626';
            errorDiv.style.backgroundColor = '#fef2f2';
            errorDiv.style.border = '1px solid #fecaca';
        } else {
            errorDiv.style.color = '#2563eb';
            errorDiv.style.backgroundColor = '#dbeafe';
            errorDiv.style.border = '1px solid #bfdbfe';
        }
        
        // Auto-hide after 7 seconds for better UX
        setTimeout(() => {
            if (errorDiv) {
                errorDiv.style.display = 'none';
            }
        }, 7000);
    }

    // Clear error messages
    clearError() {
        const errorDiv = document.getElementById('auth-error-message');
        if (errorDiv) {
            errorDiv.style.display = 'none';
        }
    }
}

// Initialize the auth providers when the script loads
let authProviders;

// Wait for Firebase to be ready
function initializeAuthProviders() {
    if (typeof firebase !== 'undefined' && firebase.apps && firebase.apps.length > 0) {
        authProviders = new AuthProviders();
        return true;
    }
    return false;
}

// Try to initialize immediately, or wait for Firebase
if (!initializeAuthProviders()) {
    // If Firebase isn't ready, wait for it
    const checkFirebase = setInterval(() => {
        if (initializeAuthProviders()) {
            clearInterval(checkFirebase);
        }
    }, 100);
}

// Global functions for OAuth authentication
async function signInWithGoogle() {
    const authProviders = new AuthProviders();
    await authProviders.signInWithGoogle();
}

async function signInWithApple() {
    const authProviders = new AuthProviders();
    await authProviders.signInWithApple();
}

// Initialize providers when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    const authProviders = new AuthProviders();
    authProviders.initializeProviders();
});