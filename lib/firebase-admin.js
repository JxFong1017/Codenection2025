
import admin from 'firebase-admin';
import getConfig from 'next/config';

const { serverRuntimeConfig } = getConfig();

// This file is only used on the SERVER-SIDE.
if (!admin.apps.length) {
  try {
    const serviceAccount = JSON.parse(serverRuntimeConfig.FIREBASE_SERVICE_ACCOUNT_KEY);
    
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      databaseURL: `https://codenection2025-19a07-default-rtdb.firebaseio.com`
    });
  } catch (error) {
    console.error('Firebase admin initialization error', error.stack);
  }
}

export default admin;
