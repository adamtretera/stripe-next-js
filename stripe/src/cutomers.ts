import {stripe} from "./index";
import {db} from "./firebase"
import Stripe from "stripe";



export async function getOrCreateCustomer(userId:string,params?:Stripe.CustomerCreateParams){
    const userSnapshot= await db.collection("user").doc(userId).get()

    const {stripeCustomerId, email} = userSnapshot.data()


    if(!stripeCustomerId){
        const customer = await stripe.customers.create({
            email,
            metadata:{
                firebaseUID:userId
            },
            ...params
        });
        await userSnapshot.ref.update({stripeCustomerId:customer.id})
        return customer
    }
    else{
        return await stripe.customers.retrieve(stripeCustomerId) as Stripe.Customer
    }
}