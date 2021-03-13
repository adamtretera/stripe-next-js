import {config} from "dotenv"

if(process.env.NODE_ENV !== "production"){
    config()
}
import Stripe from "stripe"
export const stripe = new Stripe(process.env.STRIPE_SECRET,{
    apiVersion:"2020-08-27"
});

import {app} from "./api"
const port = process.env.PORT || 3001
app.listen(port,()=>console.log(`API je dostupné na http://localhost:${port}`))
