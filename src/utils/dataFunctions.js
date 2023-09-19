import { deleteDoc, updateDoc, getDoc, doc, getDocs, query, where, collection } from 'firebase/firestore';
import { auth } from '../firebase.js'; 


import { db } from '../firebase.js';

export const getUserData = async (uid) => {
  try {
    const userDoc = await getDoc(doc(db, 'users', uid));
    if (userDoc.exists()) {
      return { uid, ...userDoc.data() }; // include uid in the returned data
    } else {
      console.error("Firebase missing document");
      return null;
    }
  } catch (error) {
    console.error("Error:", error);
    return null;
  }
};

export const getPendingApprovals = async () => {
  try {
    const q = query(collection(db, 'users'), where('role', '==', 'pending'));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error('Error:', error);
    throw new Error('Error');
  }
};

export const getAllUsers = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, 'users'));
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error('Error:', error);
    throw new Error('Error');
  }
};

export const getPendingApprovalData = async () => {
  try {
    const user = auth.currentUser;
    if (!user) throw new Error("no one is logged in");

    const userDoc = await getDoc(doc(db, 'users', user.uid));
    if (!userDoc.exists()) throw new Error("non exisitant user");

    return userDoc.data();
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};

export const updateUserRole = async (userId, newRole) => {
  try {
    const userDoc = doc(db, 'users', userId);
    await updateDoc(userDoc, { role: newRole });
  } catch (error) {
    console.error('Error:', error);
    throw new Error('Error');
  }
};

export const deleteUser = async (userId) => {
  try {
    const userDoc = doc(db, 'users', userId);
    await deleteDoc(userDoc);
  } catch (error) {
    console.error('Error:', error);
    throw new Error('Error');
  }
};

export const getCompanyEmployees = async (companyId) => {
  try {
    const q = query(collection(db, 'users'), where('companyId', '==', companyId));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error('Error:', error);
    throw new Error('Error');
  }
};
