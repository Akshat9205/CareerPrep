import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  User,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  UserCredential,
  updateProfile
} from 'firebase/auth';
import { auth, getFirebaseErrorMessage } from '@/lib/firebase';
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
    // Process redirect sign-in result when returning to the app
    getRedirectResult(auth)
      .then((result) => {
        if (result) {
          console.log("Successfully logged in via redirect", result.user);
        }
      })
      .catch((error) => {
        console.error("Firebase Redirect sign-in error:", error);
      });

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

  const signIn = async (email: string, password: string) => {
    try {
      return await signInWithEmailAndPassword(auth, email, password);
    } catch (error: any) {
      throw new Error(getFirebaseErrorMessage(error));
    }
  };

  const signUp = async (email: string, password: string) => {
    try {
      return await createUserWithEmailAndPassword(auth, email, password);
    } catch (error: any) {
      throw new Error(getFirebaseErrorMessage(error));
    }
  };

  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: 'select_account' });
    
    try {
      // Attempt popup sign-in
      return await signInWithPopup(auth, provider);
    } catch (error: any) {
      const code = error.code || '';
      const isCoopOrPopupBlock = 
        code.includes('auth/popup-blocked') || 
        code.includes('auth/popup-closed-by-user') || 
        code.includes('auth/cancelled-popup-request') ||
        error.message?.includes('Cross-Origin-Opener-Policy') ||
        error.message?.includes('closed');

      if (isCoopOrPopupBlock) {
        console.warn("Popup blocked or COOP header issue. Falling back to redirect...");
        await signInWithRedirect(auth, provider);
        return null as any;
      }
      
      throw new Error(getFirebaseErrorMessage(error));
    }
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
