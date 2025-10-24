/**
 * Unit tests for CSS files
 * Validates registration-css.css OAuth button styles
 */

const { expect } = require('chai');
const fs = require('fs');
const path = require('path');

describe('CSS Files', function() {
  describe('registration-css.css', function() {
    let cssContent;
    
    before(function() {
      cssContent = fs.readFileSync(
        path.join(__dirname, '..', 'registration-css.css'),
        'utf8'
      );
    });
    
    it('should exist', function() {
      expect(cssContent).to.exist;
      expect(cssContent.length).to.be.greaterThan(0);
    });
    
    it('should contain OAuth container styles', function() {
      expect(cssContent).to.include('.oauth-container');
    });
    
    it('should contain OAuth button styles', function() {
      expect(cssContent).to.include('.oauth-btn');
    });
    
    it('should contain Google button styles', function() {
      expect(cssContent).to.include('.google-btn');
    });
    
    it('should contain Apple button styles', function() {
      expect(cssContent).to.include('.apple-btn');
    });
    
    it('should contain OAuth divider styles', function() {
      expect(cssContent).to.include('.oauth-divider');
    });
    
    it('should contain OAuth icon styles', function() {
      expect(cssContent).to.include('.oauth-icon');
    });
    
    it('should contain auth loader styles', function() {
      expect(cssContent).to.include('.auth-loader');
    });
    
    it('should contain auth button text styles', function() {
      expect(cssContent).to.include('.auth-btn-text');
    });
    
    it('should have hover states for OAuth buttons', function() {
      expect(cssContent).to.match(/\.oauth-btn:hover/);
    });
    
    it('should have disabled states for OAuth buttons', function() {
      expect(cssContent).to.match(/\.oauth-btn:disabled/);
    });
    
    it('should have Google button hover state', function() {
      expect(cssContent).to.match(/\.google-btn:hover/);
    });
    
    it('should have Apple button hover state', function() {
      expect(cssContent).to.match(/\.apple-btn:hover/);
    });
    
    it('should have animation for loader', function() {
      expect(cssContent).to.include('@keyframes spin');
    });
    
    it('should have proper button dimensions', function() {
      expect(cssContent).to.match(/width:\s*100%/);
      expect(cssContent).to.match(/padding:\s*\d+px\s+\d+px/);
    });
    
    it('should have border radius for rounded buttons', function() {
      expect(cssContent).to.match(/border-radius:\s*\d+px/);
    });
    
    it('should have transition effects', function() {
      expect(cssContent).to.match(/transition:/);
    });
    
    it('should have flexbox for button layout', function() {
      const oauthBtnSection = cssContent.match(/\.oauth-btn\s*{[^}]*}/s);
      expect(oauthBtnSection).to.exist;
      expect(oauthBtnSection[0]).to.match(/display:\s*flex/);
    });
    
    it('should have proper color schemes', function() {
      // Should have color definitions
      expect(cssContent).to.match(/color:\s*#[0-9a-fA-F]{3,6}/);
      expect(cssContent).to.match(/background-color:\s*#[0-9a-fA-F]{3,6}/);
    });
    
    it('should have responsive design considerations', function() {
      expect(cssContent).to.include('@media');
    });
    
    it('should have proper specificity for nested selectors', function() {
      // Check for specific nested selectors
      const hasNestedSelectors = 
        cssContent.includes('.oauth-btn:hover:not(:disabled)') ||
        cssContent.includes('.google-btn:hover');
      expect(hasNestedSelectors).to.be.true;
    });
    
    it('should define icon dimensions', function() {
      const iconSection = cssContent.match(/\.oauth-icon\s*{[^}]*}/s);
      expect(iconSection).to.exist;
      expect(iconSection[0]).to.match(/width:\s*\d+px/);
      expect(iconSection[0]).to.match(/height:\s*\d+px/);
    });
    
    it('should have proper border styles', function() {
      expect(cssContent).to.match(/border:\s*\d+px\s+solid/);
    });
    
    it('should have proper margin and padding', function() {
      expect(cssContent).to.match(/margin:\s*[\d.]+(?:px|rem|em)/);
      expect(cssContent).to.match(/padding:\s*[\d.]+(?:px|rem|em)/);
    });
  });

  describe('CSS Validation', function() {
    it('should have valid syntax (basic check)', function() {
      const cssContent = fs.readFileSync(
        path.join(__dirname, '..', 'registration-css.css'),
        'utf8'
      );
      
      // Check for balanced braces
      const openBraces = (cssContent.match(/{/g) || []).length;
      const closeBraces = (cssContent.match(/}/g) || []).length;
      expect(openBraces).to.equal(closeBraces);
    });
    
    it('should not have obvious syntax errors', function() {
      const cssContent = fs.readFileSync(
        path.join(__dirname, '..', 'registration-css.css'),
        'utf8'
      );
      
      // Should not have double semicolons
      expect(cssContent).to.not.match(/;;/);
      
      // Should not have empty rules (basic check)
      expect(cssContent).to.not.match(/{\s*}/);
    });
  });
});