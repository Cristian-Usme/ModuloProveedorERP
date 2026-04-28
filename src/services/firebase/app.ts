import { initializeApp, getApps } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'
import { firebaseConfig, firebaseConfigured } from './config'

const app = getApps().length > 0 ? getApps()[0] : initializeApp(firebaseConfig)

export const firebaseApp = app
export const firebaseAuth = getAuth(app)
export const firestoreDb = getFirestore(app)
export const firebaseDb = firestoreDb // Alias for consistency
export const firebaseStorage = getStorage(app)
export { firebaseConfigured }