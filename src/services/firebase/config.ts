type FirebaseAppConfig = {
  apiKey: string
  authDomain: string
  projectId: string
  storageBucket: string
  messagingSenderId: string
  appId: string
}

const fallbackConfig: FirebaseAppConfig = {
  apiKey: 'AIzaSyAVv3gbUVnSAMvNyrMB5VQTjO0rFupT_kw',
  authDomain: 'rutas-45ba1.firebaseapp.com',
  projectId: 'rutas-45ba1',
  storageBucket: 'rutas-45ba1.firebasestorage.app',
  messagingSenderId: '991715966325',
  appId: '1:991715966325:web:1f4847931285d7b17aa73c',
}

export const firebaseConfig: FirebaseAppConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY ?? fallbackConfig.apiKey,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN ?? fallbackConfig.authDomain,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID ?? fallbackConfig.projectId,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET ?? fallbackConfig.storageBucket,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID ?? fallbackConfig.messagingSenderId,
  appId: import.meta.env.VITE_FIREBASE_APP_ID ?? fallbackConfig.appId,
}

export const firebaseConfigured = Boolean(firebaseConfig.apiKey && firebaseConfig.projectId)