"use client";

import { initializeApp, getApps, getApp, FirebaseApp } from "firebase/app";
import {
  getAuth,
  Auth,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  User as FirebaseUser,
} from "firebase/auth";
import { firebaseConfig, isFirebaseConfigured } from "./config";

let app: FirebaseApp | null = null;
let auth: Auth | null = null;

if (typeof window !== "undefined" && isFirebaseConfigured()) {
  try {
    app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
    auth = getAuth(app);
  } catch (error) {
    console.warn("Firebase client initialization note:", error);
  }
}

export { auth, app };

export interface AuthResult {
  success: boolean;
  user?: {
    uid: string;
    email: string;
    displayName: string;
    photoURL?: string | null;
  };
  error?: string;
}

/**
 * Sign in using Google OAuth via Firebase (or Developer Simulator if unconfigured)
 */
export async function signInWithGoogle(): Promise<AuthResult> {
  if (isFirebaseConfigured() && auth) {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      return {
        success: true,
        user: {
          uid: user.uid,
          email: user.email || "xasan@os.local",
          displayName: user.displayName || "Xasan Mukhammadiev",
          photoURL: user.photoURL,
        },
      };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to sign in with Google";
      return { success: false, error: msg };
    }
  }

  // Developer Simulation Fallback for instant local preview
  return {
    success: true,
    user: {
      uid: "firebase-google-sim-1",
      email: "xasan.google@os.local",
      displayName: "Xasan M. (Google Verified)",
      photoURL: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150",
    },
  };
}

/**
 * Sign in using Email & Password via Firebase (or Developer Simulator if unconfigured)
 */
export async function signInWithEmail(
  email: string,
  pass: string
): Promise<AuthResult> {
  if (isFirebaseConfigured() && auth) {
    try {
      const result = await signInWithEmailAndPassword(auth, email, pass);
      const user = result.user;
      return {
        success: true,
        user: {
          uid: user.uid,
          email: user.email || email,
          displayName: user.displayName || email.split("@")[0],
          photoURL: user.photoURL,
        },
      };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Invalid credentials";
      return { success: false, error: msg };
    }
  }

  // Developer Simulation Fallback
  return {
    success: true,
    user: {
      uid: `firebase-email-sim-${Date.now()}`,
      email,
      displayName: email.split("@")[0],
      photoURL: null,
    },
  };
}

/**
 * Register / Sign up using Email & Password
 */
export async function signUpWithEmail(
  email: string,
  pass: string,
  displayName?: string
): Promise<AuthResult> {
  if (isFirebaseConfigured() && auth) {
    try {
      const result = await createUserWithEmailAndPassword(auth, email, pass);
      const user = result.user;
      return {
        success: true,
        user: {
          uid: user.uid,
          email: user.email || email,
          displayName: displayName || user.displayName || email.split("@")[0],
          photoURL: user.photoURL,
        },
      };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to register account";
      return { success: false, error: msg };
    }
  }

  // Developer Simulation Fallback
  return {
    success: true,
    user: {
      uid: `firebase-signup-sim-${Date.now()}`,
      email,
      displayName: displayName || email.split("@")[0],
      photoURL: null,
    },
  };
}

/**
 * Sign out user from Firebase client
 */
export async function signOutClient(): Promise<void> {
  if (auth) {
    try {
      await signOut(auth);
    } catch (err) {
      console.warn("Sign out notice:", err);
    }
  }
}
