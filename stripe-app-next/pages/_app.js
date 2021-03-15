import '../styles/globals.css'
import {Elements} from "@stripe/react-stripe-js";
import {loadStripe} from "@stripe/stripe-js/pure";
import Navbar from "../components/Navbar";
import { FirebaseAppProvider } from 'reactfire';

export const stripePromise = loadStripe("pk_test_51IUVQQLaWxuHEV6M2VURAkjduJsWJ8HWfNeSbq86S5zR1wVBSKQHEXnNy0l8Mf80VYymQCkjt8jrLeSEKXtnzwkV002NwZDpTE")

const firebaseConfig = {
    apiKey: "AIzaSyAbxrW7K8-NZX7PHqLZy8NFlGPtnU2UjGM",
    authDomain: "stripe-payment-react.firebaseapp.com",
    projectId: "stripe-payment-react",
    storageBucket: "stripe-payment-react.appspot.com",
    messagingSenderId: "282849225590",
    appId: "1:282849225590:web:29425b07317149c8576857"
};
function MyApp({ Component, pageProps }) {

  return (
        <div className="bg-white bg rounded-2xl shadow-2xl border-2 border-black ">
            <FirebaseAppProvider firebaseConfig={firebaseConfig}>
                      <Elements stripe={stripePromise}>
                          <Navbar/>
                        <Component {...pageProps} />
                      </Elements>
            </FirebaseAppProvider>
        </div>

  )
}

export default MyApp
