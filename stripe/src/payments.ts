import {stripe} from "./index";

export async function createPaymentIntent(amount:number){
    const paymentIntent = await stripe.paymentIntents.create({
        amount,
        currency:"usd"
    })
    paymentIntent.status;
    return paymentIntent
}