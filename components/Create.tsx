'use client'
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react"

export default function CreatePotluckForm() {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [theme, setTheme] = useState("");
  const [date, setDate] = useState("");
  const [address, setAddress] = useState("");
  const [instructions, setInstructions] = useState("");
  const [formErrors, setFormErrors] = useState<string[]>([]);
  const [disabled, setDisabled] = useState(false);

  useEffect(() => {
    if (title.length && formErrors.includes("Title")) {
      setFormErrors(prev => prev.filter(a => a != "Title"));
    }
    if (date.length && formErrors.includes("Date")) {
      setFormErrors(prev => prev.filter(a => a != "Date"));
    }
    if (!formErrors.length) setDisabled(false)
  }, [title, date])

  const checkErrors = () => {
    let errors: string[] = [];
    if (title.length < 1) errors.push("Title");
    if (date.length < 1) errors.push("Date");
    return errors;
  }

  const createEvent = async () => {
    let errors = checkErrors();
    if (errors.length) {
      setFormErrors(errors)
      setDisabled(true)
      return;
    }
    let newEvent = JSON.stringify({
      title: title,
      theme: theme,
      datetime: date,
      address: address,
      instructions: instructions
    });
    let res = await fetch(`api/newEvent`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: newEvent
    });
    let data = await res.json();
    if (data.id) {
      router.push(`/${data.id}`);
    } else {
      console.log(data.error);
    };
  };

  return (
    <div className="flex flex-col justify-center min-h-[80vh]">
      <div className="rounded-lg h-full w-full px-8 md:px-16 pt-2 relative">
        <div className="flex flex-col max-w-[300px] text-lg z-20">
          <div className="my-6">
            <p className="mb-1">Give your Potluck Event a Title</p>
            <input className="text-black px-2 w-full rounded border focus:outline-none shadow-md" value={title} placeholder="Friendsgiving Feast" onChange={(e) => setTitle(e.target.value)} />
          </div>
          <div className="my-6">
            <p className="mb-1">Choose a theme (or don&apos;t!)</p>
            <input className="text-black px-2 w-full rounded border focus:outline-none shadow-md" value={theme} placeholder="Mexican, BBQ, Indian..." onChange={(e) => setTheme(e.target.value)} />
          </div>
          <div className="my-6">
            <p className="mb-1">When do we eat?</p>
            <input type="datetime-local" className="text-black px-2 w-full rounded border focus:outline-none shadow-md" value={date} onChange={(e) => setDate(e.target.value)} />
          </div>
          <div className="my-6">
            <p className="mb-1">Where do we eat?</p>
            <input className="text-black px-2 w-full rounded border focus:outline-none shadow-md" value={address} placeholder="The Smith Residence" onChange={(e) => setAddress(e.target.value)} />
          </div>
          <div className="my-6">
            <p className="mb-1">Special instructions for guests?</p>
            <input className="text-black px-2 w-full rounded border focus:outline-none shadow-md" value={instructions} placeholder="parking, food restrictions..." onChange={(e) => setInstructions(e.target.value)} />
          </div>
          {formErrors.length ? (
            <div className="w-full flex justify-center">
              <p className="text-yellow-400">
                <i>
                  You need a {formErrors[0]}{formErrors.length > 1 ? ` and a ${formErrors[1]}!` : "!"}
                </i>
              </p>
            </div>
          ) : null}
          <div className="flex justify-center m-6">
            <button className="px-3 py-2 bg-white rounded-lg text-black border shadow-md disabled:opacity-50" onClick={createEvent} disabled={disabled}>Create</button>
          </div>
        </div>
        <div className="absolute top-0 left-0 -z-10 h-full w-full rounded-lg px-8 md:px-16 pt-2 bg-stone-100 flex items-center opacity-40">
        </div>
      </div>
    </div>
  )
}
