import { getFirestore, doc, setDoc } from "firebase/firestore"; 
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { auth } from '../firebase.js'; 

const db = getFirestore();

export const register = async (email, password, name, role = 'user', autoLogin = true, companyId = null) => {
  console.log('Parameters received:', { email, password, name, role, autoLogin, companyId });
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    if(role === 'company') {
      role = 'pending';
    }

    const userData = {
      name: name,
      email: email,
      role: role,
    };

    if (companyId) {
      userData.companyId = companyId;
    }
    console.log('UserData before writing to Firestore:', userData);
    await setDoc(doc(db, 'users', user.uid), userData);

    if (role === 'pending') {
      return { success: true, message: "pending admin approval" };
    }

    if (!autoLogin) {
      await signOut(auth);
      return { success: true, message: "User registered successfully, but not logged in" };
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
