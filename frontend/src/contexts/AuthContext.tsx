import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  User,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
  UserCredential,
  updateProfile
} from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { API_URL } from '@/lib/api';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<UserCredential>;
  signUp: (email: string, password: string) => Promise<UserCredential>;
  signInWithGoogle: () => Promise<UserCredential>;
  logout: () => Promise<void>;
  updateUserProfile: (displayName: string, photoURL?: string, bio?: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      setLoading(false);
      
      if (user) {
        // Synchronize user state with MongoDB
        try {
          const syncRes = await fetch(`${API_URL}/api/users/sync`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              uid: user.uid,
              email: user.email,
              displayName: user.displayName,
              photoURL: user.photoURL,
              authProvider: user.providerData[0]?.providerId || 'email'
            })
          });
          const syncData = await syncRes.json();
          
          if (syncData.success && syncData.user) {
            // Merge MongoDB data (like bio and long photoURL) into our user state
            setUser(prev => prev ? ({
              ...prev,
              displayName: syncData.user.displayName || prev.displayName,
              photoURL: syncData.user.photoURL || prev.photoURL,
              // We can attach custom fields to the user object for local use
              ...({ bio: syncData.user.bio }) 
            } as any) : null);
          }
        } catch (error) {
          console.error('Failed to sync user with MongoDB:', error);
        }
      }
    });

    return unsubscribe;
  }, []);

  const signIn = (email: string, password: string) => {
    return signInWithEmailAndPassword(auth, email, password);
  };

  const signUp = (email: string, password: string) => {
    return createUserWithEmailAndPassword(auth, email, password);
  };

  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    return signInWithPopup(auth, provider);
  };

  const logout = () => {
    return signOut(auth);
  };

  const updateUserProfile = async (displayName: string, photoURL?: string, bio?: string) => {
    if (!auth.currentUser) throw new Error("No user logged in");

    const safePhotoURL = photoURL?.startsWith('data:') ? undefined : photoURL;

    await updateProfile(auth.currentUser, {
      displayName,
      ...(safePhotoURL ? { photoURL: safePhotoURL } : {})
    });

    const syncRes = await fetch(`${API_URL}/api/users/sync`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        uid: auth.currentUser.uid,
        email: auth.currentUser.email,
        displayName,
        photoURL: photoURL || auth.currentUser.photoURL,
        bio,
        authProvider: auth.currentUser.providerData[0]?.providerId || 'email'
      })
    });

    const syncData = await syncRes.json();
    if (!syncRes.ok || !syncData.success) {
      throw new Error(syncData.error || syncData.message || 'Failed to save profile');
    }

    const savedPhotoURL = syncData.user?.photoURL || photoURL || auth.currentUser.photoURL || '';

    setUser({
      ...auth.currentUser,
      displayName,
      photoURL: savedPhotoURL
    } as User);
  };

  const value: AuthContextType = {
    user,
    loading,
    signIn,
    signUp,
    signInWithGoogle,
    logout,
    updateUserProfile
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
