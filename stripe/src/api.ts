import express, {NextFunction, Request, Response} from "express"
import {createPaymentIntent} from "./payments";

export const app = express()

app.use(express.json())

import cors from "cors"

app.use(cors({origin:true}))

app.post('/test', (req: Request, res: Response) => {
    const amount = req.body.amount;
    res.status(200).send({ with_tax: amount * 7 });
});
import {createStripeCheckoutSession} from "./checkout";
app.post("/checkouts/",runAsync( async ({body}:Request,res:Response) =>{
    res.send(
    await createStripeCheckoutSession(body.line_items)
    )
    })
)


app.post("/payments",runAsync(async ({body}:Request,res:Response)=>{
    res.send(
        await createPaymentIntent(body.amount)
    );
    })
);
function runAsync(callback:Function){
    return (req:Request,res:Response,next:NextFunction)=>{
        callback(req,res,next).catch(next)
    }
}
