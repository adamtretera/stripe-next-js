import '../styles/globals.css'
import {Elements} from "@stripe/react-stripe-js";
import {loadStripe} from "@stripe/stripe-js/pure";
import Navbar from "../components/Navbar";

export const stripePromise = loadStripe("pk_test_51IUVQQLaWxuHEV6M2VURAkjduJsWJ8HWfNeSbq86S5zR1wVBSKQHEXnNy0l8Mf80VYymQCkjt8jrLeSEKXtnzwkV002NwZDpTE")


function MyApp({ Component, pageProps }) {

  return (
        <div className="bg-white bg rounded-2xl shadow-2xl border-2 border-black ">


      <Elements stripe={stripePromise}>
          <Navbar/>
        <Component {...pageProps} />
      </Elements>
        </div>

  )
}

export default MyApp
