"use client"
import { postData } from '@/lib/api'
import { handleArrayInput, handleInput } from '@/lib/service'
import { useParams, useRouter } from 'next/navigation'
import React from 'react'

export default function CreateTask() {
  const params = useParams()
  const router =  useRouter()
  const userId = params.userId as string
  const [title, setTitle] = React.useState<string>("")
  const [tags, setTags] = React.useState<string[]>([])

  

  const url = `/api/users/${userId}/tasks`

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const body = {
      title,
      tags,
    }
    const res = await postData(url, body)
    if (res?.ok) {
      console.log("Task created")
      router.push('/rush')
    } else {
      console.log("Error creating task")
    }
  }
  return (
    <div className="p-6 bg-white rounded-lg shadow-md max-w-md mx-auto space-y-4">
      <h2 className="text-2xl font-bold text-[#8F2412]">Nouvelle tâche</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-gray-700">Titre</label>
        <input
          type="text"
          placeholder="Ex : Implémenter le timer"
          onChange={(e) => handleInput(e.target.value, setTitle)}
          className="border border-gray-300 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-[#8F2412]"
        />
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-gray-700">Tags (séparés par des virgules)</label>
        <input
          type="text"
          placeholder="frontend, urgent, sprint-1"
          onChange={(e) => handleArrayInput(
            e.target.value.split(',').map(tag => tag.trim()).filter(Boolean),
            setTags
          )}
          className="border border-gray-300 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-[#8F2412]"
        />
      </div>

      <div className="text-sm text-gray-600">
        <strong>Titre :</strong> {title || "–"}<br />
        <strong>Tags :</strong> {tags.length ? tags.join(', ') : "–"}
      </div>
      <button
        type="submit"
        className="w-full bg-[#8F2412] text-white py-2 rounded hover:bg-[#6b1f0e]"
      >
        Créer la tâche
      </button>
      </form>
    </div>
  )
}
