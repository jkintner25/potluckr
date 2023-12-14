'use client'
import { useRouter } from "next/navigation";
import { useState } from "react"

export default function CreatePotluckForm() {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [theme, setTheme] = useState("");

  const createEvent = async () => {
    let res = await fetch(`/api/newEvent?title=${title}&theme=${theme}`);
    let data = await res.json();
    console.log(data)
    if (data.id) {
      router.push(`/${data.id}`);
    } else {
      console.log(data.error)
    }
  };

  return (
    <div className="flex flex-col">
      <div className="my-6">
        <p className="text-xl">Give your Potluck Event a title</p>
        <input className="text-black px-2 text-lg" value={title} onChange={(e) => setTitle(e.target.value)} />
      </div>
      <div className="my-6">
        <p className="text-xl">Choose a theme (or don't!)</p>
        <input className="text-black px-2 text-lg" value={theme} onChange={(e) => setTheme(e.target.value)} />
      </div>
      <div className="flex justify-center m-6">
        <button className="px-3 py-2 bg-white rounded-lg text-black" onClick={createEvent}>Create</button>
      </div>
    </div>
  )
}