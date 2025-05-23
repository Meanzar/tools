"use client"
import { getData } from '@/lib/api'
import { useUserStore } from '@/lib/stores/useUser'
import { Task } from '@/models/schema'
import React, { useEffect } from 'react'

export default function PlanningPage() {
  const [tasks, setTasks] = React.useState<Array<Task>>([])
  const url = process.env.NEXT_PUBLIC_API_URL
  const userId = useUserStore((state) => state.userId)

  useEffect(() => {
     async function fetchData() { 
      await getData(`${url}/users/${userId}/tasks`).then( (data) => {setTasks(data?.data)})
    }
    fetchData()
  }, [userId, url])
  console.log(tasks)
  return (
    <div>
      page
    { tasks ?  tasks.map((task) => (
      <div key={task._id.toString()}>
        <h1>{task.title}</h1>
        <p>{task.status}</p>
        <p>{task.tags.join(', ')}</p>
        <p>{task.createdAt.toString()}</p>
      </div>
      
      
    ))
    :
    <div>
       <p>Aucune tâche</p>
    </div>
  }
    </div>
  )
}