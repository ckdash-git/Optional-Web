# Deployment Guide - Optional Labs

This guide provides step-by-step instructions for deploying the Optional Labs authentication application to production.

## Pre-Deployment Checklist

### ✅ Code Preparation
- [x] Remove all localhost references
- [x] Verify Firebase configuration for production
- [x] Fix all file path references
- [x] Test authentication flows locally
- [x] Ensure all CSS and JS files are properly linked

### ✅ Firebase Configuration
- [x] Project ID: `optional-25cd8`
- [x] Auth Domain: `optional-25cd8.firebaseapp.com`
- [x] Custom Domain: `optionallabs.com`
- [x] Google OAuth configured
- [x] Apple OAuth configured
- [x] Firestore database ready

## Step-by-Step Deployment

### Step 1: Initialize Git Repository

```bash
# Navigate to project directory
cd /Users/cachatto/Desktop/Optional-Web

# Initialize Git repository (if not already done)
git init

# Add all files to staging
git add .

# Create initial commit
git commit -m "Initial commit: Optional Labs authentication app with Firebase integration"
```

### Step 2: Set Up Remote Repository

```bash
# Add your remote repository (replace with your actual repository URL)
git remote add origin https://github.com/yourusername/optional-labs.git

# Or for SSH:
# git remote add origin git@github.com:yourusername/optional-labs.git

# Verify remote is added
git remote -v
```

### Step 3: Push to Repository

```bash
# Push to main branch
git push -u origin main

# If you encounter issues with branch naming:
# git branch -M main
# git push -u origin main
```

### Step 4: Firebase Deployment (Optional)

If you want to deploy directly to Firebase Hosting:

```bash
# Install Firebase CLI (if not already installed)
npm install -g firebase-tools

# Login to Firebase
firebase login

# Verify project configuration
firebase projects:list

# Deploy to Firebase Hosting
firebase deploy --only hosting

# Deploy functions (if needed)
firebase deploy --only functions
```

## Production Environment Setup

### Domain Configuration

1. **DNS Settings**:
   - CNAME record: `optionallabs.com` → `optional-25cd8.firebaseapp.com`
   - Or use Firebase custom domain setup

2. **SSL Certificate**:
   - Automatically managed by Firebase Hosting
   - Verify HTTPS is enforced

### OAuth Provider Configuration

#### Google Sign-In
1. **Firebase Console** → Authentication → Sign-in method → Google
2. **Authorized domains**: Add your production domain
3. **OAuth consent screen**: Configure for production use

#### Apple Sign-In
1. **Apple Developer Console**: Verify Service ID configuration
2. **Firebase Console**: Ensure Apple provider is properly configured
3. **Domain verification**: Confirm production domain is verified

### Security Configuration

#### Firestore Security Rules
Ensure your Firestore rules are production-ready:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can only access their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

#### Firebase Auth Settings
- Enable only required sign-in methods
- Configure authorized domains
- Set up proper error handling

## Post-Deployment Verification

### 1. Functional Testing

**Authentication Flows**:
```bash
# Test URLs (replace with your domain)
https://optionallabs.com/
https://optionallabs.com/login.html
https://optionallabs.com/registration-html.html
```

**Test Cases**:
- [ ] Google Sign-In works correctly
- [ ] Apple Sign-In works correctly
- [ ] Email/password registration
- [ ] Email/password login
- [ ] User data storage in Firestore
- [ ] Redirect flows work properly
- [ ] Account management features

### 2. Performance Testing

- [ ] Page load times < 3 seconds
- [ ] Authentication response times < 2 seconds
- [ ] Mobile responsiveness
- [ ] Cross-browser compatibility

### 3. Security Testing

- [ ] HTTPS enforced on all pages
- [ ] OAuth flows secure
- [ ] No sensitive data exposed in client-side code
- [ ] Firestore security rules working

## Monitoring and Maintenance

### Firebase Console Monitoring
1. **Authentication**: Monitor sign-in methods and user activity
2. **Firestore**: Check database usage and performance
3. **Hosting**: Monitor traffic and performance metrics
4. **Functions**: Check function execution logs (if applicable)

### Error Monitoring
- Check browser console for JavaScript errors
- Monitor Firebase Console for authentication errors
- Review Firestore security rule violations

## Troubleshooting Common Issues

### OAuth Errors
```
Error: unauthorized-domain
Solution: Add production domain to Firebase authorized domains
```

### Database Permission Errors
```
Error: Missing or insufficient permissions
Solution: Review and update Firestore security rules
```

### Deployment Errors
```
Error: Firebase project not found
Solution: Verify .firebaserc configuration and project access
```

## Rollback Procedure

If issues occur after deployment:

1. **Git Rollback**:
   ```bash
   git revert HEAD
   git push origin main
   ```

2. **Firebase Rollback**:
   ```bash
   firebase hosting:clone SOURCE_SITE_ID:SOURCE_VERSION_ID TARGET_SITE_ID
   ```

## Support and Resources

- **Firebase Documentation**: https://firebase.google.com/docs
- **Firebase Console**: https://console.firebase.google.com
- **Project Repository**: [Your repository URL]

## Deployment Checklist

- [ ] Code pushed to Git repository
- [ ] Firebase project configured
- [ ] OAuth providers tested
- [ ] Custom domain configured
- [ ] SSL certificate active
- [ ] Security rules deployed
- [ ] Functional testing completed
- [ ] Performance testing completed
- [ ] Monitoring configured

---

**Deployment Date**: [Date]
**Deployed By**: [Your Name]
**Version**: 1.0.0