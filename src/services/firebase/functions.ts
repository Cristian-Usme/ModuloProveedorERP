import { getFunctions, httpsCallable } from 'firebase/functions'
import { firebaseApp, firebaseConfigured } from './app'

const firebaseFunctions = getFunctions(firebaseApp)

export async function invokeFunction<TResponse = unknown, TPayload = unknown>(endpoint: string, payload?: TPayload) {
  if (!firebaseConfigured) {
    return null
  }

  const callable = httpsCallable<TPayload, TResponse>(firebaseFunctions, endpoint)
  const result = await callable(payload ?? ({} as TPayload))
  return result.data
}