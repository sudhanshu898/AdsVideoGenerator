import {Request , Response} from 'express'
import  * as Sentry from "@sentry/node" 
import { prisma } from '../configs/prisma.js';
import {v2 as cloudinary} from 'cloudinary'


export const createProject = async(req: Request, res: Response)=>{
    
    let tempProjectId: string;
    const {userId} = req.auth();
    let isCreditDeducted = false;

    const {name='New Project' ,aspectRatio, userPrompt, productName, productDescription, targetlength= 5} 
          = req.body;

    const image : any = req.files;

    if(image.length > 2 || !productName){
        return res.status(400).json({message: 'Please upload at least  2 images'})
    }

    const user = await prisma.user.findUnique({
        where: {id: userId}
    })

    if(!user || user.credits < 5){
        return res.status(400).json({message: 'Not enough credits'})
    }else{
        //deduct 5 credits from user account
        await prisma.user.update({
            where: {id: userId},
            data: {credits: {decrement: 5}}
        }).then(()=>{isCreditDeducted = true});  

    }
    

    try {
        
        let uploadImages = await Promise.all(
            image.map(async(item: any)=>{
                let result = await cloudinary.uploader.upload(item.path, 
                    {resourse_type: 'image'});
                    return result.secure_url
                    
            })
        )

        const project = await prisma.project.create({
            data: {
                name,
                userId,
                productName,
                productDescription,
                userPrompt,
                aspectRatio,
                targetLength: parseInt(targetlength),
                uploadedImages: uploadImages,
                isGenerating: true

            }
        })

        tempProjectId = project.id;

    } catch (error: any) {
        Sentry.captureException(error);
        res.status(500).json({message:  error.message})
    }

}

export const createVideo = async(req: Request, res: Response)=>{
    try {
        
    } catch (error: any) {
        Sentry.captureException(error);
        res.status(500).json({message:  error.message})
    }

}


export const getAllPublishedProjects = async(req: Request, res: Response)=>{
    try {
        
    } catch (error: any) {
        Sentry.captureException(error);
        res.status(500).json({message:  error.message})
    }

}


export const deleteProject = async(req: Request, res: Response)=>{
    try {
        
    } catch (error: any) {
        Sentry.captureException(error);
        res.status(500).json({message:  error.message})
    }

}