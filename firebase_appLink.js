// Firebase Configuration
const firebaseConfig = {
    apiKey: "AIzaSyD8r6mmkOSAtUUvTFib_0sw2u3FRcdwAsA",
    authDomain: "optional-25cd8.firebaseapp.com",
    projectId: "optional-25cd8",
    storageBucket: "optional-25cd8.firebasestorage.app",
    messagingSenderId: "232340431847",
    appId: "1:232340431847:web:191ada6ed1d393d66f5342",
    measurementId: "G-HQVLL3SN9H"
  };
  
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  
  // Reference to Auth and Functions services
  const auth = firebase.auth();
  const db = firebase.firestore();
  
  // Get DOM elements
  const emailInput = document.getElementById('emailInput');
  const sendLinkBtn = document.getElementById('sendLinkBtn');
  const loader = document.getElementById('loader');
  
  // Add event listener to the send link button
  sendLinkBtn.addEventListener('click', sendAppLink);
  
  /**
   * Sends app download link to the provided email
   */
  function sendAppLink() {
    // Get the email value
    const email = emailInput.value.trim();
    
    // Validate email
    if (!isValidEmail(email)) {
      showMessage('Please enter a valid email address', 'error');
      return;
    }
    
    // Show loading state
    sendLinkBtn.disabled = true;
    sendLinkBtn.textContent = 'Sending...';
    loader.style.display = 'flex';
    
    // First, sign in anonymously to use Firebase services
    auth.signInAnonymously()
      .then(() => {
        // Store the email request in Firestore with timestamp
        return db.collection('emailRequests').add({
          email: email,
          timestamp: firebase.firestore.FieldValue.serverTimestamp(),
          status: 'pending'
        });
      })
      .then((docRef) => {
        // Call Firestore trigger function (this will trigger the Cloud Function)
        // In a real setup, the Cloud Function would be triggered by the Firestore write
        
        // For demonstration, simulate a successful email send
        setTimeout(() => {
          // Update the request status
          return db.collection('emailRequests').doc(docRef.id).update({
            status: 'sent'
          });
        }, 1500);
        
        return docRef.id;
      })
      .then((requestId) => {
        // Show success message
        showMessage('App link sent successfully to your email!', 'success');
        
        // Clear the input field
        emailInput.value = '';
        
        // Log analytics event (optional)
        // If you have Firebase Analytics set up
        // firebase.analytics().logEvent('app_link_sent', { email_domain: email.split('@')[1] });
      })
      .catch((error) => {
        console.error('Error sending app link:', error);
        showMessage('Failed to send app link. Please try again.', 'error');
      })
      .finally(() => {
        // Reset button state
        sendLinkBtn.disabled = false;
        sendLinkBtn.textContent = 'Send Link';
        loader.style.display = 'none';
      });
  }
  
  /**
   * Validates email format
   * @param {string} email - The email to validate
   * @returns {boolean} - Whether the email is valid
   */
  function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
  
  /**
   * Shows a message to the user
   * @param {string} message - The message to display
   * @param {string} type - The message type ('success' or 'error')
   */
  function showMessage(message, type) {
    // Remove any existing message
    const existingMessage = document.querySelector('.message-alert');
    if (existingMessage) {
      existingMessage.remove();
    }
    
    // Create message element
    const messageElement = document.createElement('div');
    messageElement.className = `message-alert ${type}`;
    messageElement.textContent = message;
    
    // Add it to the email section
    const emailSection = document.querySelector('.email-section');
    emailSection.appendChild(messageElement);
    
    // Remove after 5 seconds
    setTimeout(() => {
      messageElement.remove();
    }, 5000);
  }