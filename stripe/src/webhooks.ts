import {stripe} from "./index";
import Stripe from "stripe";

const webhookHandlers ={
    'payment_intent.succeeded': async (data: Stripe.PaymentIntent) => {
        // Add your business logic here

    },
    'payment_intent.payment_failed': async (data: Stripe.PaymentIntent) => {
        // Add your business logic here
    },
}

export const handleStripeWebhook = async (req,res)=>{
    const sig = req.headers["stripe-signature"];
    const event = stripe.webhooks.constructEvent(req["rawBody"],sig,process.env.STRIPE_WEBHOOK_SECRET)
    try{
    await webhookHandlers[event.type](event.data.object)
        res.send({received:true})
    }
    catch (err){
        console.log(err)
        res.status(400).send(`Webhook error: ${err.message}`)
    }
}