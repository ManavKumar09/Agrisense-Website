import { initializeApp } from "firebase/app"
import { getAuth } from "firebase/auth"
import { getFirestore } from "firebase/firestore"
import { getAnalytics } from "firebase/analytics"

const firebaseConfig = {
  apiKey: "AIzaSyC0I3MfjG0thavVtHznsB91vSeiGhCd-SM",
  authDomain: "agrisense-project-a5820.firebaseapp.com",
  projectId: "agrisense-project-a5820",
  storageBucket: "agrisense-project-a5820.firebasestorage.app",
  messagingSenderId: "75378593148",
  appId: "1:75378593148:web:53e1da09c44164322ea8f9",
  measurementId: "G-HKFGNSWCBF",
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app)

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app)

// Initialize Analytics (only in browser environment)
export const analytics = typeof window !== "undefined" ? getAnalytics(app) : null

export default app
