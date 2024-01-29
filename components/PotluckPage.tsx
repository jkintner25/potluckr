'use client'
import { useEffect, useState } from "react"
import { Event, DishEntry } from "./types";
import dayjs from "dayjs";
import { dishTypes } from "./utils";
import { useRouter } from "next/navigation";

export default function PotluckPage({ id }: { id: string }) {
  const router = useRouter();
  const [eventData, setEventData] = useState<Event>({
    _id: '',
    title: '',
    datetime: ''
  });
  const [eventError, setEventError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true)
  const [newDishType, setNewDishType] = useState<string>("Main");
  const [newDishName, setNewDishName] = useState<string>("");
  const [newDishPerson, setNewDishPerson] = useState<string>("");
  const [formErrors, setFormErrors] = useState<string[]>([]);
  const [disabled, setDisabled] = useState(false);
  const [loop, setLoop] = useState(false);

  const getEvent = async () => {
    let response = await fetch(`api/${id}`);
    if (response.ok) {
      let res = await response.json();
      let { data } = res;
      setEventData(data)
    } else {
      router.push("/not-found")
    }
  };

  useEffect(() => {
    if (!loop) {
      let timer = setTimeout(() => {
        setLoop(!loop)
      }, 6000);
      return () => clearTimeout(timer)
    } else {
      let timer = setTimeout(() => {
        setLoop(!loop)
      }, 500);
      return () => clearTimeout(timer)
    }
  }, [loop])

  useEffect(() => {
    setLoading(true)
    getEvent();
    let loaded = setTimeout(() => {
      setLoading(false)
    }, 1500)
    return () => clearTimeout(loaded)
  }, [])

  useEffect(() => {
    if (newDishName.length && formErrors.includes("Dish")) {
      setFormErrors(prev => prev.filter(a => a != "Dish"));
    }
    if (newDishPerson.length && formErrors.includes("Name")) {
      setFormErrors(prev => prev.filter(a => a != "Name"));
    }
  }, [newDishName, newDishPerson])

  useEffect(() => {
    if (!formErrors.length) setDisabled(false)
  }, [formErrors])

  const checkErrors = () => {
    let errors: string[] = [];
    if (newDishName.length < 1) errors.push("Dish");
    if (newDishPerson.length < 1) errors.push("Name");
    return errors;
  };

  useEffect(()=>{
    console.log(eventData)
  }, [eventData])

  const submitNewDish = async () => {
    let myErrors = checkErrors();
    if (myErrors.length) {
      setFormErrors(myErrors)
      setDisabled(true)
      return;
    }
    let dishType: string = '';
    if (newDishType === "Main") {
      dishType = "mains"
    } else if (newDishType === "Side") {
      dishType = "sides"
    } else if (newDishType === "Dessert") {
      dishType = "desserts"
    } else if (newDishType === "Drink") {
      dishType = "drinks"
    } else if (newDishType === "Other") {
      dishType = "misc"
    }
    let newDish = JSON.stringify({
      type: dishType,
      dish: newDishName,
      name: newDishPerson
    });
    let res = await fetch(`api/${id}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: newDish
    });
    if (res.ok) {
      // let {dish, name, type}: DishEntry = JSON.parse(newDish)
      // if (type === 'mains') {
        // let updatedEvent: Event = { ...eventData, [type]: [...eventData[type], { dish: dish, name: name }]};
        // let updatedEvent = eventData
        // updatedEvent.mains.push({ dish: dish, name: name })
        // setEventData(updatedEvent)
      // }
      getEvent()
      setNewDishName('')
    };
  }

  const deleteDish = async (dish: DishEntry) => {
    let res = await fetch(`api/${id}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dish)
    });
    let data = await res.json();
    if (res.ok) getEvent();
  }

  const updateDishName = (value: string) => {
    if (!newDishName.length && value === ' ') return;
    if (value.length > 20) return;
    else setNewDishName(value.replace(/\s{2,}/g, ' '))
  }

  const updateDishPerson = (value: string) => {
    if (!newDishPerson.length && value === ' ') return;
    if (value.length > 20) return;
    else setNewDishPerson(value.replace(/\s{2,}/g, ' '))
  }

  const confirmDelete = (obj: { name: string, dish: string, type: string }) => {
    deleteDish({ name: obj.name, dish: obj.dish, type: obj.type })
  }

  return (
    <div className="w-full flex flex-col items-center">
      {loading ? (
        <div className="w-screen h-[50vh] flex justify-center items-center">
          <p className="text-4xl">LOADING...</p>
        </div>
      ) : (
        <>
          {eventData !== null ? (
            <>
              <p className="text-3xl mb-4">{eventData.title}</p>
              <p className="text-sm">{dayjs(eventData.datetime).format('dddd M/D/YY h:mma')}</p>
              {eventData?.address ? (
                <p className="text-sm md:text-md">Venue: <i>{eventData.address}</i></p>
              ) : null}
              {eventData?.theme ? (
                <p className="text-sm md:text-md">Theme: <i>{eventData.theme}</i></p>
              ) : null}
              {eventData?.instructions ? (
                <p className="text-sm md:text-md mt-4">*Instructions: <i>{eventData.instructions}</i></p>
              ) : null}
            </>
          ) : null}
          {eventError !== null ? (
            <p className="">{eventError}</p>
          ) : null}
          <div className="w-screen max-w-[700px] flex flex-col px-4 mt-4">
            <p className="text-xl mb-2">
              Menu
            </p>
            <table className="w-full">
              <thead className="">
                <tr className="flex font-bold">
                  <td className="basis-1/6 border-b">Type</td>
                  <td className="basis-2/6 border-b">Dish</td>
                  <td className="basis-2/6 border-b">Name</td>
                  <td className="basis-1/6 border-b">Delete</td>
                </tr>
              </thead>
              <tbody>
                {eventData?.mains ? (
                  eventData.mains.map((obj) => {
                    return <tr key={obj.name + obj.dish} className="flex my-1">
                      <td className="basis-1/6 border-b">Main</td>
                      <td className="basis-2/6 border-b">{obj.dish}</td>
                      <td className="basis-2/6 border-b">{obj.name}</td>
                      <td className="basis-1/6 border-b flex justify-center">
                        <div className="flex justify-center items-center">
                          <button onClick={() => deleteDish({ name: obj.name, dish: obj.dish, type: "mains" })} className="px-2 rounded-lg text-black border border-stone-50 bg-stone-50">x</button>
                        </div>
                      </td>
                    </tr>
                  })
                ) : null}
                {eventData?.sides ? (
                  eventData.sides.map((obj) => {
                    return <tr key={obj.name + obj.dish} className="flex my-1">
                      <td className="basis-1/6 border-b">Side</td>
                      <td className="basis-2/6 border-b">{obj.dish}</td>
                      <td className="basis-2/6 border-b">{obj.name}</td>
                      <td className="basis-1/6 border-b flex justify-center">
                        <div className="flex justify-center items-center">
                          <button onClick={() => deleteDish({ name: obj.name, dish: obj.dish, type: "sides" })} className="px-2 rounded-lg text-black border border-stone-50 bg-stone-50">x</button>
                        </div>
                      </td>
                    </tr>
                  })
                ) : null}
                {eventData?.desserts ? (
                  eventData.desserts.map((obj) => {
                    return <tr key={obj.name + obj.dish} className="flex my-1">
                      <td className="basis-1/6 border-b">Dessert</td>
                      <td className="basis-2/6 border-b">{obj.dish}</td>
                      <td className="basis-2/6 border-b">{obj.name}</td>
                      <td className="basis-1/6 border-b flex justify-center">
                        <div className="flex justify-center items-center">
                          <button onClick={() => deleteDish({ name: obj.name, dish: obj.dish, type: "desserts" })} className="px-2 rounded-lg text-black border border-stone-50 bg-stone-50">x</button>
                        </div>
                      </td>
                    </tr>
                  })
                ) : null}
                {eventData?.drinks ? (
                  eventData.drinks.map((obj) => {
                    return <tr key={obj.name + obj.dish} className="flex my-1">
                      <td className="basis-1/6 border-b">Drink</td>
                      <td className="basis-2/6 border-b">{obj.dish}</td>
                      <td className="basis-2/6 border-b">{obj.name}</td>
                      <td className="basis-1/6 border-b flex justify-center">
                        <div className="flex justify-center items-center">
                          <button onClick={() => deleteDish({ name: obj.name, dish: obj.dish, type: "drinks" })} className="px-2 rounded-lg text-black border border-stone-50 bg-stone-50">x</button>
                        </div>
                      </td>
                    </tr>
                  })
                ) : null}
                {eventData?.misc ? (
                  eventData.misc.map((obj) => {
                    return <tr key={obj.name + obj.dish} className="flex my-1">
                      <td className="basis-1/6 border-b">Other</td>
                      <td className="basis-2/6 border-b">{obj.dish}</td>
                      <td className="basis-2/6 border-b">{obj.name}</td>
                      <td className="basis-1/6 border-b flex justify-center">
                        <div className="flex justify-center items-center">
                          <button onClick={() => deleteDish({ name: obj.name, dish: obj.dish, type: "misc" })} className="px-2 rounded-lg text-black border border-stone-50 bg-stone-50">x</button>
                        </div>
                      </td>
                    </tr>
                  })
                ) : null}
              </tbody>
            </table>
            <div className="mt-12 flex flex-col w-full items-center md:min-w-[600px]">
              <p className="text-2xl mb-4">What are you bringing?</p>
              <div className="flex flex-col items-center w-full px-2">
                <div className="flex text-lg my-1 w-11/12">
                  <label className="w-3/12">Type</label>
                  <select className="rounded text-black w-9/12" value={newDishType} onChange={(e) => setNewDishType(e.target.value)}>
                    {dishTypes.map(type => {
                      return <option key={type} value={type} className="text-black">{type}</option>
                    })}
                  </select>
                </div>
                <div className="flex text-lg my-1 w-11/12">
                  <label className="w-3/12">Dish</label>
                  <input value={newDishName} onChange={(e) => updateDishName(e.target.value)} className="rounded w-9/12 pl-2 text-black" />
                </div>
                <div className="flex text-lg my-1 w-11/12">
                  <label className="w-3/12">Name</label>
                  <input value={newDishPerson} onChange={(e) => updateDishPerson(e.target.value)} className="rounded w-9/12 pl-2 text-black" />
                </div>
                {formErrors.length ? (
                  <div className="w-full flex justify-center mt-2">
                    <p className="text-yellow-400">
                      <i>
                        You need a {formErrors[0]}{formErrors.length > 1 ? ` and a ${formErrors[1]}!` : "!"}
                      </i>
                    </p>
                  </div>
                ) : null}
                <div className="w-full flex justify-center">
                  <button onClick={submitNewDish} className={`px-4 py-2 bg-white rounded-lg text-black border shadow-md disabled:opacity-50 ${disabled ? "mt-4" : "mt-12"}`} disabled={disabled}>Submit</button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
};
