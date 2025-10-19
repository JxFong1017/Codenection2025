import admin from 'firebase-admin';

// This file is only used on the SERVER-SIDE.
if (!admin.apps.length) {
  try {
    admin.initializeApp({
      credential: admin.credential.cert(process.env.FIREBASE_SERVICE_ACCOUNT_KEY),
    });
  } catch (error) {
    console.error('Firebase admin initialization error', error.stack);
  }
}

export default admin;
