import Link from "next/link"
import { Card, CardContent, CardTitle, CardDescription } from "@/components/ui/card"

export default function Home() {
  return (
    <main className="min-h-screen py-16 px-6 sm:px-12 bg-background text-foreground">
      <h1 className="text-3xl sm:text-4xl font-semibold text-center mb-12">toOlS</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {/* Rush */}
        <Link href="/rush">
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="h-30 p-6">
              <CardTitle>Rush</CardTitle>
              <CardDescription>
                Une version gamifiée de Pomodoro pour améliorer ta productivité avec des tâches et des statistiques.
              </CardDescription>
            </CardContent>
          </Card>
        </Link>

        {/* Planning */}
        <Link href="/planning">
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="h-30 p-6">
              <CardTitle>Planning</CardTitle>
              <CardDescription>
                Planifie ta journée et organise tes tâches facilement. (Fonctionnalité à venir)
              </CardDescription>
            </CardContent>
          </Card>
        </Link>

        {/* Scorecard */}
        <Link href="/scorecard">
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="h-30 p-6 o-hidden">
              <CardTitle>Scorecard</CardTitle>
              <CardDescription>
                Suivi de tes progrès personnels et visualisation de tes performances. (En développement)
              </CardDescription>
            </CardContent>
          </Card>
        </Link>
      </div>
    </main>
  )
}
