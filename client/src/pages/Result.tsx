import { useEffect, useState } from "react"
import { useParams, Link } from "react-router-dom"
import { useAuth, useClerk } from '@clerk/react'
import type { Project } from "../types"
import { ImageIcon, Loader2Icon, RefreshCwIcon, SparkleIcon, VideoIcon } from "lucide-react"
import { GhostButton, PrimaryButton } from "../components/Buttons"
import { getApiUrl } from "../config/api"

const Result = () => {
  const { projectId } = useParams();
  const { getToken, userId } = useAuth();
  const { openSignIn } = useClerk();

  const [project, setProjectData] = useState<Project | null>(null)
  const [loading, setLoading] = useState(true)
  const [isGenerating, setIsGenerating] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchProjectData = async () => {
    if (!projectId) {
      setError('Project ID is missing.')
      setLoading(false)
      return
    }

    try {
      const token = await getToken()
      const response = await fetch(getApiUrl(`/api/user/projects/${projectId}`), {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.status === 401) {
        setError('Please sign in to view this result.')
        return
      }

      const data = await response.json()
      if (!response.ok) {
        throw new Error(data?.message || 'Failed to load project')
      }

      setProjectData(data.project)
    } catch (error: any) {
      setError(error.message || 'Unable to load project result.')
    } finally {
      setLoading(false)
    }
  }

  const handleGenerateVideo = async () => {
    if (!projectId) return
    setIsGenerating(true)
    setError(null)

    try {
      const token = await getToken()
      const response = await fetch(getApiUrl('/api/project/video'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ projectId }),
      })

      const data = await response.json()
      if (!response.ok) {
        throw new Error(data?.message || 'Unable to generate video')
      }

      setProjectData(data.project)
    } catch (error: any) {
      setError(error.message || 'Video generation failed.')
    } finally {
      setIsGenerating(false)
    }
  }

  useEffect(() => {
    if (userId) {
      fetchProjectData()
    } else {
      setLoading(false)
    }
  }, [projectId, userId])

  if (!userId) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="max-w-xl rounded-3xl bg-slate-950/80 border border-white/10 p-10 text-center text-white">
          <h2 className="text-2xl font-semibold mb-4">Please sign in to view your generation</h2>
          <p className="text-sm text-gray-400 mb-6">You need to be authenticated to load the project result.</p>
          <PrimaryButton onClick={() => openSignIn()}>Sign in</PrimaryButton>
        </div>
      </div>
    )
  }

  return loading ? (
    <div className="h-screen w-full flex justify-center items-center">
      <Loader2Icon className="animate-spin text-indigo-500 size-9" />
    </div>
  ) : (
    <div className="min-h-screen text-white p-6 md:p-12 mt-20">
      <div className="max-w-6xl mx-auto">
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-2xl md:text-3xl font-medium">Generation Result</h1>
          <Link to="/generate" className="btn-secondary text-sm flex items-center gap-2">
            <RefreshCwIcon className="w-4 h-4" />
            <p className="max-sm:hidden">New Generation</p>
          </Link>
        </header>

        {error && (
          <div className="mb-6 rounded-xl bg-red-500/10 border border-red-500/20 p-4 text-sm text-red-200">
            {error}
          </div>
        )}

        {!project ? (
          <div className="rounded-3xl bg-white/5 border border-white/10 p-10 text-center">
            <p className="text-gray-300">No project result available.</p>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <div className="glass-panel inline-block p-2 rounded-2xl">
                <div className={`${project.aspectRatio === '9:16' ? 'aspect-9/16' : 'aspect-video'} sm:max-h-200 rounded-xl bg-gray-900 overflow-hidden relative`}>
                  {project.generatedVideo ? (
                    <video src={project.generatedVideo} controls autoPlay loop className="w-full h-full object-cover"></video>
                  ) : (
                    <img src={project.generatedImage} alt="Generated Result" className="w-full h-full object-cover" />
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="glass-panel p-6 rounded-2xl">
                <h3 className="text-xl font-semibold mb-4">Actions</h3>
                <div className="flex flex-col gap-3">
                  <a href={project.generatedImage} download>
                    <GhostButton disabled={!project.generatedImage} className="w-full justify-center rounded-md py-3 disabled:opacity-50 disabled:cursor-not-allowed">
                      <ImageIcon className="size-4.5" />
                      Download Image
                    </GhostButton>
                  </a>
                  <a href={project.generatedVideo} download>
                    <GhostButton disabled={!project.generatedVideo} className="w-full justify-center rounded-md py-3 disabled:opacity-50 disabled:cursor-not-allowed">
                      <VideoIcon className="size-4.5" />
                      Download Video
                    </GhostButton>
                  </a>
                </div>
              </div>

              <div className="glass-panel p-6 rounded-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                  <VideoIcon className="size-24" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Video Magic</h3>
                <p className="text-gray-400 text-sm mb-6">Turn this static image into a dynamic asset for social media.</p>
                {!project.generatedVideo ? (
                  <PrimaryButton onClick={handleGenerateVideo} disabled={isGenerating} className="w-full">
                    {isGenerating ? 'Generating Video...' : <><SparkleIcon className="size-4" /> Generated Video</>}
                  </PrimaryButton>
                ) : (
                  <div className="p-3 bg-green-500/10 border border-green-500/20 rounded-xl text-green-400 text-center text-sm font-medium">
                    Video Generated Successfully!
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Result