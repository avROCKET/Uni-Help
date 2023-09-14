import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth"; 
import { getFirestore } from 'firebase/firestore';


// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBHsT7DChxknt9NpPKmW_FOCE0g7oViR9I",
  authDomain: "unihelp-37c17.firebaseapp.com",
  databaseURL: "https://unihelp-37c17-default-rtdb.firebaseio.com",
  projectId: "unihelp-37c17",
  storageBucket: "unihelp-37c17.appspot.com",
  messagingSenderId: "826049026160",
  appId: "1:826049026160:web:9c846ec91daea1b7c43cb5",
  measurementId: "G-FNK4RJE7T7"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app); // Initialize Authentication
const db = getFirestore(app); // Initialize Firestore

export { app, analytics, auth, db };
