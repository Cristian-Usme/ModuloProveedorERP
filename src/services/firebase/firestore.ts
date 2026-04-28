import { collection, doc, getDoc, getDocs } from 'firebase/firestore'
import { firestoreDb, firebaseConfigured } from './app'

export async function readCollection(path: string) {
  if (!firebaseConfigured) {
    return []
  }

  const snapshot = await getDocs(collection(firestoreDb, path))
  return snapshot.docs.map((entry) => ({ id: entry.id, ...entry.data() }))
}

export async function readDocument(path: string, id: string) {
  if (!firebaseConfigured) {
    return null
  }

  const snapshot = await getDoc(doc(firestoreDb, path, id))
  return snapshot.exists() ? { id: snapshot.id, ...snapshot.data() } : null
}