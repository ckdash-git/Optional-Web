# Optional Labs - Authentication Web Application

A modern web application with Firebase authentication supporting Google and Apple Sign-In, built with vanilla JavaScript and Firebase.

## Features

- **Multi-Provider Authentication**: Google and Apple Sign-In
- **User Registration**: Email/password registration with real-time validation
- **User Management**: Profile management and account settings
- **Responsive Design**: Modern, mobile-friendly interface
- **Firebase Integration**: Firestore database and Firebase Auth
- **Security**: Production-ready security configurations

## Project Structure

```
Optional-Web/
├── index.html              # Landing page
├── login.html              # Login page
├── registration-html.html  # Registration page
├── welcome.html            # Post-authentication welcome page
├── dashboard.html          # User dashboard
├── manage-account.html     # Account management
├── privacy-policy.html     # Privacy policy page
├── script.js               # Firebase configuration
├── auth-providers.js       # OAuth authentication logic
├── registration-js.js      # Registration form logic
├── dashboard.js            # Dashboard functionality
├── firebase_appLink.js     # App link functionality
├── style.css               # Main stylesheet
├── registration-css.css    # Registration page styles
├── dashboard.css           # Dashboard styles
├── firebase.json           # Firebase configuration
├── .firebaserc             # Firebase project settings
├── CNAME                   # Custom domain configuration
└── functions/              # Firebase Cloud Functions
    ├── index.js
    └── package.json
```

## Firebase Configuration

The application is configured for the Firebase project `optional-25cd8` with:
- **Auth Domain**: `optional-25cd8.firebaseapp.com`
- **Custom Domain**: `optionallabs.com` (configured via CNAME)
- **Firestore Database**: User data storage
- **Firebase Functions**: Cloud functions for backend logic

## Deployment Instructions

### Prerequisites

1. **Git**: Ensure Git is installed on your system
2. **Firebase CLI**: Install Firebase CLI for deployment
   ```bash
   npm install -g firebase-tools
   ```
3. **Domain Setup**: Ensure your custom domain DNS is configured

### Local Testing

1. **Start Local Server**:
   ```bash
   python3 -m http.server 5500
   ```
   Or use any static file server

2. **Test Authentication**:
   - Navigate to `http://localhost:5500`
   - Test Google and Apple Sign-In
   - Verify registration and login flows

### Git Repository Setup

1. **Initialize Git Repository**:
   ```bash
   cd /path/to/Optional-Web
   git init
   ```

2. **Add Remote Repository**:
   ```bash
   git remote add origin <your-repository-url>
   ```

3. **Add and Commit Files**:
   ```bash
   git add .
   git commit -m "Initial commit: Optional Labs authentication app"
   ```

4. **Push to Repository**:
   ```bash
   git push -u origin main
   ```

### Firebase Deployment

1. **Login to Firebase**:
   ```bash
   firebase login
   ```

2. **Deploy to Firebase Hosting**:
   ```bash
   firebase deploy --only hosting
   ```

3. **Deploy Functions** (if needed):
   ```bash
   firebase deploy --only functions
   ```

### Production Environment Requirements

#### 1. Firebase Project Configuration
- Ensure Firebase project `optional-25cd8` is properly configured
- Verify OAuth provider settings in Firebase Console
- Confirm Firestore security rules are production-ready

#### 2. Domain Configuration
- **Custom Domain**: `optionallabs.com` configured in Firebase Hosting
- **SSL Certificate**: Automatically managed by Firebase
- **DNS Settings**: CNAME record pointing to Firebase

#### 3. OAuth Provider Setup

**Google Sign-In**:
- Client ID configured in Firebase Console
- Authorized domains include production domain
- OAuth consent screen configured

**Apple Sign-In**:
- Apple Developer account configured
- Service ID and key configured in Firebase
- Domain verification completed

#### 4. Security Considerations
- Firestore security rules configured for production
- API keys restricted to authorized domains
- HTTPS enforced for all connections

### Post-Deployment Verification

1. **Test Authentication Flows**:
   - Google Sign-In functionality
   - Apple Sign-In functionality
   - Email/password registration and login

2. **Verify Database Operations**:
   - User data storage in Firestore
   - Profile updates and account management

3. **Check Performance**:
   - Page load times
   - Authentication response times
   - Mobile responsiveness

### Environment Variables

No environment variables are required for the frontend. All configuration is handled through Firebase configuration objects.

### Troubleshooting

#### Common Issues:

1. **OAuth Errors**:
   - Verify authorized domains in Firebase Console
   - Check OAuth provider configurations
   - Ensure custom domain is properly configured

2. **Database Errors**:
   - Verify Firestore security rules
   - Check Firebase project permissions
   - Ensure proper Firebase initialization

3. **Deployment Issues**:
   - Verify Firebase CLI authentication
   - Check firebase.json configuration
   - Ensure proper project selection

### Support

For issues or questions:
- Check Firebase Console for error logs
- Review browser developer console for client-side errors
- Verify network connectivity and DNS resolution

## License

© Optional Labs. All rights reserved. 2025-present.