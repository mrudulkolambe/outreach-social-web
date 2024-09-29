import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';

// const firebaseConfig = {
//   apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
//   authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
//   projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
//   storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
//   messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
//   appId: process.env.REACT_APP_FIREBASE_APP_ID,
// };

const firebaseConfig = {
  apiKey: "AIzaSyB1D1jECBxwtJCng7KDmV_nV67gEa6Ty2Y",
  authDomain: "outreach-dev-62760.firebaseapp.com",
  projectId: "outreach-dev-62760",
  storageBucket: "outreach-dev-62760.appspot.com",
  messagingSenderId: "497882681132",
  appId: "1:497882681132:web:19bd2f7293fec3ebd8e689"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const storage = getStorage(app);
