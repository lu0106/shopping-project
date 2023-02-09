import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import { initializeApp } from "firebase/app";
import { getFirestore } from "@firebase/firestore";

const firebaseConfig = {
  apiKey: "",
  authDomain: "",
  projectId: "",
  storageBucket: "",
  messagingSenderId: "",
  appId: "",
};

const app = firebase.initializeApp(firebaseConfig);

export const auth = app.auth();
export default app;

const app1 = initializeApp(firebaseConfig);
export const db = getFirestore(app1);
