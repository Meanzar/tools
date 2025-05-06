import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Création - Tâche",
  description: "Page de création de tâche",
}

export default function CreateLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}