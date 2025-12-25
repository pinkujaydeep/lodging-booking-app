import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User as FirebaseUser,
} from 'firebase/auth';
import { auth, db } from './firebase';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { User, useAuthStore } from './store';
import { UserProfile } from './types';

export const registerUser = async (
  email: string,
  password: string,
  displayName: string
): Promise<User> => {
  const result = await createUserWithEmailAndPassword(auth, email, password);
  const firebaseUser = result.user;

  const userProfile: UserProfile = {
    uid: firebaseUser.uid,
    email: firebaseUser.email || '',
    displayName,
    role: 'customer',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  // Save user profile to Firestore
  await setDoc(doc(db, 'users', firebaseUser.uid), userProfile);

  return {
    uid: firebaseUser.uid,
    email: firebaseUser.email || '',
    displayName,
    role: 'customer',
  };
};

export const loginUser = async (email: string, password: string): Promise<User | null> => {
  try {
    const result = await signInWithEmailAndPassword(auth, email, password);
    const firebaseUser = result.user;

    // Fetch user profile from Firestore
    const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
    if (userDoc.exists()) {
      const userProfile = userDoc.data() as UserProfile;
      return {
        uid: firebaseUser.uid,
        email: firebaseUser.email || '',
        displayName: userProfile.displayName,
        photoURL: userProfile.photoURL,
        role: userProfile.role,
        lodgeId: userProfile.lodgeId,
      };
    }

    return null;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

export const logoutUser = async () => {
  return signOut(auth);
};

export const initializeAuth = () => {
  const unsubscribe = onAuthStateChanged(auth, async (firebaseUser: FirebaseUser | null) => {
    if (firebaseUser) {
      try {
        const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
        if (userDoc.exists()) {
          const userProfile = userDoc.data() as UserProfile;
          useAuthStore.setState({
            user: {
              uid: firebaseUser.uid,
              email: firebaseUser.email || '',
              displayName: userProfile.displayName,
              photoURL: userProfile.photoURL,
              role: userProfile.role,
              lodgeId: userProfile.lodgeId,
            },
            loading: false,
          });
        }
      } catch (error) {
        console.error('Error fetching user profile:', error);
      }
    } else {
      useAuthStore.setState({ user: null, loading: false });
    }
  });

  return unsubscribe;
};
