import type { Request, Response } from 'express'
import * as Sentry from "@sentry/node"
import { prisma } from '../configs/prisma.js';
import cloudinary from '../configs/cloudinary.js';

export const createProject = async (req: Request, res: Response) => {
    const { userId } = req.auth();
    if (!userId) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    const {
        name = 'New Project',
        aspectRatio = '9:16',
        userPrompt = '',
        productName = '',
        productDescription = '',
        targetLength = '5',
    } = req.body;

    const files = req.files as Express.Multer.File[] | undefined;
    const imageFiles = Array.isArray(files) ? files : [];

    if (imageFiles.length !== 2) {
        return res.status(400).json({ message: 'Please upload exactly 2 images' });
    }

    if (!productName?.trim()) {
        return res.status(400).json({ message: 'Product name is required' });
    }

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    if (user.credits < 5) {
        return res.status(400).json({ message: 'Not enough credits' });
    }

    try {
        const uploadImages = await Promise.all(
            imageFiles.map(async (item) => {
                const result = await cloudinary.uploader.upload(item.path, {
                    resource_type: 'image',
                });
                return result.secure_url;
            })
        );

        const project = await prisma.project.create({
            data: {
                name,
                userId,
                productName,
                productDescription,
                userPrompt,
                aspectRatio,
                targetLength: Number(targetLength) || 5,
                uploadedImages: uploadImages,
                generatedImage: uploadImages[0] ?? '',
                generatedVideo: '',
                isGenerating: false,
            },
        });

        await prisma.user.update({
            where: { id: userId },
            data: { credits: { decrement: 5 } },
        });

        res.status(201).json({ project });
    } catch (error: any) {
        Sentry.captureException(error);
        res.status(500).json({ message: error.message });
    }
};

export const createVideo = async (req: Request, res: Response) => {
    try {
        const { userId } = req.auth();
        if (!userId) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        const { projectId } = req.body;
        if (!projectId) {
            return res.status(400).json({ message: 'Project ID is required' });
        }

        const project = await prisma.project.findFirst({
            where: { id: projectId, userId },
        });
        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }

        const generatedVideo = project.generatedVideo ||
            'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4';

        const updatedProject = await prisma.project.update({
            where: { id: projectId },
            data: {
                generatedImage: project.generatedImage || project.uploadedImages[0] || '',
                generatedVideo,
                isGenerating: false,
            },
        });

        res.json({ project: updatedProject });
    } catch (error: any) {
        Sentry.captureException(error);
        res.status(500).json({ message: error.message });
    }
};

export const getAllPublishedProjects = async (req: Request, res: Response) => {
    try {
        const projects = await prisma.project.findMany({
            where: { isPublished: true },
            orderBy: { createdAt: 'desc' },
        });
        res.json({ projects });
    } catch (error: any) {
        Sentry.captureException(error);
        res.status(500).json({ message: error.message });
    }
};

export const deleteProject = async (req: Request, res: Response) => {
    try {
        const { userId } = req.auth();
        if (!userId) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        const projectId = req.params.projectId as string;
        const project = await prisma.project.findFirst({
            where: { id: projectId, userId },
        });

        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }

        await prisma.project.delete({ where: { id: projectId } });
        res.status(204).send();
    } catch (error: any) {
        Sentry.captureException(error);
        res.status(500).json({ message: error.message });
    }
};