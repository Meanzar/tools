'use client'

import { useRouter } from 'next/navigation'
import React, { useState } from 'react'
import { handleUser } from '@/lib/api'
import { handleInput } from '@/lib/service'
import { useUserStore } from '@/lib/stores/useUser'
import Link from 'next/link'

export default function Register() {
  const [email, setEmail] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const router = useRouter()

  const url = `/api/auth/login`

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const body = { email, password}

    const res = await handleUser(url, body)
    const data =  await res?.data
    if (res?.ok) {
        useUserStore.getState().setToken(data.token)
        router.push("/rush")
    } else {
      console.error("Erreur lors de la connexion")
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <form onSubmit={handleSubmit} className="w-full max-w-md bg-white p-8 rounded-lg shadow-md space-y-4">
        <h1 className="text-2xl font-bold text-center text-[#8F2412] mb-4">Se connecter</h1>

        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-gray-700">Email</label>
          <input
            type="email"
            placeholder="exemple@mail.com"
            onChange={(e) => handleInput(e.target.value, setEmail)}
            className="border border-gray-300 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-[#8F2412]"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-gray-700">Mot de passe</label>
          <input
            type="password"
            placeholder="••••••••"
            onChange={(e) => handleInput(e.target.value, setPassword)}
            className="border border-gray-300 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-[#8F2412]"
          />
        </div>

        <div className="text-sm text-gray-600">
          <strong>Email :</strong> {email || "–"}
        </div>

        <button
          type="submit"
          className="w-full bg-[#8F2412] text-white py-2 rounded hover:bg-[#6b1f0e]"
        >
        Se connecter
        </button>
        <Link href={'/auth/register'}> Créer un compte</Link>
      </form>
    </div>
  )
}
