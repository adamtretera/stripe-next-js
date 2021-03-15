import firebase from "firebase/app";
import React, { useState, useEffect, Suspense } from 'react';
import { fetchFromAPI } from './helpers';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { useUser, AuthCheck } from 'reactfire';
import { auth, db } from './firebase';




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

function SaveCard(props){
    const stripe = useStripe()
    const elements = useElements()
    const user = useUser()

    const [setupIntent,setSetupIntent] = useState()
    const [wallet,setWallet] = useState()
     useEffect(()=>{
         getWallet()
     },[user])
    //only when its first mounted or user is changed
    const createSetupIntent = async (event)=>{
        const si = await fetch("wallet")
        setSetupIntent(si)

    }
    const getWallet = async ()=>{
        if(user){
          const paymentMethods = await fetchFromAPI("wallet",{method:"GET"})
            setWallet(paymentMethods)


        }
    }
    const handleSubmit = async (event) => {
        event.preventDefault();

        const cardElement = elements.getElement(CardElement);

        // Confirm Card Setup
        const {
            setupIntent: updatedSetupIntent,
            error,
        } = await stripe.confirmCardSetup(setupIntent.client_secret, {
            payment_method: { card: cardElement },
        });

        if (error) {
            alert(error.message);
            console.log(error);
        } else {
            setSetupIntent(updatedSetupIntent);
            await getWallet();
            alert('Success! Card added to your wallet');
        }
    };


    return(
        <>
            <AuthCheck fallback={<SignIn/>}>
              <div>



                  <from onSubmit={handleSumbit}>
                      <CardElement/>
                      <button type={"submit"}>Attach</button>
                  </from>

                  <button onClick={createSetupIntent}>
                      Attach New Credit Card
                  </button>




                  <select>
                      {wallet.map((paymentSource)=>(
                          <CreditCard key={paymentSource.id} card={paymentSource.card}/>
                      ))}
                  </select>
                  <SignOut user={user}/>
              </div>

            </AuthCheck>
        </>
    )

}
function CreditCard(props){
    const {last4, brand, exp_month,exp_year} = props.card
    return(
        <option>
            {brand} **** **** **** **** {last4} expires {exp_month}/{exp_year}
        </option>
    )
}
export default function Customers() {
    return (
        <Suspense fallback={'loading user'}>
            <SaveCard />
        </Suspense>
    );
}