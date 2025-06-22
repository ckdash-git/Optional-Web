// index.js - Firebase Cloud Functions

const functions = require('firebase-functions');
const admin = require('firebase-admin');
const nodemailer = require('nodemailer');

admin.initializeApp();

/**
 * Cloud Function triggered whenever a new document is created in the emailRequests collection
 * Sends an app link email to the user's email address
 */
exports.sendAppLinkEmail = functions.firestore
  .document('emailRequests/{requestId}')
  .onCreate(async (snap, context) => {
    const requestData = snap.data();
    const email = requestData.email;
    
    // Skip if no email or already processed
    if (!email || requestData.status !== 'pending') {
      console.log('Invalid request or already processed');
      return null;
    }
    
    // Configure email transporter
    // For production, use environment variables for credentials
    const transporter = nodemailer.createTransport({
      service: 'gmail', // Replace with your email service
      auth: {
        user: functions.config().email.user, // Set with: firebase functions:config:set email.user="youremail@gmail.com"
        pass: functions.config().email.password // Set with: firebase functions:config:set email.password="yourpassword"
      }
    });
    
    // App link - ideally this should be a dynamic link
    const appLink = functions.config().app.download_link || 'https://optionallabs.com/download';
    
    // Email content
    const mailOptions = {
      from: '"Optional Labs" <noreply@optionallabs.com>',
      to: email,
      subject: 'Download Optional Labs App',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 20px;">
            <img src="https://optionallabs.com/logo.png" alt="Optional Labs Logo" style="max-width: 150px;">
          </div>
          
          <h1 style="color: #6c63ff; text-align: center;">Your App Download Link</h1>
          
          <p style="font-size: 16px; line-height: 1.5; margin: 20px 0;">
            Thank you for your interest in Optional Labs! Click the button below to download our app:
          </p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${appLink}" style="background-color: #6c63ff; color: white; padding: 12px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">
              Download App
            </a>
          </div>
          
          <p style="font-size: 14px; line-height: 1.5;">
            If the button doesn't work, you can also copy and paste this link in your browser:
            <br>
            <a href="${appLink}" style="color: #6c63ff; word-break: break-all;">${appLink}</a>
          </p>
          
          <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;" />
          
          <p style="font-size: 12px; color: #666; text-align: center;">
            Made with ❤️ in Bengaluru, India
            <br>
            © Optional Labs. All rights reserved.
          </p>
        </div>
      `
    };
    
    try {
      // Send email
      await transporter.sendMail(mailOptions);
      
      // Update request status to sent
      await admin.firestore().collection('emailRequests').doc(context.params.requestId).update({
        status: 'sent',
        sentAt: admin.firestore.FieldValue.serverTimestamp()
      });
      
      console.log(`App link email sent to ${email}`);
      return null;
      
    } catch (error) {
      console.error('Error sending email:', error);
      
      // Update request status to error
      await admin.firestore().collection('emailRequests').doc(context.params.requestId).update({
        status: 'error',
        error: error.message
      });
      
      throw new Error(`Failed to send email to ${email}: ${error.message}`);
    }
  });

/**
 * Optional: HTTP function to send app link (alternative approach)
 * Can be called directly from client or used as an API endpoint
 */
exports.sendAppLinkHttp = functions.https.onCall(async (data, context) => {
  // Get the email from the request
  const { email } = data;
  
  if (!email) {
    throw new functions.https.HttpsError(
      'invalid-argument', 
      'The function must be called with an email address.'
    );
  }
  
  try {
    // Add to Firestore (will trigger the sendAppLinkEmail function)
    const docRef = await admin.firestore().collection('emailRequests').add({
      email: email,
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
      status: 'pending',
      source: 'http'
    });
    
    return { success: true, requestId: docRef.id };
    
  } catch (error) {
    console.error('Error creating email request:', error);
    throw new functions.https.HttpsError('internal', 'Unable to process request');
  }
});