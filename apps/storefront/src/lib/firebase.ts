import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';

let app: FirebaseApp | null = null;
let auth: Auth | null = null;

export const initFirebase = (config: any) => {
  if (!config?.apiKey) {
    throw new Error("Firebase config is missing");
  }
  
  if (!getApps().length) {
    app = initializeApp({
      apiKey: config.apiKey,
      authDomain: config.authDomain,
      projectId: config.projectId,
      storageBucket: config.storageBucket,
      messagingSenderId: config.messagingSenderId,
      appId: config.appId,
    });
  } else {
    app = getApp();
  }

  auth = getAuth(app);
  return { app, auth };
};

export const getFirebaseAuth = () => {
  if (!auth) throw new Error("Firebase is not initialized yet");
  return auth;
};
