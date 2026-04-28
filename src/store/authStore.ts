import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  type User as FirebaseUser,
} from 'firebase/auth'
import { doc, getDoc, setDoc } from 'firebase/firestore'
import { firebaseAuth, firebaseDb } from '@/services/firebase/app'
import type { UserProfile, UserRole } from '@/types/firebaseSchema'

type AuthState = {
  user: (FirebaseUser & { profile?: UserProfile }) | null
  loading: boolean
  error: string | null
  isAuthenticated: boolean
  signUp: (email: string, password: string, fullName: string, companyId: string) => Promise<void>
  signIn: (email: string, password: string) => Promise<void>
  signOut: () => Promise<void>
  fetchUserProfile: (uid: string) => Promise<UserProfile | null>
  updateUserProfile: (uid: string, updates: Partial<UserProfile>) => Promise<void>
  initializeAuth: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      loading: true,
      error: null,
      isAuthenticated: false,

      initializeAuth: () => {
        const unsubscribe = onAuthStateChanged(firebaseAuth, async (firebaseUser) => {
          if (firebaseUser) {
            // Load user profile from Firestore
            const profileDoc = await getDoc(doc(firebaseDb, 'users', firebaseUser.uid))
            const profile = profileDoc.data() as UserProfile | undefined

            set({
              user: { ...firebaseUser, profile },
              isAuthenticated: true,
              loading: false,
              error: null,
            })
          } else {
            set({
              user: null,
              isAuthenticated: false,
              loading: false,
            })
          }
        })

        return unsubscribe
      },

      signUp: async (email: string, password: string, fullName: string, companyId: string) => {
        try {
          set({ loading: true, error: null })

          // Create Firebase Auth user
          const { user: firebaseUser } = await createUserWithEmailAndPassword(firebaseAuth, email, password)

          // Create Firestore profile
          const userProfile: UserProfile = {
            id: firebaseUser.uid,
            uid: firebaseUser.uid,
            email: firebaseUser.email!,
            fullName,
            role: 'viewer' as UserRole, // Default role
            companyId,
            status: 'active',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            lastActive: new Date().toISOString(),
          }

          await setDoc(doc(firebaseDb, 'users', firebaseUser.uid), userProfile)

          set({
            user: { ...firebaseUser, profile: userProfile },
            isAuthenticated: true,
            loading: false,
            error: null,
          })
        } catch (err) {
          const errorMessage = err instanceof Error ? err.message : 'Failed to sign up'
          set({ error: errorMessage, loading: false })
          throw err
        }
      },

      signIn: async (email: string, password: string) => {
        try {
          set({ loading: true, error: null })

          const { user: firebaseUser } = await signInWithEmailAndPassword(firebaseAuth, email, password)

          // Load user profile
          const profileDoc = await getDoc(doc(firebaseDb, 'users', firebaseUser.uid))
          const profile = profileDoc.data() as UserProfile | undefined

          // Update last active timestamp
          if (profile) {
            await setDoc(
              doc(firebaseDb, 'users', firebaseUser.uid),
              { lastActive: new Date().toISOString() },
              { merge: true }
            )
          }

          set({
            user: { ...firebaseUser, profile },
            isAuthenticated: true,
            loading: false,
            error: null,
          })
        } catch (err) {
          const errorMessage = err instanceof Error ? err.message : 'Failed to sign in'
          set({ error: errorMessage, loading: false })
          throw err
        }
      },

      signOut: async () => {
        try {
          set({ loading: true, error: null })
          await firebaseSignOut(firebaseAuth)
          set({
            user: null,
            isAuthenticated: false,
            loading: false,
            error: null,
          })
        } catch (err) {
          const errorMessage = err instanceof Error ? err.message : 'Failed to sign out'
          set({ error: errorMessage, loading: false })
          throw err
        }
      },

      fetchUserProfile: async (uid: string) => {
        try {
          const profileDoc = await getDoc(doc(firebaseDb, 'users', uid))
          return (profileDoc.data() as UserProfile) || null
        } catch (err) {
          console.error('Error fetching user profile:', err)
          return null
        }
      },

      updateUserProfile: async (uid: string, updates: Partial<UserProfile>) => {
        try {
          await setDoc(
            doc(firebaseDb, 'users', uid),
            {
              ...updates,
              updatedAt: new Date().toISOString(),
            },
            { merge: true }
          )
          set((state) => {
            if (!state.user) return {}
            
            const profile = state.user.profile
              ? { ...state.user.profile, ...updates }
              : (updates as UserProfile)
            
            return {
              user: {
                ...state.user,
                profile,
              } as (FirebaseUser & { profile?: UserProfile }) | null,
            }
          })
        } catch (err) {
          console.error('Error updating user profile:', err)
          throw err
        }
      },
    }),
    { name: 'erp-auth-state', partialize: (state) => ({ user: state.user }) }
  )
)