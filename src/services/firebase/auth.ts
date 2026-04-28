import { firebaseAuth, firebaseConfigured } from './app'
import { signInWithEmailAndPassword, signOut } from 'firebase/auth'

export async function firebaseSignIn(email: string, password: string) {
  if (!firebaseConfigured) {
    return null
  }

  return signInWithEmailAndPassword(firebaseAuth, email, password)
}

export async function firebaseSignOut() {
  if (!firebaseConfigured) {
    return null
  }

  return signOut(firebaseAuth)
}