import { 
  getFirestore, 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  setDoc, 
  deleteDoc, 
  query, 
  where, 
  getDocFromServer,
  serverTimestamp
} from 'firebase/firestore';
import { Investment } from '../types';
import { app, auth } from './firebaseAuth';
import firebaseConfig from '../../firebase-applet-config.json';

// Initialize the Firestore instance with the dedicated db instance ID
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  };
  console.error('Firestore Error details:', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// Test Connection on initial boot as required by system instructions
export async function testFirestoreConnection() {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.warn("Firestore connection check: client is offline or connecting in background.");
    }
  }
}

/**
 * Fetch all investments belonging to the authenticated User from cloud Firestore
 */
export async function fetchUserInvestments(userId: string): Promise<Investment[]> {
  const path = 'investments';
  try {
    const q = query(collection(db, path), where('ownerId', '==', userId));
    const snapshot = await getDocs(q);
    const results: Investment[] = [];
    snapshot.forEach((docSnap) => {
      const data = docSnap.data();
      results.push({
        ...data,
        id: docSnap.id,
      } as Investment);
    });
    return results;
  } catch (err) {
    handleFirestoreError(err, OperationType.LIST, path);
    return [];
  }
}

/**
 * Persist or update an investment to the cloud database
 */
export async function saveUserInvestment(userId: string, investment: Investment): Promise<void> {
  const path = `investments/${investment.id}`;
  try {
    const docRef = doc(db, 'investments', investment.id);
    const existingSnap = await getDoc(docRef);
    
    const payload: any = {
      ...investment,
      ownerId: userId,
      updatedAt: serverTimestamp(),
    };
    
    if (existingSnap.exists()) {
      // Retain the existing createdAt timestamp
      const data = existingSnap.data();
      payload.createdAt = data.createdAt || serverTimestamp();
    } else {
      payload.createdAt = serverTimestamp();
    }

    await setDoc(docRef, payload);
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, path);
  }
}

/**
 * Delete an investment record by ID
 */
export async function deleteUserInvestment(userId: string, investmentId: string): Promise<void> {
  const path = `investments/${investmentId}`;
  try {
    const docRef = doc(db, 'investments', investmentId);
    await deleteDoc(docRef);
  } catch (err) {
    handleFirestoreError(err, OperationType.DELETE, path);
  }
}
