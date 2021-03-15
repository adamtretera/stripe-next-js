import express, {NextFunction, Request, Response} from "express"
import {createPaymentIntent} from "./payments";
import { auth } from './firebase';

export const app = express()

app.use(express.json())

import cors from "cors"

app.use(cors({origin:true}))

app.post('/test', (req: Request, res: Response) => {
    const amount = req.body.amount;
    res.status(200).send({ with_tax: amount * 7 });
});
import {createStripeCheckoutSession} from "./checkout";
import { handleStripeWebhook} from "./webhooks";
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
app.use(cors({origin:true}))
app.use(
    express.json({
        verify: (req, res, buffer) => (req['rawBody'] = buffer),
    })
);
app.post("/hooks",runAsync(handleStripeWebhook))


app.use(decodeJWT);

/**
 * Decodes the JSON Web Token sent via the frontend app
 * Makes the currentUser (firebase) data available on the body.
 */
async function decodeJWT(req: Request, res: Response, next: NextFunction) {
    if (req.headers?.authorization?.startsWith('Bearer ')) {
        const idToken = req.headers.authorization.split('Bearer ')[1];

        try {
            const decodedToken = await auth.verifyIdToken(idToken);
            req['currentUser'] = decodedToken;
        } catch (err) {
            console.log(err);
        }
    }

    next();
}

function validateUser(req: Request) {
    const user = req['currentUser'];
    if (!user) {
        throw new Error(
            'You must be logged in to make this request. i.e Authroization: Bearer <token>'
        );
    }

    return user;
}
