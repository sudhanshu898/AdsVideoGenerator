import {Request, Response} from 'express'
import  * as Sentry from "@sentry/node"

//get user crediits
export const getUserCredits = async(req: Request, res: Response)=>{
    try {
        
    } catch (error : any) {
        Sentry.captureException(error);
        res.status(500).json({message:error.code || error.message})

    }
}