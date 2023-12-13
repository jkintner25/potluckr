'use client'
import { useState } from "react"

export default function CreatePotluckForm() {
  const [name, setName] = useState("")

  return (
        <div className="">
          <p className="">Give your Potluck a name</p>
          <input className="" value={name} onChange={(e)=>setName(e.target.value)} />
        </div>
    )
}