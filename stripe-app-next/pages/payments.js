import React, { useState } from 'react';
import { fetchFromAPI } from './api/helpers';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

function Payments() {
    const stripe = useStripe();
    const elements = useElements();

    const [amount, setAmount] = useState(0);
    const [paymentIntent, setPaymentIntent] = useState();

    // Create a payment intent on the server
    const createPaymentIntent = async (event) => {

        // Clamp amount to Stripe min/max
        const validAmount = Math.min(Math.max(amount, 50), 9999999);
        setAmount(validAmount);

        // Make the API Request

        const pi = await fetchFromAPI('payments', { body: { amount: validAmount } });
        setPaymentIntent(pi);
    };

    // Handle the submission of card details
    const handleSubmit = async (event) => {
        event.preventDefault();

        const cardElement = elements.getElement(CardElement);

        // Confirm Card Payment
        const {
            paymentIntent: updatedPaymentIntent,
            error,
        } = await stripe.confirmCardPayment(paymentIntent.client_secret, {
            payment_method: { card: cardElement },
        });

        if (error) {
            console.error(error);
            error.payment_intent && setPaymentIntent(error.payment_intent);
        } else {
            setPaymentIntent(updatedPaymentIntent);
        }
    };

    return (
        <div className="px-5">
            <h2 className="text-3xl">Payments</h2>
            <p>
                One-time payment scenario.
            </p>
            <div className="pt-2">
                <PaymentIntentData data={paymentIntent} />
            </div>


            <div className="">
                <h3>Step 1: Create a Payment Intent</h3>
                <p>
                    Change the amount of the payment in the form, then request a Payment
                    Intent to create context for one-time payment. Min 50, Max 9999999
                </p>

                <div className="flex justify-center">
                    <input
                        className="border-black border-2 rounded px-2 mr-6"
                        type="number"
                        value={amount}
                        disabled={paymentIntent}
                        onChange={(e) => setAmount(e.target.value)}
                    />
                    <button
                        className="border-2 border-black rounded p-4"
                        disabled={amount <= 0}
                        onClick={createPaymentIntent}
                        hidden={paymentIntent}>
                        P??praven zaplatit { (amount / 100).toFixed(2) }K??
                    </button>
                </div>
            </div>


            <form onSubmit={handleSubmit} className="" hidden={!paymentIntent || paymentIntent.status === 'succeeded' }>
                <h3>Step 2: Submit a Payment Method</h3>
                <p>Collect credit card details, then submit the payment.</p>
                <p>
                    Normal Card: <code>4242424242424242</code>
                </p>
                <p>
                    3D Secure Card: <code>4000002500003155</code>
                </p>

                <hr />

                <CardElement />
                <button className="btn btn-success" type="submit">
                    Pay
                </button>
            </form>
        </div>
    );
}

function PaymentIntentData(props) {
    if (props.data) {
        const { id, amount, status, client_secret } = props.data;
        return (
            <>
                <h3>Payment Intent <span
                    className={
                        'badge ' + ( status === 'succeeded' ? 'badge-success' : 'badge-secondary')
                    }>
          {status}
        </span></h3>
                <pre>
        ID: {id} <br />
        Client Secret: {client_secret} <br />
        Amount: {amount} <br />
        Status:{status}
                    <br />
      </pre>
            </>
        );
    } else {
        return <p>Payment Intent Not Created Yet</p>;
    }
}

export default Payments;