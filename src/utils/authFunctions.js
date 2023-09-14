import { getFirestore, doc, setDoc } from "firebase/firestore"; 
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { auth } from '../firebase.js'; 

const db = getFirestore();

export const register = async (email, password, name, role = 'user') => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    if(role === 'company') {
      role = 'pending';
    }

    await setDoc(doc(db, 'users', user.uid), {
      name: name,
      email: email,
      role: role,
    });

    if (role === 'pending') {
      return { success: true, message: "pending admin approval" };
    }

    return userCredential;
  } catch (error) {
    console.error("Error:", error);
    throw new Error("Error");
  }
};

export const login = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential;
  } catch (error) {
    console.error("Error:", error);
    throw new Error("Error");
  }
};

export const logout = async () => {
  try {
    await signOut(auth);
    console.log("User signed out successfully");
  } catch (error) {
    console.error("Error:", error);
    throw new Error("Error");
  }
};
