import { getDownloadURL, ref, uploadBytes } from 'firebase/storage'
import { firebaseConfigured, firebaseStorage } from './app'

export async function uploadAsset(path: string, file: File) {
  if (!firebaseConfigured) {
    return null
  }

  const storageRef = ref(firebaseStorage, path)
  const snapshot = await uploadBytes(storageRef, file)
  return getDownloadURL(snapshot.ref)
}