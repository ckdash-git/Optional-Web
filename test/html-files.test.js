/**
 * Unit tests for HTML files
 * Validates login.html and registration-html.html structure
 */

const { expect } = require('chai');
const { JSDOM } = require('jsdom');
const fs = require('fs');
const path = require('path');

describe('HTML Files', function() {
  describe('login.html', function() {
    let dom;
    let document;
    
    before(function() {
      const html = fs.readFileSync(
        path.join(__dirname, '..', 'login.html'),
        'utf8'
      );
      dom = new JSDOM(html);
      document = dom.window.document;
    });
    
    it('should exist and be valid HTML', function() {
      expect(document).to.exist;
      expect(document.doctype).to.exist;
    });
    
    it('should have proper DOCTYPE', function() {
      expect(document.doctype.name).to.equal('html');
    });
    
    it('should have a title', function() {
      const title = document.querySelector('title');
      expect(title).to.exist;
      expect(title.textContent).to.include('Login');
    });
    
    it('should include Firebase SDK scripts', function() {
      const scripts = Array.from(document.querySelectorAll('script'));
      const firebaseScripts = scripts.filter(s => 
        s.src.includes('firebase') || s.src.includes('firebasejs')
      );
      expect(firebaseScripts.length).to.be.greaterThan(0);
    });
    
    it('should include auth-providers.js script', function() {
      const scripts = Array.from(document.querySelectorAll('script'));
      const authProviderScript = scripts.find(s => 
        s.src.includes('auth-providers.js')
      );
      expect(authProviderScript).to.exist;
    });
    
    it('should have Google Sign-In button', function() {
      const googleBtn = document.querySelector('#google-signin-btn');
      expect(googleBtn).to.exist;
      expect(googleBtn.getAttribute('onclick')).to.include('signInWithGoogle');
    });
    
    it('should have Apple Sign-In button', function() {
      const appleBtn = document.querySelector('#apple-signin-btn');
      expect(appleBtn).to.exist;
      expect(appleBtn.getAttribute('onclick')).to.include('signInWithApple');
    });
    
    it('should have OAuth container', function() {
      const oauthContainer = document.querySelector('.oauth-container');
      expect(oauthContainer).to.exist;
    });
    
    it('should have OAuth divider text', function() {
      const oauthDivider = document.querySelector('.oauth-divider');
      expect(oauthDivider).to.exist;
      expect(oauthDivider.textContent).to.include('or continue with');
    });
    
    it('should have email input field', function() {
      const emailInput = document.querySelector('input[type="email"]');
      expect(emailInput).to.exist;
    });
    
    it('should have password input field', function() {
      const passwordInput = document.querySelector('input[type="password"]');
      expect(passwordInput).to.exist;
    });
    
    it('should have login form', function() {
      const form = document.querySelector('form');
      expect(form).to.exist;
    });
    
    it('should have submit button', function() {
      const submitBtn = document.querySelector('button[type="submit"]');
      expect(submitBtn).to.exist;
    });
    
    it('should have registration link', function() {
      const links = Array.from(document.querySelectorAll('a'));
      const regLink = links.find(a => a.href.includes('registration'));
      expect(regLink).to.exist;
    });
    
    it('should have Google OAuth icon', function() {
      const googleBtn = document.querySelector('#google-signin-btn');
      const svg = googleBtn.querySelector('svg');
      expect(svg).to.exist;
    });
    
    it('should have Apple OAuth icon', function() {
      const appleBtn = document.querySelector('#apple-signin-btn');
      const svg = appleBtn.querySelector('svg');
      expect(svg).to.exist;
    });
    
    it('should have auth-loader elements', function() {
      const loaders = document.querySelectorAll('.auth-loader');
      expect(loaders.length).to.equal(2); // One for Google, one for Apple
    });
    
    it('should have auth-btn-text elements', function() {
      const textElements = document.querySelectorAll('.auth-btn-text');
      expect(textElements.length).to.equal(2);
    });
    
    it('should have responsive viewport meta tag', function() {
      const viewportMeta = document.querySelector('meta[name="viewport"]');
      expect(viewportMeta).to.exist;
      expect(viewportMeta.getAttribute('content')).to.include('width=device-width');
    });
    
    it('should link to style.css', function() {
      const links = Array.from(document.querySelectorAll('link[rel="stylesheet"]'));
      const styleLink = links.find(l => l.href.includes('style.css'));
      expect(styleLink).to.exist;
    });
  });

  describe('registration-html.html', function() {
    let dom;
    let document;
    
    before(function() {
      const html = fs.readFileSync(
        path.join(__dirname, '..', 'registration-html.html'),
        'utf8'
      );
      dom = new JSDOM(html);
      document = dom.window.document;
    });
    
    it('should exist and be valid HTML', function() {
      expect(document).to.exist;
      expect(document.doctype).to.exist;
    });
    
    it('should have proper DOCTYPE', function() {
      expect(document.doctype.name).to.equal('html');
    });
    
    it('should have a title', function() {
      const title = document.querySelector('title');
      expect(title).to.exist;
      expect(title.textContent).to.exist;
    });
    
    it('should include Firebase SDK scripts', function() {
      const scripts = Array.from(document.querySelectorAll('script'));
      const firebaseScripts = scripts.filter(s => 
        s.src.includes('firebase') || s.src.includes('firebasejs')
      );
      expect(firebaseScripts.length).to.be.greaterThan(0);
    });
    
    it('should include Firestore SDK', function() {
      const scripts = Array.from(document.querySelectorAll('script'));
      const firestoreScript = scripts.find(s => 
        s.src.includes('firestore')
      );
      expect(firestoreScript).to.exist;
    });
    
    it('should include auth-providers.js script', function() {
      const scripts = Array.from(document.querySelectorAll('script'));
      const authProviderScript = scripts.find(s => 
        s.src && s.src.includes('auth-providers.js')
      );
      expect(authProviderScript).to.exist;
    });
    
    it('should have Google Sign-In button', function() {
      const googleBtn = document.querySelector('#google-signin-btn');
      expect(googleBtn).to.exist;
      expect(googleBtn.getAttribute('onclick')).to.include('signInWithGoogle');
    });
    
    it('should have Apple Sign-In button', function() {
      const appleBtn = document.querySelector('#apple-signin-btn');
      expect(appleBtn).to.exist;
      expect(appleBtn.getAttribute('onclick')).to.include('signInWithApple');
    });
    
    it('should have OAuth container', function() {
      const oauthContainer = document.querySelector('.oauth-container');
      expect(oauthContainer).to.exist;
    });
    
    it('should have OAuth divider', function() {
      const oauthDivider = document.querySelector('.oauth-divider');
      expect(oauthDivider).to.exist;
    });
    
    it('should have registration form', function() {
      const form = document.querySelector('form');
      expect(form).to.exist;
    });
    
    it('should have email input', function() {
      const emailInput = document.querySelector('input[type="email"]');
      expect(emailInput).to.exist;
    });
    
    it('should have password inputs', function() {
      const passwordInputs = document.querySelectorAll('input[type="password"]');
      expect(passwordInputs.length).to.be.greaterThan(0);
    });
    
    it('should link to registration-css.css', function() {
      const links = Array.from(document.querySelectorAll('link[rel="stylesheet"]'));
      const regCssLink = links.find(l => l.href.includes('registration-css.css'));
      expect(regCssLink).to.exist;
    });
    
    it('should have responsive viewport meta tag', function() {
      const viewportMeta = document.querySelector('meta[name="viewport"]');
      expect(viewportMeta).to.exist;
    });
    
    it('should have error message div', function() {
      const errorDiv = document.querySelector('#error-message');
      expect(errorDiv).to.exist;
    });
    
    it('should have success message div', function() {
      const successDiv = document.querySelector('#success-message');
      expect(successDiv).to.exist;
    });
  });

  describe('OAuth Button Consistency', function() {
    it('should have consistent OAuth button structure across pages', function() {
      const loginHtml = fs.readFileSync(
        path.join(__dirname, '..', 'login.html'),
        'utf8'
      );
      const regHtml = fs.readFileSync(
        path.join(__dirname, '..', 'registration-html.html'),
        'utf8'
      );
      
      const loginDom = new JSDOM(loginHtml);
      const regDom = new JSDOM(regHtml);
      
      const loginGoogleBtn = loginDom.window.document.querySelector('#google-signin-btn');
      const regGoogleBtn = regDom.window.document.querySelector('#google-signin-btn');
      
      expect(loginGoogleBtn).to.exist;
      expect(regGoogleBtn).to.exist;
      
      // Both should have onclick handlers
      expect(loginGoogleBtn.getAttribute('onclick')).to.exist;
      expect(regGoogleBtn.getAttribute('onclick')).to.exist;
    });
    
    it('should have consistent OAuth button classes', function() {
      const loginHtml = fs.readFileSync(
        path.join(__dirname, '..', 'login.html'),
        'utf8'
      );
      const regHtml = fs.readFileSync(
        path.join(__dirname, '..', 'registration-html.html'),
        'utf8'
      );
      
      const loginDom = new JSDOM(loginHtml);
      const regDom = new JSDOM(regHtml);
      
      const loginGoogleBtn = loginDom.window.document.querySelector('#google-signin-btn');
      const regGoogleBtn = regDom.window.document.querySelector('#google-signin-btn');
      
      expect(loginGoogleBtn.classList.contains('oauth-btn')).to.be.true;
      expect(regGoogleBtn.classList.contains('oauth-btn')).to.be.true;
    });
  });
});