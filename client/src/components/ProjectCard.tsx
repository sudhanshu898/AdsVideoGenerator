import type React from "react";
import type { Project } from "../types";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from '@clerk/react'
import { EllipsisIcon, ImageIcon, Loader2Icon, PlaySquareIcon, Share2Icon, Trash2Icon } from "lucide-react";
import { GhostButton, PrimaryButton } from "./Buttons";
import { getApiUrl } from "../config/api";

const ProjectCard = ({ gen, setGenerations, forCommunity = false }:
    { gen: Project, setGenerations: React.Dispatch<React.SetStateAction<Project[]>>, forCommunity?: boolean }) => {

    const navigate = useNavigate();
    const { getToken } = useAuth();
    const [menuOpen, setMenuOpen] = useState(false);

    const handleDelete = async (id: string) => {
        const confirmDelete = window.confirm('Are you sure you want to delete this project?');
        if (!confirmDelete) return;

        try {
            const token = await getToken();
            const response = await fetch(getApiUrl(`/api/project/${id}`), {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || 'Failed to delete project');
            }

            setGenerations((prev) => prev.filter((project) => project.id !== id));
        } catch (error: any) {
            window.alert(error.message || 'Unable to delete project.');
        }
    }

    const togglePublish = async (projectId: string) => {
        try {
            const token = await getToken();
            const response = await fetch(getApiUrl(`/api/user/publish/${projectId}`), {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message || 'Failed to update publish status');
            }

            setGenerations((prev) => prev.map((project) => project.id === projectId ? { ...project, isPublished: data.isPublished } : project));
        } catch (error: any) {
            window.alert(error.message || 'Unable to update publish status.');
        }
    }

    return (
        <div className="mb-4 break-inside-avoid">
            <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden hover:border-white/20 transition group">
                <div className={`${gen?.aspectRatio === '9:16' ? 'aspect-9/16' : 'aspect-video'} relative overflow-hidden`}>
                    {gen.generatedImage && (
                        <img src={gen.generatedImage} alt={gen.productName} className={`absolute inset-0 w-full h-full object-cover transition duration-500 ${gen.generatedVideo ? 'group-hover:opacity-0' : 'group-hover:scale-105'}`} />
                    )}

                    {gen.generatedVideo && (
                        <video src={gen.generatedVideo} muted loop playsInline className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-100 transition duration-500" onMouseEnter={(e) => e.currentTarget.play()} onMouseLeave={(e) => e.currentTarget.pause()} />
                    )}

                    {(!gen?.generatedImage && !gen?.generatedVideo) && (
                        <div className="absolute inset-0 w-full h-full flex flex-col items-center justify-center bg-black/20">
                            <Loader2Icon className="size-7 animate-spin" />
                        </div>
                    )}

                    <div className="absolute left-3 top-3 flex gap-2 items-center">
                        {gen.isGenerating && (
                            <span className="text-xs px-2 py-1 bg-yellow-600/30 rounded-full">Generating</span>
                        )}
                        {gen.isPublished && (
                            <span className="text-xs px-2 py-1 bg-yellow-600/30 rounded-full">Published</span>
                        )}
                    </div>

                    {!forCommunity && (
                        <div onMouseLeave={() => setMenuOpen(false)} className="absolute right-3 top-3 sm:opacity-0 group-hover:opacity-100 transition z-20 flex flex-col items-end">
                            <button
                                type="button"
                                onClick={() => setMenuOpen(!menuOpen)}
                                className="p-1 rounded-full bg-black/40 hover:bg-black/60 text-white backdrop-blur transition cursor-pointer"
                                aria-label="Project actions"
                            >
                                <EllipsisIcon className="size-6" />
                            </button>
                            {menuOpen && (
                                <ul className="text-xs overflow-hidden w-40 bg-black/80 backdrop-blur-md text-white border border-white/10 rounded-xl shadow-xl mt-2 py-1 z-30">
                                    {gen.generatedImage && (
                                        <a href={gen.generatedImage} download onClick={() => setMenuOpen(false)} className="flex gap-2 items-center px-4 py-2 hover:bg-white/10 cursor-pointer">
                                            <ImageIcon size={14} /> Download Image
                                        </a>
                                    )}
                                    {gen.generatedVideo && (
                                        <a href={gen.generatedVideo} download onClick={() => setMenuOpen(false)} className="flex gap-2 items-center px-4 py-2 hover:bg-white/10 cursor-pointer">
                                            <PlaySquareIcon size={14} /> Download Video
                                        </a>
                                    )}
                                    {(gen.generatedVideo || gen.generatedImage) && (
                                        <button onClick={() => { setMenuOpen(false); if (navigator.share) navigator.share({ url: gen.generatedVideo || gen.generatedImage, title: gen.productName, text: gen.productDescription }) }} className="w-full text-left flex gap-2 items-center px-4 py-2 hover:bg-white/10 cursor-pointer">
                                            <Share2Icon size={14} /> Share
                                        </button>
                                    )}
                                    <button onClick={() => { setMenuOpen(false); handleDelete(gen.id) }} className="w-full text-left flex gap-2 items-center px-4 py-2 hover:bg-red-500/20 text-red-400 cursor-pointer">
                                        <Trash2Icon size={14} /> Delete
                                    </button>
                                </ul>
                            )}
                        </div>
                    )}

                    <div className="absolute right-3 bottom-3">
                        {gen.uploadedImages[0] && <img src={gen.uploadedImages[0]} alt="product" className="w-16 h-16 object-cover rounded-full animate-float" />}
                        {gen.uploadedImages[1] && <img src={gen.uploadedImages[1]} alt="model" className="w-16 h-16 object-cover rounded-full animate-float -ml-8" style={{ animationDelay: '3s' }} />}
                    </div>
                </div>

                <div className="p-4">
                    <div className="flex items-center justify-center gap-4">
                        <div className="flex-1">
                            <h3 className="font-medium text-lg mb-1">{gen.productName}</h3>
                            <p className="text-sm text-gray-400">Created: {new Date(gen.createdAt).toLocaleString()}</p>
                            {gen.updatedAt && (
                                <p className="text-xs text-gray-500 mt-1">Updated: {new Date(gen.updatedAt).toLocaleString()}</p>
                            )}
                        </div>
                        <div className="text-right">
                            <div className="mt-2 flex flex-col items-end gap-1">
                                <span className="text-xs px-2 py-1 bg-white/5 rounded-full">Aspect: {gen.aspectRatio}</span>
                            </div>
                        </div>
                    </div>

                    {gen.productDescription && (
                        <div className="mt-3">
                            <p className="text-xs text-gray-400 mb-1">Description</p>
                            <div className="text-sm text-gray-300 bg-white/5 p-2 rounded-md wrap-break-word">
                                {gen.productDescription}
                            </div>
                        </div>
                    )}

                    {gen.userPrompt && (
                        <div className="mt-3">
                            <div className="text-xs text-gray-300">{gen.userPrompt}</div>
                        </div>
                    )}

                    {!forCommunity && (
                        <div className="mt-4 grid grid-cols-2 gap-3">
                            <GhostButton className="text-xs justify-center" onClick={() => { navigate(`/result/${gen.id}`); scrollTo(0, 0) }}>
                                View Details
                            </GhostButton>
                            <PrimaryButton onClick={() => togglePublish(gen.id)} className="rounded-md">
                                {gen.isPublished ? 'Unpublish' : 'Publish'}
                            </PrimaryButton>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default ProjectCard

