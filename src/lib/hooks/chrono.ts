"use client";

import { useEffect, useState } from "react";
import { postData, getData, putData } from "../api";
import type { Timer } from '@/lib/type';
import type { Task } from "@/models/schema";
import type { ObjectId } from '@/lib/type';

export function useChrono(
  end: Timer,
  userId?: ObjectId,
  selectedTaskIds?: string[] // ✅ tableau de tâches sélectionnées
) {
  const [isStart, setIsStart] = useState(false);              // Chrono actif ?
  const [isPause, setIsPause] = useState(false);              // Pause active ?
  const [endSound, setEndSound] = useState<HTMLAudioElement | null>(null); // Son de fin
  const [timer, setTimer] = useState<Timer>({ min: 0, second: 0, loop: end.loop });
  const [tasks, setTasks] = useState<Task[]>([]);             // Tâches de la session
  const [pomodoreTasksId, setPomodoreTasksId] = useState<ObjectId | null>(null);

  // Préparation du son à la première exécution (client-only)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setEndSound(new Audio('/alarm-sounding.mp3'));
    }
  }, []);

  // Lancement du chrono
  async function start() {
    if (end.loop === 0) {
      alert("Missing Loop");
      return;
    }
    console.log(userId)
    // Si utilisateur connecté et tâches sélectionnées, créer le rush
    if (userId && selectedTaskIds && selectedTaskIds.length > 0) {
      console.log("Selected tasks:", selectedTaskIds);
      const response = await postData(`/api/users/${userId}/rushs`, {
        isRush: true,
        loops: end.loop,
        taskIds: selectedTaskIds,
      });
      const data = response?.data
      console.log("Rush created:", response);
      if (data.insertedId) {
        setPomodoreTasksId(data.insertedId);
        const fetchedTasks = await getData(`/api/users/${userId}/rushs/${data.insertedId}`);
        const tasksData = fetchedTasks?.data
        setTasks(Array.isArray(tasksData) ? tasksData : [tasksData]);
      }
    }

    setTimer({ min: 0, second: 0, loop: end.loop });
    setIsStart(true);
  }

  // Arrêt du chrono
  async function stop() {
    setIsStart(false);
    setIsPause(false);
    setTimer({ min: 0, second: 0, loop: 0 });
  }

  // Changement d'état d'une tâche entre todo/done
  async function toggleTaskStatus(taskId: ObjectId) {
    if (!Array.isArray(tasks)) {
      console.warn("toggleTaskStatus called but tasks is not an array:", tasks);
      return;
    }

    const currentTask = tasks.find(task => task._id.toString() === taskId.toString());
    if (!currentTask) {
      console.warn("Task not found in local state:", taskId);
      return;
    }

    const nextStatus: "todo" | "done" = currentTask.status === "todo" ? "done" : "todo";

    setTasks(prev =>
      prev.map(task =>
        task._id.toString() === taskId.toString()
          ? { ...task, status: nextStatus }
          : task
      )
    );

    if (userId) {
      await putData(`/api/users/${userId}/tasks/${taskId}`, { status: nextStatus });
    }
  }

  // Moteur du chrono (boucle de temps)
  useEffect(() => {
    if (!isStart) return;

    const interval = setInterval(() => {
      setTimer(prev => {
        let newSecond = prev.second + 1;
        let newMin = prev.min;
        let newLoop = prev.loop;

        if (newSecond >= 60) {
          newSecond = 0;
          newMin += 1;
        }

        if (isPause) {
          if ((end.min >= 50 && newMin >= 10) || (end.min < 50 && newMin >= 5)) {
            newMin = 0;
            newSecond = 0;
            setIsPause(false);
            endSound?.play();
          }
        } else if (newMin >= end.min && newSecond >= end.second) {
          if (newLoop > 1) {
            newLoop -= 1;
            newMin = 0;
            newSecond = 0;
            setIsPause(true);
            endSound?.play();
          } else {
            stop();
          }
        }

        return { min: newMin, second: newSecond, loop: newLoop };
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isStart, isPause, end.min, end.second, endSound]);

  return {
    start,
    stop,
    toggleTaskStatus,
    timer,
    tasks,
    isStart,
    isPause,
    pomodoreTasksId,
  };
}
