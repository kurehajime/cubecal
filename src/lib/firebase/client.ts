import { initializeApp, getApp, getApps, type FirebaseApp } from 'firebase/app'
import { getDatabase, type Database } from 'firebase/database'
import { initializeAppCheck, ReCaptchaV3Provider } from 'firebase/app-check'

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
}

let appCheckInitialized = false

export function isFirebaseConfigured() {
  return [
    firebaseConfig.apiKey,
    firebaseConfig.authDomain,
    firebaseConfig.databaseURL,
    firebaseConfig.projectId,
    firebaseConfig.appId,
  ].every(Boolean)
}

export function getFirebaseApp(): FirebaseApp | null {
  if (!isFirebaseConfigured()) {
    return null
  }

  const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig)

  maybeInitializeAppCheck(app)

  return app
}

export function getRealtimeDatabase(): Database | null {
  const app = getFirebaseApp()

  if (!app) {
    return null
  }

  return getDatabase(app)
}

function maybeInitializeAppCheck(app: FirebaseApp) {
  const siteKey = import.meta.env.VITE_FIREBASE_APP_CHECK_SITE_KEY

  if (!siteKey || appCheckInitialized || typeof window === 'undefined') {
    return
  }

  initializeAppCheck(app, {
    provider: new ReCaptchaV3Provider(siteKey),
    isTokenAutoRefreshEnabled: true,
  })

  appCheckInitialized = true
}
