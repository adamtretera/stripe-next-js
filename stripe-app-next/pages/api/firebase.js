import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';

export const firebaseConfig = {
    apiKey: "AIzaSyAbxrW7K8-NZX7PHqLZy8NFlGPtnU2UjGM",
    authDomain: "stripe-payment-react.firebaseapp.com",
    projectId: "stripe-payment-react",
    storageBucket: "stripe-payment-react.appspot.com",
    messagingSenderId: "282849225590",
    appId: "1:282849225590:web:29425b07317149c8576857"
};

firebase.initializeApp(firebaseConfig)

export const db = firebase.firestore();
export const auth = firebase.auth();