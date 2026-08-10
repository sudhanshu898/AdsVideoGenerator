import { useEffect, useState } from "react"
import type { Project } from "../types"
import { dummyGenerations } from "../assets/assets"
import { Loader2Icon } from "lucide-react"
import ProjectCard from "../components/ProjectCard"
import { getApiUrl } from "../config/api"

const Community = () => {

  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)

  const fetchProjects = async () => {
    try {
      const response = await fetch(getApiUrl('/api/project/published'))
      const data = await response.json()
      if (response.ok && Array.isArray(data?.projects) && data.projects.length > 0) {
        setProjects(data.projects)
      } else {
        setProjects(dummyGenerations)
      }
    } catch (err) {
      setProjects(dummyGenerations)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProjects()
  }, [])

  return loading? (
    <div className="flex items-center justify-center min-h-screen ">
      <Loader2Icon className="size-7 animate-spin text-indigo-400"/>
    </div>
  ) : (
    <div className="min-h-screen text-white p-6 md:p-12 my-28 ">
        <div className="max-w-6xl mx-auto">
            <header className="mb-12">
              <h1 className="text-3xl md:text-4xl font-semibold mb-4">Community</h1>
              <p className="text-gray-400">See what others are creating with UGC.ai</p>
            </header>

            {/*Project list*/}
            <div className="columns-1 sm:columns-2 lg:columns-3 gap-4">
              {projects.map((project) => (
                <ProjectCard  key={project.id} gen={project} setGenerations={setProjects} forCommunity={true}/>
              ))}
            </div>
        </div>
    </div>
  )
}

export default Community