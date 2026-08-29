import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, signInWithPopup, GoogleAuthProvider, onAuthStateChanged, User } from 'firebase/auth';
import firebaseConfig from '../../firebase-applet-config.json';

export const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
export const auth = getAuth(app);

const provider = new GoogleAuthProvider();
// Google Calendar scopes requested by the user and confirmed in the UI
provider.addScope('https://www.googleapis.com/auth/calendar');
provider.addScope('https://www.googleapis.com/auth/calendar.events');

let cachedAccessToken: string | null = localStorage.getItem('gcal_access_token');
let tokenExpiresAt: number = Number(localStorage.getItem('gcal_token_expires') || '0');

export const initAuth = (
  onAuthSuccess?: (user: User, token: string) => void,
  onAuthFailure?: () => void
) => {
  return onAuthStateChanged(auth, async (user: User | null) => {
    if (user) {
      if (cachedAccessToken && tokenExpiresAt > Date.now()) {
        if (onAuthSuccess) onAuthSuccess(user, cachedAccessToken);
      } else {
        if (onAuthFailure) onAuthFailure();
      }
    } else {
      cachedAccessToken = null;
      tokenExpiresAt = 0;
      localStorage.removeItem('gcal_access_token');
      localStorage.removeItem('gcal_token_expires');
      if (onAuthFailure) onAuthFailure();
    }
  });
};

export const googleSignIn = async (): Promise<{ user: User; accessToken: string } | null> => {
  try {
    const result = await signInWithPopup(auth, provider);
    const credential = GoogleAuthProvider.credentialFromResult(result);
    const token = credential?.accessToken;
    if (!token) {
      throw new Error('Failed to retrieve access token from Google.');
    }
    cachedAccessToken = token;
    tokenExpiresAt = Date.now() + 3500 * 1000;
    
    localStorage.setItem('gcal_access_token', token);
    localStorage.setItem('gcal_token_expires', String(tokenExpiresAt));

    return { user: result.user, accessToken: token };
  } catch (error) {
    console.error('Sign in error:', error);
    throw error;
  }
};

export const getCachedToken = (): string | null => {
  if (cachedAccessToken && tokenExpiresAt > Date.now()) {
    return cachedAccessToken;
  }
  return null;
};

export const logout = async () => {
  await auth.signOut();
  cachedAccessToken = null;
  tokenExpiresAt = 0;
  localStorage.removeItem('gcal_access_token');
  localStorage.removeItem('gcal_token_expires');
};
