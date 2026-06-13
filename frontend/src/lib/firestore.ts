import { 
  collection, 
  doc, 
  addDoc, 
  getDoc, 
  getDocs, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  limit, 
  Timestamp,
  serverTimestamp 
} from 'firebase/firestore';
import { db } from './firebase';

// Generic CRUD operations
export const createDocument = async (collectionName: string, data: any) => {
  try {
    const docRef = await addDoc(collection(db, collectionName), {
      ...data,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    return docRef.id;
  } catch (error) {
    console.error('Error creating document:', error);
    throw error;
  }
};

export const getDocument = async (collectionName: string, docId: string) => {
  try {
    const docRef = doc(db, collectionName, docId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    } else {
      return null;
    }
  } catch (error) {
    console.error('Error getting document:', error);
    throw error;
  }
};

export const getDocuments = async (collectionName: string, constraints: any[] = []) => {
  try {
    const q = query(collection(db, collectionName), ...constraints);
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error('Error getting documents:', error);
    throw error;
  }
};

export const updateDocument = async (collectionName: string, docId: string, data: any) => {
  try {
    const docRef = doc(db, collectionName, docId);
    await updateDoc(docRef, {
      ...data,
      updatedAt: serverTimestamp()
    });
    return true;
  } catch (error) {
    console.error('Error updating document:', error);
    throw error;
  }
};

export const deleteDocument = async (collectionName: string, docId: string) => {
  try {
    const docRef = doc(db, collectionName, docId);
    await deleteDoc(docRef);
    return true;
  } catch (error) {
    console.error('Error deleting document:', error);
    throw error;
  }
};

// User-specific operations
export const createUserProfile = async (userId: string, userData: any) => {
  try {
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, {
      ...userData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    return true;
  } catch (error) {
    console.error('Error creating user profile:', error);
    throw error;
  }
};

export const getUserProfile = async (userId: string) => {
  return getDocument('users', userId);
};

export const updateUserProfile = async (userId: string, userData: any) => {
  return updateDocument('users', userId, userData);
};

// Helper functions for common queries
export const getUserDocuments = async (userId: string, collectionName: string) => {
  return getDocuments(collectionName, [
    where('userId', '==', userId),
    orderBy('createdAt', 'desc')
  ]);
};

export const getRecentDocuments = async (collectionName: string, limitCount: number = 10) => {
  return getDocuments(collectionName, [
    orderBy('createdAt', 'desc'),
    limit(limitCount)
  ]);
};

// Export Firestore utilities
export { Timestamp, serverTimestamp };
