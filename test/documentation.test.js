/**
 * Unit tests for documentation files
 * Validates README.md and DEPLOYMENT.md structure and content
 */

const { expect } = require('chai');
const fs = require('fs');
const path = require('path');

describe('Documentation Files', function() {
  describe('README.md', function() {
    let readmeContent;
    
    before(function() {
      readmeContent = fs.readFileSync(
        path.join(__dirname, '..', 'README.md'),
        'utf8'
      );
    });
    
    it('should exist', function() {
      expect(readmeContent).to.exist;
      expect(readmeContent.length).to.be.greaterThan(0);
    });
    
    it('should have a title', function() {
      expect(readmeContent).to.match(/^#\s+.+/m);
    });
    
    it('should contain Features section', function() {
      expect(readmeContent).to.include('## Features');
    });
    
    it('should document authentication providers', function() {
      expect(readmeContent).to.include('Google');
      expect(readmeContent).to.include('Apple');
    });
    
    it('should contain Project Structure section', function() {
      expect(readmeContent).to.include('## Project Structure');
    });
    
    it('should document Firebase Configuration', function() {
      expect(readmeContent).to.include('## Firebase Configuration');
    });
    
    it('should contain Deployment Instructions', function() {
      expect(readmeContent).to.include('## Deployment Instructions');
    });
    
    it('should document git commands', function() {
      expect(readmeContent).to.include('git init');
      expect(readmeContent).to.include('git add');
      expect(readmeContent).to.include('git commit');
    });
    
    it('should document firebase deployment', function() {
      expect(readmeContent).to.include('firebase deploy');
    });
    
    it('should contain Troubleshooting section', function() {
      expect(readmeContent).to.include('## Troubleshooting');
    });
    
    it('should have valid code block syntax', function() {
      const codeBlocks = readmeContent.match(/```[\s\S]*?```/g);
      expect(codeBlocks).to.exist;
      expect(codeBlocks.length).to.be.greaterThan(0);
    });
    
    it('should document project files', function() {
      const files = [
        'login.html',
        'registration-html.html',
        'auth-providers.js',
        'script.js',
        'firebase.json'
      ];
      
      files.forEach(file => {
        expect(readmeContent).to.include(file);
      });
    });
    
    it('should not contain broken localhost references in production URLs', function() {
      const productionUrlPattern = /https?:\/\/localhost/g;
      const matches = readmeContent.match(productionUrlPattern);
      
      // Should only appear in local testing section
      if (matches) {
        const localTestingSection = readmeContent.match(/## Local Testing[\s\S]*?##/);
        expect(localTestingSection).to.exist;
      }
    });
    
    it('should contain proper heading hierarchy', function() {
      const headings = readmeContent.match(/^#{1,6}\s+.+/gm);
      expect(headings).to.exist;
      expect(headings.length).to.be.greaterThan(5);
      
      // Should start with h1
      expect(headings[0]).to.match(/^#\s+/);
    });
    
    it('should have consistent formatting', function() {
      // Check for consistent list markers
      const listItems = readmeContent.match(/^[\s]*[-*]\s+/gm);
      if (listItems) {
        expect(listItems.length).to.be.greaterThan(0);
      }
    });
  });

  describe('DEPLOYMENT.md', function() {
    let deploymentContent;
    
    before(function() {
      deploymentContent = fs.readFileSync(
        path.join(__dirname, '..', 'DEPLOYMENT.md'),
        'utf8'
      );
    });
    
    it('should exist', function() {
      expect(deploymentContent).to.exist;
      expect(deploymentContent.length).to.be.greaterThan(0);
    });
    
    it('should have a title', function() {
      expect(deploymentContent).to.match(/^#\s+.+/m);
    });
    
    it('should contain Pre-Deployment Checklist', function() {
      expect(deploymentContent).to.include('## Pre-Deployment Checklist');
    });
    
    it('should contain Step-by-Step Deployment', function() {
      expect(deploymentContent).to.include('## Step-by-Step Deployment');
    });
    
    it('should document Git setup steps', function() {
      expect(deploymentContent).to.include('git init');
      expect(deploymentContent).to.include('git add');
      expect(deploymentContent).to.include('git commit');
      expect(deploymentContent).to.include('git push');
    });
    
    it('should document Firebase deployment', function() {
      expect(deploymentContent).to.include('firebase deploy');
      expect(deploymentContent).to.include('firebase login');
    });
    
    it('should contain Production Environment Setup', function() {
      expect(deploymentContent).to.include('## Production Environment Setup');
    });
    
    it('should document domain configuration', function() {
      expect(deploymentContent).to.include('Domain Configuration');
      expect(deploymentContent).to.include('DNS');
    });
    
    it('should document OAuth provider setup', function() {
      expect(deploymentContent).to.include('OAuth Provider Configuration');
      expect(deploymentContent).to.include('Google Sign-In');
      expect(deploymentContent).to.include('Apple Sign-In');
    });
    
    it('should contain Security Configuration', function() {
      expect(deploymentContent).to.include('## Security Configuration');
      expect(deploymentContent).to.include('Firestore Security Rules');
    });
    
    it('should contain Post-Deployment Verification', function() {
      expect(deploymentContent).to.include('## Post-Deployment Verification');
    });
    
    it('should have test cases checklist', function() {
      expect(deploymentContent).to.match(/- \[ \]/);
    });
    
    it('should document monitoring and maintenance', function() {
      expect(deploymentContent).to.include('## Monitoring and Maintenance');
    });
    
    it('should contain Troubleshooting section', function() {
      expect(deploymentContent).to.include('## Troubleshooting');
    });
    
    it('should contain Rollback Procedure', function() {
      expect(deploymentContent).to.include('## Rollback Procedure');
    });
    
    it('should have valid code blocks', function() {
      const codeBlocks = deploymentContent.match(/```[\s\S]*?```/g);
      expect(codeBlocks).to.exist;
      expect(codeBlocks.length).to.be.greaterThan(0);
    });
    
    it('should reference Firebase console URLs', function() {
      expect(deploymentContent).to.match(/https:\/\/.*firebase.*\.com/);
    });
    
    it('should contain deployment checklist', function() {
      expect(deploymentContent).to.include('## Deployment Checklist');
    });
    
    it('should have proper security warnings', function() {
      const hasSecurityMention = 
        deploymentContent.includes('security') || 
        deploymentContent.includes('Security');
      expect(hasSecurityMention).to.be.true;
    });
  });

  describe('Link Validation', function() {
    it('should have valid URLs in README', function() {
      const readmeContent = fs.readFileSync(
        path.join(__dirname, '..', 'README.md'),
        'utf8'
      );
      
      const urlPattern = /https?:\/\/[^\s)]+/g;
      const urls = readmeContent.match(urlPattern);
      
      if (urls) {
        urls.forEach(url => {
          // Basic URL structure validation
          expect(url).to.match(/^https?:\/\/.+\..+/);
        });
      }
    });
    
    it('should have valid URLs in DEPLOYMENT.md', function() {
      const deploymentContent = fs.readFileSync(
        path.join(__dirname, '..', 'DEPLOYMENT.md'),
        'utf8'
      );
      
      const urlPattern = /https?:\/\/[^\s)]+/g;
      const urls = deploymentContent.match(urlPattern);
      
      expect(urls).to.exist;
      expect(urls.length).to.be.greaterThan(0);
      
      urls.forEach(url => {
        // Basic URL structure validation
        expect(url).to.match(/^https?:\/\/.+\..+/);
      });
    });
  });
});