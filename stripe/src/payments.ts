import { stripe } from './';

/**
 * Create a Payment Intent with a specific amount
 */
export async function createPaymentIntent(amount: number) {

    const paymentIntent = await stripe.paymentIntents.create({
        amount,
        currency: 'czk',
        receipt_email: 'adam3tera@gmail.com',
    });

    return paymentIntent;
}



export async function createPaymentIntentAndCharge(amount: number, customer: string, payment_method: string) {
    const paymentIntent = await stripe.paymentIntents.create({
        amount,
        customer,
        payment_method,
        currency: 'czk',
        off_session: true,
        confirm: true,
    });

    return paymentIntent;

}
