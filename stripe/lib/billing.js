"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listSubscriptions = exports.cancelSubscription = exports.createSubscription = void 0;
const _1 = require("./");
const firebase_1 = require("./firebase");
const cutomers_1 = require("./cutomers");
const firebase_admin_1 = require("firebase-admin");
async function createSubscription(userId, plan, payment_method) {
    const customer = await cutomers_1.getOrCreateCustomer(userId);
    await _1.stripe.paymentMethods.attach(payment_method, { customer: customer.id });
    await _1.stripe.customers.update(customer.id, {
        invoice_settings: { default_payment_method: payment_method },
    });
    const subscription = await _1.stripe.subscriptions.create({
        customer: customer.id,
        items: [{ plan }],
        expand: ['latest_invoice.payment_intent'],
    });
    const invoice = subscription.latest_invoice;
    const payment_intent = invoice.payment_intent;
    if (payment_intent.status === "succeeded") {
        await firebase_1.db.collection("users").doc(userId).set({
            stripeCustomerId: customer.id,
            activePlans: firebase_admin_1.firestore.FieldValue.arrayUnion(plan)
        }, { merge: true });
    }
    return subscription;
}
exports.createSubscription = createSubscription;
async function cancelSubscription(userId, subscriptionId) {
    const customer = await cutomers_1.getOrCreateCustomer(userId);
    if (customer.metadata.firebaseUID !== userId) {
        throw Error("Firebase UID does not match stripe account");
    }
    const subscription = await _1.stripe.subscriptions.del(subscriptionId);
    //cancel on the end of the period
    //const subscription = stripe.subscriptions.update(subscriptionId,{cancel_at_period_end:true})
    if (subscription.status === 'canceled') {
        await firebase_1.db
            .collection('users')
            .doc(userId)
            .update({
            activePlans: firebase_admin_1.firestore.FieldValue.arrayRemove(subscription.plan.id),
        });
    }
    return subscription;
}
exports.cancelSubscription = cancelSubscription;
async function listSubscriptions(userId) {
    const customer = await cutomers_1.getOrCreateCustomer(userId);
    const subscriptions = await _1.stripe.subscriptions.list({
        customer: customer.id,
    });
    return subscriptions;
}
exports.listSubscriptions = listSubscriptions;
const webhookHandlers = {
    'payment_intent.succeeded': async (data) => {
        // Add your business logic here
    },
    'payment_intent.payment_failed': async (data) => {
        // Add your business logic here
    },
    'customer.subscription.deleted': async (data) => {
        const customer = await _1.stripe.customers.retrieve(data.customer);
        const userId = customer.metadata.firebaseUID;
        const userRef = firebase_1.db.collection('users').doc(userId);
        await userRef
            .update({
            activePlans: firebase_admin_1.firestore.FieldValue.arrayRemove(data.plan.id),
        });
    },
    'customer.subscription.created': async (data) => {
        const customer = await _1.stripe.customers.retrieve(data.customer);
        const userId = customer.metadata.firebaseUID;
        const userRef = firebase_1.db.collection('users').doc(userId);
        await userRef
            .update({
            activePlans: firebase_admin_1.firestore.FieldValue.arrayUnion(data.plan.id),
        });
    },
    'invoice.payment_succeeded': async (data) => {
        // Add your business logic here
    },
    'invoice.payment_failed': async (data) => {
        const customer = await _1.stripe.customers.retrieve(data.customer);
        const userSnapshot = await firebase_1.db.collection('users').doc(customer.metadata.firebaseUID).get();
        await userSnapshot.ref.update({ status: 'PAST_DUE' });
    }
};
//# sourceMappingURL=billing.js.map