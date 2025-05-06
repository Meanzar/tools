import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Rush",
  description: "Page de personnalisation de l'outil Rush",
}

export default function CreateLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}