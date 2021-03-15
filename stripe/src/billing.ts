import { stripe } from './';
import { db } from './firebase';
import Stripe from 'stripe';
import { getOrCreateCustomer } from './cutomers';

import { firestore } from 'firebase-admin';


export async function createSubscription( userId: string,
                                          plan: string,
                                          payment_method:string){

const customer = await getOrCreateCustomer(userId)

    await stripe.paymentMethods.attach(payment_method,{customer:customer.id});
await stripe.customers.update(customer.id,{
    invoice_settings:{default_payment_method:payment_method},
})
    const subscription = await stripe.subscriptions.create({
        customer: customer.id,
        items: [{ plan }],
        expand: ['latest_invoice.payment_intent'],
    });

    const invoice = subscription.latest_invoice as Stripe.Invoice
    const payment_intent = invoice.payment_intent as Stripe.PaymentIntent
    if(payment_intent.status==="succeeded"){
       await db.collection("users").doc(userId).set({
           stripeCustomerId:customer.id,
           activePlans: firestore.FieldValue.arrayUnion(plan)
       },
           {merge:true})
    }
    return subscription
}

export async function cancelSubscription(userId:string,subscriptionId:string){
    const customer = await getOrCreateCustomer(userId)
    if(customer.metadata.firebaseUID !==userId){
        throw Error("Firebase UID does not match stripe account")
    }
    const subscription = await stripe.subscriptions.del(subscriptionId)
    //cancel on the end of the period
    //const subscription = stripe.subscriptions.update(subscriptionId,{cancel_at_period_end:true})
    if (subscription.status === 'canceled') {
        await db
            .collection('users')
            .doc(userId)
            .update({
                activePlans: firestore.FieldValue.arrayRemove(subscription.plan.id),
            });
    }

    return subscription
}
export async function listSubscriptions(userId:string){
    const customer = await getOrCreateCustomer(userId)
    const subscriptions = await stripe.subscriptions.list({
        customer: customer.id,

    })
    return subscriptions
}


const webhookHandlers = {
    'payment_intent.succeeded': async (data: Stripe.PaymentIntent) => {
        // Add your business logic here
    },
    'payment_intent.payment_failed': async (data: Stripe.PaymentIntent) => {
        // Add your business logic here
    },
    'customer.subscription.deleted': async (data: Stripe.Subscription) => {
        const customer = await stripe.customers.retrieve( data.customer as string ) as Stripe.Customer;
        const userId = customer.metadata.firebaseUID;
        const userRef = db.collection('users').doc(userId);

        await userRef
            .update({
                activePlans: firestore.FieldValue.arrayRemove(data.plan.id),
            });
    },
    'customer.subscription.created': async (data: Stripe.Subscription) => {
        const customer = await stripe.customers.retrieve( data.customer as string ) as Stripe.Customer;
        const userId = customer.metadata.firebaseUID;
        const userRef = db.collection('users').doc(userId);

        await userRef
            .update({
                activePlans: firestore.FieldValue.arrayUnion(data.plan.id),
            });
    },
    'invoice.payment_succeeded': async (data: Stripe.Invoice) => {
        // Add your business logic here
    },
    'invoice.payment_failed': async (data: Stripe.Invoice) => {

        const customer = await stripe.customers.retrieve( data.customer as string ) as Stripe.Customer;
        const userSnapshot = await db.collection('users').doc(customer.metadata.firebaseUID).get();
        await userSnapshot.ref.update({ status: 'PAST_DUE' });

    }
}