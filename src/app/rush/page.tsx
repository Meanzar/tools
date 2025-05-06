"use client";

import React, { useEffect, useState } from 'react';
import { useChrono } from '@/lib/hooks/chrono';
import type { Timer } from '@/lib/type';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@radix-ui/react-label';
import { Card, CardContent, CardTitle, CardFooter } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { getData } from '@/lib/api';
import Link from 'next/link';
import { useUserStore } from '@/lib/stores/useUser';

export default function PomodorePage() {
  const [end, setEnd] = useState<Timer>({
    min: 25,
    second: 0,
    loop: 2,
  });

  const [fullTasks, setFullTasks] = useState<{ _id: string; title: string; tags: string[], status: string }[]>([]);
  const [selectedTasks, setSelectedTasks] = useState<string[]>([]);
  const userId = useUserStore((state) => state.userId)
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setIsReady(true)
    }
  }, [])

  useEffect(() => {
    if (!isReady || !userId) return;
    async function fetchTasks() {
      if (userId) {
      const taskIds = await getData(`/api/users/${userId}/tasks`);
      const tasksData = await Promise.all(
        taskIds?.data.map(async (task: { _id: string }) => {
          const data = await getData(`/api/users/${userId}/tasks/${task._id}`);
          return { _id: task._id, title: data?.data.title, tags: data?.data.tags, status: data?.data.status };
        })
      );
      setFullTasks(tasksData);
    }
  }
    fetchTasks();
  }, [userId, isReady]);

  const chrono = useChrono(end, userId?.toString(), selectedTasks);
  const toggleSelection = (taskIds: string[]) => {
    setSelectedTasks((prev) =>(
      console.log(prev, taskIds[0]),  
      prev.includes(taskIds[0]) ? prev.filter((id) => id !== taskIds[0]) : [...prev, taskIds[0]])
    );
  };
  const pad = (value: number) => value.toString().padStart(2, '0');

  const remainingTime = !chrono.isPause
    ? `${pad(Math.max(0, end.min - chrono.timer.min - (chrono.timer.second >= end.second ? 1 : 0)))} min ${pad(Math.max(0, (60 + end.second - chrono.timer.second) % 60))} s`
    : `${pad(end.min >= 50 ? Math.max(0, 10 - chrono.timer.min) : Math.max(0, 5 - chrono.timer.min))} min  ${pad(Math.max(0, (60 + end.second - chrono.timer.second) % 60))} s`;

  useEffect(() => {
  setSelectedTasks(chrono.tasks);
}, [chrono.tasks]);
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-10">
      <div className="flex w-full max-w-6xl bg-white rounded-lg shadow-lg overflow-hidden">
        {/* Left Panel - Form or Tasks based on chrono */}
        <div className="w-1/2 p-8 bg-red-100 flex flex-col justify-between">
          {!chrono.isStart ? (
            <>
              <div>
                <h1 className="text-4xl font-bold text-[#8F2412] mb-6">Configuration</h1>
                <h2 className="text-lg font-semibold mb-4">Durée d'une séance</h2>
                <RadioGroup
                  defaultValue="24"
                  onValueChange={(value) => setEnd({ ...end, min: parseInt(value) })}
                  className="flex flex-col gap-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value={"24"} id="option-one" className="border-black border-2" />
                    <Label htmlFor="option-one" className="text-[#8F2412]">25 mins</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value={"49"} id="option-two" className="border-black border-2" />
                    <Label htmlFor="option-two" className="text-[#8F2412]">50 mins</Label>
                  </div>
                </RadioGroup>

                <Separator className="bg-black my-6" />

                <h2 className="text-lg font-semibold mb-4">Nombre de séances</h2>
                <select
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                    setEnd({ ...end, loop: parseInt(e.target.value) })
                  }
                  className="w-full border-4 border-black bg-white text-black text-sm px-4 py-2 rounded hover:bg-gray-200"
                >
                  <option value={0}>Choisir nombre de boucle</option>
                  <option value={1}>1</option>
                  <option value={2}>2</option>
                  <option value={3}>3</option>
                </select>
              </div>

              <div className="mt-10">
                <Button
                  className="border-4 text-2xl border-black bg-white px-6 py-3 text-black rounded hover:bg-gray-200 w-full"
                  onClick={chrono.start}
                >
                  Start Timer
                </Button>
              </div>
            </>
          ) : (
            <>
              <h1 className="text-3xl font-bold text-[#8F2412] mb-6">Mes tâches</h1>
              {["todo", "doing", "done"].map((status) => {
                const filtered = chrono.tasks?.filter((t) => t.status === status);
                if (filtered.length === 0) return null;

                return (
                  <div key={status} className="mb-6">
                    <h2 className="text-lg font-semibold text-gray-800 capitalize mb-2">
                      {status === "todo" ? "À faire" : status === "doing" ? "En cours" : "Terminées"}
                    </h2>
                    <ul className="flex flex-col gap-2">
                      {filtered.map((task) => (
                        <li key={task._id.toString()} className="flex items-center justify-between border p-2 rounded bg-white">
                          <input
                            type="checkbox"
                            checked={task.status === "done"}
                            onChange={() => chrono.toggleTaskStatus(task._id.toString())}
                            className="w-4 h-4 accent-[#8F2412]"
                          />
                          <span className={`flex-1 mx-3 text-sm ${task.status === 'done' ? 'line-through text-green-600' : 'text-gray-800'}`}>
                            {task.title}
                          </span>
                          <div className="flex gap-1">
                            {task.tags.map((tag, i) => (
                              <span key={i} className="text-xs text-gray-600 bg-gray-200 rounded px-2 py-0.5">#{tag}</span>
                            ))}
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              })}
              <Button
                className="border-4 text-2xl border-black bg-white px-6 py-3 text-black rounded hover:bg-gray-200 w-full mt-auto"
                onClick={chrono.stop}
              >
                Stop Timer
              </Button>
            </>
          )}
      </div>
        {/* Right Panel - Timer + Tasks Display */}
        <div className="w-1/2 p-8 flex flex-col gap-6">
          {/* Timer Card */}
          {chrono.isStart && (
            <Card className="w-full">
              <CardTitle className="text-2xl font-bold text-center pt-4">
                {chrono.isPause ? 'Pause' : 'Travail en cours'}
              </CardTitle>
              <CardContent className="flex flex-col items-center gap-4 py-6">
                <p className="text-xl">
                  Temps écoulé : {chrono.timer.min} min {chrono.timer.second} s
                </p>
                <Progress
                  className="w-full h-3"
                  value={((chrono.timer.min * 60 + chrono.timer.second) / (end.min * 60 + end.second)) * 100}
                />
                <p className="text-xl">Temps restant : {remainingTime}</p>
              </CardContent>
              <CardFooter className="flex justify-center">
                <p className="text-lg">Boucles restantes : {chrono.timer.loop}</p>
                <Separator className="bg-black mx-4 h-10" orientation="vertical" />
                <p className="text-lg">Tâches accomplis : {chrono.tasks.filter(task => task.status === "done").length}</p>
              </CardFooter>
            </Card>
          )}

          {/* Tasks List */}
          {!chrono.isStart && userId && (
            <div className="mt-6">
              <h1 className="text-2xl font-bold text-[#8F2412] mb-6 border-b pb-2 border-[#8F2412]">Tâches Restantes</h1>
              <Link href={`/user/${userId}/tasks/create`}>
                <Button className=' border-4 border-black bg-white text-black text-sm px-4 py-2 rounded hover:bg-gray-200'>
                  Créer de nouvelle tâches
                </Button>
              </Link>
              {fullTasks.length > 0 ? (
                (() => {
                  const tasks = fullTasks.filter(task => task.status === "todo" || task.status === "doing");
                  if (tasks.length === 0) {
                    return (
                      <div className="p-4 bg-yellow-50 text-yellow-800 border border-yellow-200 rounded">
                        <h2>Aucune tâche restante.</h2>
                        <Button className='border-4 border-black bg-white text-black text-sm px-4 py-2 rounded hover:bg-gray-200'>
                        <Link href={`/user/${userId}/tasks/create`}>Créer de nouvelle tâches</Link>
                        </Button>
                      </div>
                    );
                  }

                  return (
                    <ul className="flex flex-col gap-4">
                      {tasks.map((task) => (
                        <li
                          key={task._id.toString()}
                          className="flex flex-col gap-2 border rounded-lg p-4 bg-white shadow-sm hover:shadow transition"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <input
                                type="checkbox"
                                checked={selectedTasks.includes(task._id)}
                                onChange={() => toggleSelection([task._id])}
                                className="w-5 h-5 accent-[#8F2412]"
                              />
                              <span className="text-lg font-semibold text-[#8F2412]">{task.title}</span>
                            </div>
                            <span className="text-sm font-medium text-gray-500">{task.status}</span>
                          </div>

                          <div className="flex flex-wrap gap-2 mt-2">
                            {task.tags.map((tag, i) => (
                              <span
                                key={i}
                                className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-full border border-gray-300"
                              >
                                #{tag}
                              </span>
                            ))}
                          </div>
                        </li>
                      ))}
                    </ul>
                  );
                })()
              ) : (
                <div className="p-4 bg-gray-100 text-gray-600 border border-gray-300 rounded">
                  Aucune tâche pour l'instant.
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
