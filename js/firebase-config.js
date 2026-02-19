/* ============================================
   FIREBASE CONFIGURATION
   Digital Complaint Management System
   ============================================ */

// Firebase configuration object
// IMPORTANT: Replace these values with your own Firebase project credentials
const firebaseConfig = {
    apiKey: "YOUR_API_KEY_HERE",
    authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_PROJECT_ID.appspot.com",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Initialize Firebase services
const db = firebase.firestore();
const auth = firebase.auth();
const storage = firebase.storage();

// EmailJS Configuration
// IMPORTANT: Replace with your EmailJS credentials
const EMAILJS_CONFIG = {
    serviceId: 'YOUR_SERVICE_ID',
    templateId: 'YOUR_TEMPLATE_ID',
    publicKey: 'YOUR_PUBLIC_KEY'
};

// Admin email for notifications
const ADMIN_EMAIL = 'admin@example.com';

console.log('Firebase initialized successfully');
