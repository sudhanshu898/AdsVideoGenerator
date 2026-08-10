import { useEffect, useState } from "react"
import { useAuth, useClerk } from '@clerk/react'
import type { Project } from "../types"
import { Loader2Icon } from "lucide-react"
import ProjectCard from "../components/ProjectCard"
import { PrimaryButton } from "../components/Buttons"
import { getApiUrl } from "../config/api"

const MyGenerations = () => {
  const { getToken, userId } = useAuth()
  const { openSignIn } = useClerk()
  const [generations, setGenerations] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchMyGenerations = async () => {
    if (!userId) {
      setLoading(false)
      return
    }

    try {
      const token = await getToken()
      const response = await fetch(getApiUrl('/api/user/projects'), {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      const data = await response.json()
      if (!response.ok) {
        throw new Error(data?.message || 'Failed to load your generations')
      }

      setGenerations(data.projects || [])
    } catch (error: any) {
      setError(error.message || 'Unable to load your generations.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchMyGenerations()
  }, [userId])

  if (!userId) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="max-w-xl rounded-3xl bg-slate-950/80 border border-white/10 p-10 text-center text-white">
          <h2 className="text-2xl font-semibold mb-4">Sign in to see your generations</h2>
          <p className="text-sm text-gray-400 mb-6">Your saved projects will appear here after you sign in.</p>
          <PrimaryButton onClick={() => openSignIn()}>Sign in</PrimaryButton>
        </div>
      </div>
    )
  }

  return loading ? (
    <div className="flex items-center justify-center min-h-screen">
      <Loader2Icon className="size-7 animate-spin text-indigo-400" />
    </div>
  ) : (
    <div className="min-h-screen text-white p-6 md:p-12 my-28">
      <div className="max-w-6xl mx-auto">
        <header className="mb-12">
          <h1 className="text-3xl md:text-4xl font-semibold mb-4">My Generations</h1>
          <p className="text-gray-400">View and manage your AI-generated content</p>
        </header>

        {error && (
          <div className="mb-6 rounded-xl bg-red-500/10 border border-red-500/20 p-4 text-sm text-red-200">
            {error}
          </div>
        )}

        <div className="columns-1 sm:columns-2 lg:columns-3 gap-4">
          {generations.map((gen) => (
            <ProjectCard key={gen.id} gen={gen} setGenerations={setGenerations} />
          ))}
        </div>

        {generations.length === 0 && (
          <div className="text-center py-20 bg-white/5 rounded-xl border border-white/10">
            <h3 className="text-xl font-medium mb-2">No generations yet</h3>
            <p className="text-gray-400 mb-6">Start creating stunning product photos today</p>
            <PrimaryButton onClick={() => window.location.href = '/generate'}>
              Create New Generations
            </PrimaryButton>
          </div>
        )}
      </div>
    </div>
  )
}

export default MyGenerations