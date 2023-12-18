'use client'

import { useRouter } from "next/navigation"

export default function GoHome() {
  const router = useRouter();

  return (
    <button className="px-3 py-2 border rounded text-2xl" onClick={() => router.push('/')}>Go Home</button>
  )
}