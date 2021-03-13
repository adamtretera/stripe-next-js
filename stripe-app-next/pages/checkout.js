import React,{useState} from 'react';
import {useStripe} from "@stripe/react-stripe-js";
import {fetchFromApi} from "./api/helpers";


function Checkout(props) {
    const stripe= useStripe()
    const[product,setProduct]= useState({
        name: "Hat",
        description: "My fancy hat, which i wear every day",
        images:[
            "https://i.picsum.photos/id/921/200/300.jpg?hmac=xK66C9GzGWM4iphOXQgC1nT2RLnRG7eOQe5DM3VBj5I"
        ],
        amount:799,
        currency:"usd",
        quantity:0

    })

    const changeQuantity=(v)=>{
        setProduct({...product,quantity:Math.max(0,product.quantity+v)})

        const handleClick = async (event) =>{
            const body = {line_items:[product]}
            const {id:sessionId} = await fetchFromApi("checkouts",{
                body
            })
            const {error} = await stripe.redirectToCheckout({
                sessionId,
            });
            if(error){
                console.log(error)
            }
        }

    }

    return (
        <>
            <div>
                <h3>{product.name}</h3>
                <h4>Stripe amount: {product.amount}</h4>
                <img src={product.images[0]} width="250px" alt={product.name}/>
            </div>


        </>
    );
}

export default Checkout;

