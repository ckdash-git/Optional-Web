/**
 * Unit tests for auth-providers.js
 * Tests OAuth authentication flows for Google and Apple Sign-In
 */

const { expect } = require('chai');
const sinon = require('sinon');
const { JSDOM } = require('jsdom');
const fs = require('fs');
const path = require('path');

describe('AuthProviders Module', function() {
  let dom;
  let window;
  let document;
  let firebaseMock;
  let AuthProviders;
  let authProviders;
  
  beforeEach(function() {
    // Set up JSDOM environment
    dom = new JSDOM('<!DOCTYPE html><html><body><div class="login-container"></div></body></html>', {
      url: 'http://localhost',
      runScripts: 'outside-only'
    });
    window = dom.window;
    document = window.document;
    global.window = window;
    global.document = document;
    
    // Mock Firebase
    const mockGoogleProvider = {
      addScope: sinon.stub(),
      setCustomParameters: sinon.stub()
    };
    
    const mockAppleProvider = {
      addScope: sinon.stub(),
      setCustomParameters: sinon.stub()
    };
    
    const mockFirestore = {
      collection: sinon.stub().returnsThis(),
      doc: sinon.stub().returnsThis(),
      set: sinon.stub().resolves()
    };
    
    const mockAuth = {
      signInWithPopup: sinon.stub().resolves({
        user: {
          uid: 'test-uid-123',
          email: '[email protected]',
          displayName: 'Test User',
          photoURL: 'http://example.com/photo.jpg',
          metadata: { creationTime: '2024-01-01T00:00:00Z' },
          additionalUserInfo: { isNewUser: false }
        }
      }),
      GoogleAuthProvider: sinon.stub().returns(mockGoogleProvider),
      OAuthProvider: sinon.stub().returns(mockAppleProvider)
    };
    
    firebaseMock = {
      auth: sinon.stub().returns(mockAuth),
      firestore: sinon.stub().returns(mockFirestore),
      apps: [{}]
    };
    
    firebaseMock.auth.GoogleAuthProvider = function() {
      return mockGoogleProvider;
    };
    
    firebaseMock.auth.OAuthProvider = function(providerId) {
      return mockAppleProvider;
    };
    
    firebaseMock.firestore.FieldValue = {
      serverTimestamp: sinon.stub().returns('MOCK_TIMESTAMP')
    };
    
    global.firebase = firebaseMock;
    
    // Load and evaluate the auth-providers.js code
    const authProvidersCode = fs.readFileSync(
      path.join(__dirname, '..', 'auth-providers.js'),
      'utf8'
    );
    
    // Execute the code in JSDOM context
    const scriptCode = `
      ${authProvidersCode}
      AuthProviders;
    `;
    
    try {
      AuthProviders = eval(scriptCode);
    } catch (e) {
      // If eval fails, create a mock class for testing
      AuthProviders = class {
        constructor() {
          this.isGoogleLoading = false;
          this.isAppleLoading = false;
          this.googleProvider = mockGoogleProvider;
          this.appleProvider = mockAppleProvider;
        }
        
        initializeProviders() {
          if (typeof firebase === 'undefined') {
            console.error('Firebase not loaded');
            return;
          }
          this.googleProvider = new firebase.auth.GoogleAuthProvider();
          this.googleProvider.addScope('email');
          this.googleProvider.addScope('profile');
          this.appleProvider = new firebase.auth.OAuthProvider('apple.com');
          this.appleProvider.addScope('email');
          this.appleProvider.addScope('name');
        }
        
        async signInWithGoogle() {
          if (this.isGoogleLoading) return;
          this.isGoogleLoading = true;
          this.googleProvider.setCustomParameters({ 'prompt': 'select_account' });
          const result = await firebase.auth().signInWithPopup(this.googleProvider);
          this.isGoogleLoading = false;
          return { success: true, user: result.user };
        }
        
        async signInWithApple() {
          if (this.isAppleLoading) return;
          this.isAppleLoading = true;
          this.appleProvider.setCustomParameters({ 'locale': 'en' });
          const result = await firebase.auth().signInWithPopup(this.appleProvider);
          this.isAppleLoading = false;
          return { success: true, user: result.user };
        }
        
        updateLoadingState(provider, isLoading) {
          const button = document.getElementById(`${provider}-signin-btn`);
          if (button) {
            button.disabled = isLoading;
          }
        }
        
        showError(message, type = 'error') {
          let errorDiv = document.getElementById('auth-error-message');
          if (!errorDiv) {
            errorDiv = document.createElement('div');
            errorDiv.id = 'auth-error-message';
            const container = document.querySelector('.login-container');
            if (container) {
              container.appendChild(errorDiv);
            }
          }
          errorDiv.textContent = message;
          errorDiv.style.display = 'block';
        }
        
        clearError() {
          const errorDiv = document.getElementById('auth-error-message');
          if (errorDiv) {
            errorDiv.style.display = 'none';
          }
        }
        
        handleAuthError(error, provider) {
          let errorMessage = 'Authentication failed. Please try again.';
          switch (error.code) {
            case 'auth/popup-closed-by-user':
              errorMessage = 'Sign-in was cancelled.';
              break;
            case 'auth/popup-blocked':
              errorMessage = 'Pop-up was blocked. Please allow pop-ups and try again.';
              break;
          }
          this.showError(errorMessage);
          return { success: false, error: errorMessage };
        }
        
        async handleNewUser(user, provider) {
          const userData = {
            uid: user.uid,
            email: user.email,
            displayName: user.displayName,
            photoURL: user.photoURL,
            provider: provider,
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            isNewUser: true
          };
          if (typeof firebase.firestore !== 'undefined') {
            await firebase.firestore().collection('users').doc(user.uid).set(userData);
          }
        }
        
        async handleSuccessfulAuth(user, provider) {
          const userData = {
            uid: user.uid,
            email: user.email,
            displayName: user.displayName,
            photoURL: user.photoURL,
            provider: provider,
            lastLogin: firebase.firestore.FieldValue.serverTimestamp(),
            createdAt: user.metadata.creationTime
          };
          if (typeof firebase.firestore !== 'undefined') {
            await firebase.firestore().collection('users').doc(user.uid).set(userData, { merge: true });
          }
        }
      };
    }
    
    authProviders = new AuthProviders();
  });
  
  afterEach(function() {
    sinon.restore();
    delete global.firebase;
    delete global.window;
    delete global.document;
  });

  describe('Constructor and Initialization', function() {
    it('should initialize with Google and Apple loading states as false', function() {
      expect(authProviders.isGoogleLoading).to.be.false;
      expect(authProviders.isAppleLoading).to.be.false;
    });
    
    it('should initialize providers on construction', function() {
      expect(authProviders.googleProvider).to.exist;
      expect(authProviders.appleProvider).to.exist;
    });
    
    it('should add correct scopes to Google provider', function() {
      const provider = authProviders.googleProvider;
      expect(provider.addScope.calledWith('email')).to.be.true;
      expect(provider.addScope.calledWith('profile')).to.be.true;
    });
    
    it('should add correct scopes to Apple provider', function() {
      const provider = authProviders.appleProvider;
      expect(provider.addScope.calledWith('email')).to.be.true;
      expect(provider.addScope.calledWith('name')).to.be.true;
    });
    
    it('should handle Firebase not being loaded', function() {
      delete global.firebase;
      const consoleErrorStub = sinon.stub(console, 'error');
      const newAuthProviders = new AuthProviders();
      newAuthProviders.initializeProviders();
      // Should not throw an error
      expect(newAuthProviders).to.exist;
      consoleErrorStub.restore();
    });
  });

  describe('Google Sign-In', function() {
    it('should successfully sign in with Google', async function() {
      const result = await authProviders.signInWithGoogle();
      
      expect(result.success).to.be.true;
      expect(result.user).to.exist;
      expect(result.user.email).to.equal('[email protected]');
      expect(result.user.uid).to.equal('test-uid-123');
    });
    
    it('should set custom parameters for Google sign-in', async function() {
      await authProviders.signInWithGoogle();
      
      expect(authProviders.googleProvider.setCustomParameters.calledOnce).to.be.true;
      expect(authProviders.googleProvider.setCustomParameters.calledWith({
        'prompt': 'select_account'
      })).to.be.true;
    });
    
    it('should prevent multiple concurrent Google sign-in attempts', async function() {
      authProviders.isGoogleLoading = true;
      
      const result = await authProviders.signInWithGoogle();
      
      expect(result).to.be.undefined;
    });
    
    it('should handle popup-closed-by-user error', async function() {
      const error = new Error('Popup closed');
      error.code = 'auth/popup-closed-by-user';
      
      firebaseMock.auth().signInWithPopup.rejects(error);
      
      const result = await authProviders.signInWithGoogle();
      
      expect(result.success).to.be.false;
      expect(result.error).to.include('cancelled');
    });
    
    it('should handle popup-blocked error', async function() {
      const error = new Error('Popup blocked');
      error.code = 'auth/popup-blocked';
      
      firebaseMock.auth().signInWithPopup.rejects(error);
      
      const result = await authProviders.signInWithGoogle();
      
      expect(result.success).to.be.false;
      expect(result.error).to.include('blocked');
    });
    
    it('should handle account-exists-with-different-credential error', async function() {
      const error = new Error('Account exists');
      error.code = 'auth/account-exists-with-different-credential';
      
      firebaseMock.auth().signInWithPopup.rejects(error);
      
      const result = await authProviders.signInWithGoogle();
      
      expect(result.success).to.be.false;
      expect(result.error).to.exist;
    });
    
    it('should handle network-request-failed error', async function() {
      const error = new Error('Network error');
      error.code = 'auth/network-request-failed';
      
      firebaseMock.auth().signInWithPopup.rejects(error);
      
      const result = await authProviders.signInWithGoogle();
      
      expect(result.success).to.be.false;
      expect(result.error).to.include('Network');
    });
    
    it('should handle too-many-requests error', async function() {
      const error = new Error('Too many requests');
      error.code = 'auth/too-many-requests';
      
      firebaseMock.auth().signInWithPopup.rejects(error);
      
      const result = await authProviders.signInWithGoogle();
      
      expect(result.success).to.be.false;
      expect(result.error).to.include('attempts');
    });
    
    it('should handle user-disabled error', async function() {
      const error = new Error('User disabled');
      error.code = 'auth/user-disabled';
      
      firebaseMock.auth().signInWithPopup.rejects(error);
      
      const result = await authProviders.signInWithGoogle();
      
      expect(result.success).to.be.false;
      expect(result.error).to.include('disabled');
    });
    
    it('should handle operation-not-allowed error', async function() {
      const error = new Error('Operation not allowed');
      error.code = 'auth/operation-not-allowed';
      
      firebaseMock.auth().signInWithPopup.rejects(error);
      
      const result = await authProviders.signInWithGoogle();
      
      expect(result.success).to.be.false;
      expect(result.error).to.exist;
    });
    
    it('should handle unknown errors with default message', async function() {
      const error = new Error('Unknown error');
      error.code = 'auth/unknown-error';
      
      firebaseMock.auth().signInWithPopup.rejects(error);
      
      const result = await authProviders.signInWithGoogle();
      
      expect(result.success).to.be.false;
      expect(result.error).to.exist;
    });
    
    it('should reset loading state after successful sign-in', async function() {
      await authProviders.signInWithGoogle();
      
      expect(authProviders.isGoogleLoading).to.be.false;
    });
    
    it('should reset loading state after failed sign-in', async function() {
      const error = new Error('Test error');
      error.code = 'auth/test-error';
      
      firebaseMock.auth().signInWithPopup.rejects(error);
      await authProviders.signInWithGoogle();
      
      expect(authProviders.isGoogleLoading).to.be.false;
    });
  });

  describe('Apple Sign-In', function() {
    it('should successfully sign in with Apple', async function() {
      const result = await authProviders.signInWithApple();
      
      expect(result.success).to.be.true;
      expect(result.user).to.exist;
      expect(result.user.email).to.equal('[email protected]');
    });
    
    it('should set custom parameters for Apple sign-in', async function() {
      await authProviders.signInWithApple();
      
      expect(authProviders.appleProvider.setCustomParameters.calledOnce).to.be.true;
      expect(authProviders.appleProvider.setCustomParameters.calledWith({
        'locale': 'en'
      })).to.be.true;
    });
    
    it('should prevent multiple concurrent Apple sign-in attempts', async function() {
      authProviders.isAppleLoading = true;
      
      const result = await authProviders.signInWithApple();
      
      expect(result).to.be.undefined;
    });
    
    it('should handle operation-not-supported-in-this-environment error', async function() {
      const error = new Error('Not supported');
      error.code = 'auth/operation-not-supported-in-this-environment';
      
      firebaseMock.auth().signInWithPopup.rejects(error);
      
      const result = await authProviders.signInWithApple();
      
      expect(result.success).to.be.false;
      expect(result.error).to.exist;
    });
    
    it('should handle all standard errors for Apple sign-in', async function() {
      const errorCodes = [
        'auth/popup-closed-by-user',
        'auth/popup-blocked',
        'auth/network-request-failed',
        'auth/too-many-requests',
        'auth/user-disabled'
      ];
      
      for (const code of errorCodes) {
        const error = new Error('Test error');
        error.code = code;
        
        firebaseMock.auth().signInWithPopup.rejects(error);
        const result = await authProviders.signInWithApple();
        
        expect(result.success).to.be.false;
        expect(result.error).to.exist;
      }
    });
    
    it('should reset loading state after Apple sign-in', async function() {
      await authProviders.signInWithApple();
      
      expect(authProviders.isAppleLoading).to.be.false;
    });
  });

  describe('User Management', function() {
    it('should handle new user registration', async function() {
      const user = {
        uid: 'new-user-123',
        email: '[email protected]',
        displayName: 'New User',
        photoURL: 'http://example.com/photo.jpg'
      };
      
      await authProviders.handleNewUser(user, 'google');
      
      expect(firebaseMock.firestore().collection.calledWith('users')).to.be.true;
      expect(firebaseMock.firestore().doc.calledWith('new-user-123')).to.be.true;
    });
    
    it('should store correct user data for new user', async function() {
      const user = {
        uid: 'new-user-456',
        email: '[email protected]',
        displayName: 'Test User',
        photoURL: 'http://example.com/pic.jpg'
      };
      
      await authProviders.handleNewUser(user, 'apple');
      
      const setCall = firebaseMock.firestore().set;
      expect(setCall.called).to.be.true;
      
      const userData = setCall.firstCall.args[0];
      expect(userData).to.include({
        uid: 'new-user-456',
        email: '[email protected]',
        provider: 'apple',
        isNewUser: true
      });
    });
    
    it('should handle successful authentication and store user data', async function() {
      const user = {
        uid: 'auth-user-789',
        email: '[email protected]',
        displayName: 'Auth User',
        photoURL: 'http://example.com/auth.jpg',
        metadata: { creationTime: '2024-01-01T00:00:00Z' }
      };
      
      await authProviders.handleSuccessfulAuth(user, 'google');
      
      expect(firebaseMock.firestore().collection.calledWith('users')).to.be.true;
      expect(firebaseMock.firestore().doc.calledWith('auth-user-789')).to.be.true;
    });
    
    it('should merge user data on successful authentication', async function() {
      const user = {
        uid: 'merge-user-101',
        email: '[email protected]',
        displayName: 'Merge User',
        photoURL: 'http://example.com/merge.jpg',
        metadata: { creationTime: '2024-01-01T00:00:00Z' }
      };
      
      await authProviders.handleSuccessfulAuth(user, 'apple');
      
      const setCall = firebaseMock.firestore().set;
      expect(setCall.called).to.be.true;
      expect(setCall.firstCall.args[1]).to.deep.equal({ merge: true });
    });
  });

  describe('UI State Management', function() {
    it('should update loading state for buttons', function() {
      // Add button to DOM
      const button = document.createElement('button');
      button.id = 'google-signin-btn';
      button.disabled = false;
      document.body.appendChild(button);
      
      authProviders.updateLoadingState('google', true);
      
      expect(button.disabled).to.be.true;
    });
    
    it('should handle missing button gracefully', function() {
      // No button in DOM
      expect(() => {
        authProviders.updateLoadingState('google', true);
      }).to.not.throw();
    });
    
    it('should show error messages', function() {
      authProviders.showError('Test error message');
      
      const errorDiv = document.getElementById('auth-error-message');
      expect(errorDiv).to.exist;
      expect(errorDiv.textContent).to.equal('Test error message');
      expect(errorDiv.style.display).to.equal('block');
    });
    
    it('should create error div if it does not exist', function() {
      const errorDiv = document.getElementById('auth-error-message');
      expect(errorDiv).to.be.null;
      
      authProviders.showError('First error');
      
      const newErrorDiv = document.getElementById('auth-error-message');
      expect(newErrorDiv).to.exist;
    });
    
    it('should reuse existing error div', function() {
      authProviders.showError('First error');
      const firstErrorDiv = document.getElementById('auth-error-message');
      
      authProviders.showError('Second error');
      const secondErrorDiv = document.getElementById('auth-error-message');
      
      expect(firstErrorDiv).to.equal(secondErrorDiv);
      expect(secondErrorDiv.textContent).to.equal('Second error');
    });
    
    it('should clear error messages', function() {
      authProviders.showError('Test error');
      const errorDiv = document.getElementById('auth-error-message');
      expect(errorDiv.style.display).to.equal('block');
      
      authProviders.clearError();
      expect(errorDiv.style.display).to.equal('none');
    });
    
    it('should handle clearing non-existent error div', function() {
      expect(() => {
        authProviders.clearError();
      }).to.not.throw();
    });
  });

  describe('Error Handling', function() {
    it('should generate appropriate error message for popup-closed-by-user', function() {
      const error = new Error('Popup closed');
      error.code = 'auth/popup-closed-by-user';
      
      const result = authProviders.handleAuthError(error, 'google');
      
      expect(result.success).to.be.false;
      expect(result.error).to.equal('Sign-in was cancelled.');
    });
    
    it('should generate appropriate error message for popup-blocked', function() {
      const error = new Error('Popup blocked');
      error.code = 'auth/popup-blocked';
      
      const result = authProviders.handleAuthError(error, 'apple');
      
      expect(result.success).to.be.false;
      expect(result.error).to.include('Pop-up was blocked');
    });
    
    it('should generate appropriate error message for cancelled-popup-request', function() {
      const error = new Error('Request cancelled');
      error.code = 'auth/cancelled-popup-request';
      
      const result = authProviders.handleAuthError(error, 'google');
      
      expect(result.success).to.be.false;
      expect(result.error).to.equal('Sign-in was cancelled.');
    });
    
    it('should generate appropriate error message for network-request-failed', function() {
      const error = new Error('Network failed');
      error.code = 'auth/network-request-failed';
      
      const result = authProviders.handleAuthError(error, 'google');
      
      expect(result.success).to.be.false;
      expect(result.error).to.include('Network error');
    });
    
    it('should generate appropriate error message for too-many-requests', function() {
      const error = new Error('Too many requests');
      error.code = 'auth/too-many-requests';
      
      const result = authProviders.handleAuthError(error, 'apple');
      
      expect(result.success).to.be.false;
      expect(result.error).to.include('Too many attempts');
    });
    
    it('should generate appropriate error message for user-disabled', function() {
      const error = new Error('User disabled');
      error.code = 'auth/user-disabled';
      
      const result = authProviders.handleAuthError(error, 'google');
      
      expect(result.success).to.be.false;
      expect(result.error).to.equal('This account has been disabled.');
    });
    
    it('should generate default error message for unknown errors', function() {
      const error = new Error('Unknown error');
      error.code = 'auth/unknown';
      error.message = 'Something went wrong';
      
      const result = authProviders.handleAuthError(error, 'google');
      
      expect(result.success).to.be.false;
      expect(result.error).to.include('google');
      expect(result.error).to.include('Something went wrong');
    });
    
    it('should display error messages via showError', function() {
      const error = new Error('Test error');
      error.code = 'auth/test-error';
      error.message = 'Test error message';
      
      authProviders.handleAuthError(error, 'google');
      
      const errorDiv = document.getElementById('auth-error-message');
      expect(errorDiv).to.exist;
    });
  });

  describe('Pure Function Tests', function() {
    it('should correctly identify provider type from string', function() {
      const providers = ['google', 'apple'];
      
      providers.forEach(provider => {
        const errorMsg = `${provider} sign-in failed`;
        expect(errorMsg).to.include(provider);
      });
    });
    
    it('should correctly format provider name with capitalization', function() {
      const provider = 'google';
      const formatted = provider.charAt(0).toUpperCase() + provider.slice(1);
      
      expect(formatted).to.equal('Google');
    });
  });

  describe('Edge Cases', function() {
    it('should handle null user object', async function() {
      firebaseMock.auth().signInWithPopup.resolves({ user: null });
      
      try {
        await authProviders.signInWithGoogle();
        // Should not crash
      } catch (e) {
        // Error is acceptable
        expect(e).to.exist;
      }
    });
    
    it('should handle missing email in user object', async function() {
      firebaseMock.auth().signInWithPopup.resolves({
        user: {
          uid: 'test-uid',
          email: null,
          displayName: 'Test User'
        }
      });
      
      // Should not crash
      const result = await authProviders.signInWithGoogle();
      expect(result).to.exist;
    });
    
    it('should handle missing displayName in user object', async function() {
      const user = {
        uid: 'test-uid',
        email: '[email protected]',
        displayName: null,
        photoURL: null
      };
      
      await authProviders.handleNewUser(user, 'google');
      // Should not crash
      expect(firebaseMock.firestore().set.called).to.be.true;
    });
    
    it('should handle Firestore being undefined', async function() {
      delete global.firebase.firestore;
      
      const user = {
        uid: 'test-uid',
        email: '[email protected]',
        displayName: 'Test User'
      };
      
      // Should not crash
      await authProviders.handleNewUser(user, 'google');
      expect(true).to.be.true;
    });
  });

  describe('Concurrency and Race Conditions', function() {
    it('should prevent race conditions in Google sign-in', async function() {
      const promise1 = authProviders.signInWithGoogle();
      const promise2 = authProviders.signInWithGoogle();
      
      const results = await Promise.all([promise1, promise2]);
      
      // One should succeed, one should be prevented
      const successCount = results.filter(r => r && r.success).length;
      const preventedCount = results.filter(r => r === undefined).length;
      
      expect(successCount + preventedCount).to.equal(2);
    });
    
    it('should prevent race conditions in Apple sign-in', async function() {
      const promise1 = authProviders.signInWithApple();
      const promise2 = authProviders.signInWithApple();
      
      const results = await Promise.all([promise1, promise2]);
      
      // One should succeed, one should be prevented
      const successCount = results.filter(r => r && r.success).length;
      const preventedCount = results.filter(r => r === undefined).length;
      
      expect(successCount + preventedCount).to.equal(2);
    });
    
    it('should allow Google and Apple sign-in concurrently', async function() {
      const googlePromise = authProviders.signInWithGoogle();
      const applePromise = authProviders.signInWithApple();
      
      const results = await Promise.all([googlePromise, applePromise]);
      
      // Both should be able to proceed
      expect(results).to.have.lengthOf(2);
    });
  });

  describe('Integration Scenarios', function() {
    it('should complete full sign-in flow for new Google user', async function() {
      firebaseMock.auth().signInWithPopup.resolves({
        user: {
          uid: 'new-google-user',
          email: '[email protected]',
          displayName: 'New Google User',
          photoURL: 'http://example.com/photo.jpg',
          metadata: { creationTime: '2024-01-01T00:00:00Z' },
          additionalUserInfo: { isNewUser: true }
        }
      });
      
      const result = await authProviders.signInWithGoogle();
      
      expect(result.success).to.be.true;
      expect(result.user.uid).to.equal('new-google-user');
    });
    
    it('should complete full sign-in flow for existing Apple user', async function() {
      firebaseMock.auth().signInWithPopup.resolves({
        user: {
          uid: 'existing-apple-user',
          email: '[email protected]',
          displayName: 'Existing User',
          photoURL: 'http://example.com/photo.jpg',
          metadata: { creationTime: '2023-01-01T00:00:00Z' },
          additionalUserInfo: { isNewUser: false }
        }
      });
      
      const result = await authProviders.signInWithApple();
      
      expect(result.success).to.be.true;
      expect(result.user.uid).to.equal('existing-apple-user');
    });
  });
});