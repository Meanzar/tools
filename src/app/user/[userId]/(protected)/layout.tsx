"use client"
import { useUserStore } from "@/lib/stores/useUser"

export default function CreateLayout({ children }: { children: React.ReactNode }) {
  const userId= useUserStore((state) => state.userId)
  if (!userId) {
    return (
      <div>
        <h1>Vous êtes pas connecté</h1>
        <p>Veuillez vous connecter pour accéder à cette page.</p>
      </div>
    )
  }
  return <>{children}</>
}