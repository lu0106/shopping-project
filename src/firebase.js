import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import { initializeApp } from "firebase/app";
import { getFirestore } from "@firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBIfM7YYXS_jnZmFwqAy80SzrZ1u6uFfw0",
  authDomain: "project-febf7.firebaseapp.com",
  projectId: "project-febf7",
  storageBucket: "project-febf7.appspot.com",
  messagingSenderId: "359670127486",
  appId: "1:359670127486:web:8ebdd97acafd7504a0f12f",
};

const app = firebase.initializeApp(firebaseConfig);

export const auth = app.auth();
export default app;

const app1 = initializeApp(firebaseConfig);
export const db = getFirestore(app1);
