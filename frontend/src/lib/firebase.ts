import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);

export const getFirebaseErrorMessage = (error: any): string => {
  if (!error) return "An unknown error occurred.";
  
  const code = error.code || (error.message && error.message.includes('/') ? error.message : '');
  
  if (code.includes('auth/operation-not-allowed')) {
    return "Google Sign-In is disabled in your Firebase project. Please enable Google Sign-In in the Firebase Console (Authentication > Sign-in method).";
  }
  if (code.includes('auth/popup-blocked')) {
    return "The sign-in popup was blocked by your browser. Please allow popups for this website, or try again.";
  }
  if (code.includes('auth/unauthorized-domain')) {
    return "This domain is not authorized for OAuth operations in your Firebase project. Add 'localhost' or your production domain in the Firebase Console (Authentication > Settings > Authorized domains).";
  }
  if (code.includes('auth/invalid-api-key') || code.includes('auth/bad-api-key')) {
    return "Invalid Firebase API key. Please check your VITE_FIREBASE_API_KEY in the frontend .env file.";
  }
  if (code.includes('auth/popup-closed-by-user')) {
    return "The sign-in popup was closed before completing the authentication. Please try again.";
  }
  if (code.includes('auth/network-request-failed')) {
    return "Network error. Please check your internet connection and try again.";
  }
  if (code.includes('auth/internal-error')) {
    return "Firebase internal error. Please verify your configuration.";
  }
  
  // Clean up default Firebase error message wrapper if present
  let cleanMessage = error.message || "Failed to authenticate with Firebase.";
  if (cleanMessage.startsWith("Firebase: ")) {
    cleanMessage = cleanMessage.substring(10);
  }
  return cleanMessage;
};

export default app;
