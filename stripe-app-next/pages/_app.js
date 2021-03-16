import './index.css';
import {Elements} from "@stripe/react-stripe-js";
import {loadStripe} from "@stripe/stripe-js/pure";
import Navbar from "../components/Navbar";
import { FirebaseAppProvider } from 'reactfire';
import {firebaseConfig} from "./api/firebase";

export const stripePromise = loadStripe("pk_test_51IUVQQLaWxuHEV6M2VURAkjduJsWJ8HWfNeSbq86S5zR1wVBSKQHEXnNy0l8Mf80VYymQCkjt8jrLeSEKXtnzwkV002NwZDpTE")

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
