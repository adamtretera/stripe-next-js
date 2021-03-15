import React from 'react';
import firebase from "firebase/app";
import {auth,db} from "./firebase"


export function SignIn(){
    const signIn = async ()=>{
        const credential = await auth.signInWithPopup(
            new firebase.auth.GoogleAuthProvider()
        )
        const {uid,email} = credential.user;
        db.collection("users").doc(uid).set({email},{merge:true})
    }
    return (
        <button onClick={signIn}>
            Sign In With Google
        </button>
    )
}
export function SignOut(props){
    return props.user &&(
        <button onClick={()=>auth.signOut()}>Sign Out User {props.user.uid}</button>
    )
}