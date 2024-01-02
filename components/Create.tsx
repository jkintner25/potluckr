'use client'
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import dayjs from "dayjs";
import PreviousMap from "postcss/lib/previous-map";

interface FormErrors {
  longTitle: string | null;
  noTitle: string | null;
  noDate: string | null;
  pastDate: string | null;
  longTheme: string | null;
  longAddress: string | null;
  longInstructions: string | null;
}

let initialFormErrors: FormErrors = {
  longTitle: null,
  noTitle: null,
  noDate: null,
  pastDate: null,
  longTheme: null,
  longAddress: null,
  longInstructions: null
}

export default function CreatePotluckForm() {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [theme, setTheme] = useState("");
  const [date, setDate] = useState("");
  const [address, setAddress] = useState("");
  const [instructions, setInstructions] = useState("");
  const [formErrors, setFormErrors] = useState<FormErrors>(initialFormErrors);
  const [disabled, setDisabled] = useState(false);

  useEffect(() => {
    if (formErrors.noTitle && title.length) {
      setFormErrors(prev => ({ ...prev, noTitle: null }));
      setDisabled(false);
    }
    if (formErrors.longTitle && title.length < 21) {
      setFormErrors(prev => ({ ...prev, longTitle: null }));
      setDisabled(false);
    }
    if (formErrors.noDate && date.length) {
      setFormErrors(prev => ({ ...prev, noDate: null }));
      setDisabled(false);
    }
    if (formErrors.pastDate && dayjs(date).isAfter(dayjs())) {
      setFormErrors(prev => ({ ...prev, pastDate: null }));
      setDisabled(false);
    }
    if (formErrors.longTheme && theme.length < 21) {
      setFormErrors(prev => ({ ...prev, longTheme: null }));
      setDisabled(false);
    }
    if (formErrors.longAddress && address.length < 41) {
      setFormErrors(prev => ({ ...prev, longAddress: null }));
      setDisabled(false);
    }
    if (formErrors.longInstructions && instructions.length < 41) {
      setFormErrors(prev => ({ ...prev, longInstructions: null }))
      setDisabled(false);
    }
  }, [title, date]);

  const checkErrors = () => {
    let errors: boolean = false;
    if (title.length < 1) {
      setFormErrors(prev => ({ ...prev, noTitle: 'Title needed' }));
      errors = true;
    }
    if (title.length > 20) {
      setFormErrors(prev => ({ ...prev, longTitle: 'Title is too long' }));
      errors = true;
    }
    if (date.length < 1) {
      setFormErrors(prev => ({ ...prev, noDate: 'Date & time needed' }));
      errors = true;
    }
    if (dayjs(date).isBefore(dayjs())) {
      setFormErrors(prev => ({ ...prev, pastDate: 'Date must be in the future' }));
      errors = true;
    }
    if (theme.length > 20) {
      setFormErrors(prev => ({ ...prev, longTheme: 'Theme is too long' }));
      errors = true;
    }
    if (address.length > 40) {
      setFormErrors(prev => ({ ...prev, longAddress: 'Address is too long' }));
      errors = true;
    }
    if (instructions.length > 40) {
      setFormErrors(prev => ({ ...prev, longInstructions: 'Instructions are too long' }));
      errors = true;
    }
    return errors;
  }

  const createEvent = async () => {
    let errors = checkErrors();
    if (errors) {
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
      <div className="rounded-lg h-full w-full px-8 md:px-16 pt-2 relative bg-stone-800">
        <div className="flex flex-col max-w-[300px] px-5 text-md z-20">
          <div className="my-6">
            <p className="mb-1">Give your Potluck Event a Title</p>
            <input className="text-black px-2 w-full rounded border focus:outline-none shadow-md" value={title} placeholder="Friendsgiving Feast" onChange={(e) => setTitle(e.target.value.replace(/\s{2,}/g,' '))} />
            {formErrors.noTitle ? <p className="text-yellow-500 w-full absolute italic">{formErrors.noTitle}</p> : null}
            {formErrors.longTitle ? <p className="text-yellow-500 w-full absolute italic">{formErrors.longTitle}</p> : null}
          </div>
          <div className="my-6">
            <p className="mb-1">When do we eat?</p>
            <input type="datetime-local" className="text-black px-2 w-full rounded border focus:outline-none shadow-md" value={date} onChange={(e) => setDate(e.target.value)} />
            {formErrors.noDate ? <p className="text-yellow-500 w-full absolute italic">{formErrors.noDate}</p> : null}
            {formErrors.pastDate ? <p className="text-yellow-500 w-full absolute italic">{formErrors.pastDate}</p> : null}
          </div>
          <div className="my-6">
            <p className="mb-1">Choose a theme (or don&apos;t!)</p>
            <input className="text-black px-2 w-full rounded border focus:outline-none shadow-md" value={theme} placeholder="Mexican, BBQ, Indian..." onChange={(e) => setTheme(e.target.value.replace(/\s{2,}/g,' '))} />
            {formErrors.longTheme ? <p className="text-yellow-500 w-full absolute italic">{formErrors.longTheme}</p> : null}
          </div>
          <div className="my-6">
            <p className="mb-1">Where do we eat?</p>
            <input className="text-black px-2 w-full rounded border focus:outline-none shadow-md" value={address} placeholder="The Smith Residence" onChange={(e) => setAddress(e.target.value.replace(/\s{2,}/g,' '))} />
            {formErrors.longAddress ? <p className="text-yellow-500 w-full absolute italic">{formErrors.longAddress}</p> : null}
          </div>
          <div className="my-6">
            <p className="mb-1">Special instructions for guests?</p>
            <input className="text-black px-2 w-full rounded border focus:outline-none shadow-md" value={instructions} placeholder="parking, food restrictions..." onChange={(e) => setInstructions(e.target.value.replace(/\s{2,}/g,' '))} />
            {formErrors.longInstructions ? <p className="text-yellow-500 w-full absolute italic">{formErrors.longInstructions}</p> : null}
          </div>
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
