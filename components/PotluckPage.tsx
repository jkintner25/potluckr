'use client'
import { useEffect, useState } from "react"
import { Event, DishEntry } from "./types";
import dayjs from "dayjs";
import { dishTypes } from "./utils";
import { useRouter } from "next/navigation";

export default function PotluckPage({ id }: { id: string }) {
  const router = useRouter();
  const [eventData, setEventData] = useState<Event | null>(null);
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
    let res = await response.json();
    if (response.ok) {
      let { data } = res;
      if (data !== null) {
        setEventData(data)
      } else {
        router.push("/not-found")
      }
    } else {
      setEventError(res.error)
      console.log(res)
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

  const submitNewDish = async () => {
    let myErrors = checkErrors();
    if (myErrors.length) {
      setFormErrors(myErrors)
      setDisabled(true)
      return;
    }
    let dishType;
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
    let data = await res.json();
    if (res.ok) getEvent();
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
              <div className="w-full flex px-8 mb-6">
                <div className={`flex rounded border border-stone-200 bg-stone-700 px-2 py-1 transition-opacity ease-out duration-500 ${loop ? 'opacity-60' : 'opacity-100'}`}>
                  <p className="text-sm mr-4 text-red-500">Attention!!!</p>
                  <p className="text-sm text-justify">The url is how you will access this event so make sure to copy it.</p>
                </div>
              </div>
              <p className="text-3xl mb-4">{eventData.title}</p>
              <p className="text-sm">{dayjs(eventData.datetime).format('dddd D/M/YY h:mma')}</p>
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
          <div className="w-screen max-w-[500px] flex flex-col px-4 mt-4">
            <p className="text-xl mb-2">
              Menu
            </p>
            <table className="">
              <thead className="border">
                <tr className="flex font-bold">
                  <td className="basis-1/5 border-r">Type</td>
                  <td className="basis-2/5 border-r">Dish</td>
                  <td className="basis-2/5 border-r">Name</td>
                  <td className="basis-1/6">Delete</td>
                </tr>
              </thead>
              <tbody>
                {eventData?.mains ? (
                  eventData.mains.map((obj) => {
                    return <tr key={obj.name + obj.dish} className="flex border-r border-l border-b">
                      <td className="basis-1/5 border-r">Main</td>
                      <td className="basis-2/5 border-r">{obj.dish}</td>
                      <td className="basis-2/5 border-r">{obj.name}</td>
                      <td className="basis-1/6 flex justify-center">
                        <button onClick={() => deleteDish({ name: obj.name, dish: obj.dish, type: "mains" })} className="px-2 rounded text-black border border-stone-50 bg-stone-50">x</button>
                      </td>
                    </tr>
                  })
                ) : null}
                {eventData?.sides ? (
                  eventData.sides.map((obj) => {
                    return <tr key={obj.name + obj.dish} className="flex border-r border-l border-b">
                      <td className="basis-1/5 border-r">Side</td>
                      <td className="basis-2/5 border-r">{obj.dish}</td>
                      <td className="basis-2/5 border-r">{obj.name}</td>
                      <td className="basis-1/6 flex justify-center">
                        <button onClick={() => deleteDish({ name: obj.name, dish: obj.dish, type: "sides" })} className="px-2 rounded text-black border border-stone-50 bg-stone-50">x</button>
                      </td>
                    </tr>
                  })
                ) : null}
                {eventData?.desserts ? (
                  eventData.desserts.map((obj) => {
                    return <tr key={obj.name + obj.dish} className="flex border-r border-l border-b">
                      <td className="basis-1/5 border-r">Dessert</td>
                      <td className="basis-2/5 border-r">{obj.dish}</td>
                      <td className="basis-2/5 border-r">{obj.name}</td>
                      <td className="basis-1/6 flex justify-center">
                        <button onClick={() => deleteDish({ name: obj.name, dish: obj.dish, type: "desserts" })} className="px-2 rounded text-black border border-stone-50 bg-stone-50">x</button>
                      </td>
                    </tr>
                  })
                ) : null}
                {eventData?.drinks ? (
                  eventData.drinks.map((obj) => {
                    return <tr key={obj.name + obj.dish} className="flex border-r border-l border-b">
                      <td className="basis-1/5 border-r">Drink</td>
                      <td className="basis-2/5 border-r">{obj.dish}</td>
                      <td className="basis-2/5 border-r">{obj.name}</td>
                      <td className="basis-1/6 flex justify-center">
                        <button onClick={() => deleteDish({ name: obj.name, dish: obj.dish, type: "drinks" })} className="px-2 rounded text-black border border-stone-50 bg-stone-50">x</button>
                      </td>
                    </tr>
                  })
                ) : null}
                {eventData?.misc ? (
                  eventData.misc.map((obj) => {
                    return <tr key={obj.name + obj.dish} className="flex border-r border-l border-b">
                      <td className="basis-1/5 border-r">Other</td>
                      <td className="basis-2/5 border-r">{obj.dish}</td>
                      <td className="basis-2/5 border-r">{obj.name}</td>
                      <td className="basis-1/6 flex justify-center">
                        <button onClick={() => deleteDish({ name: obj.name, dish: obj.dish, type: "misc" })} className="px-2 rounded text-black border border-stone-50 bg-stone-50">x</button>
                      </td>
                    </tr>
                  })
                ) : null}
              </tbody>
            </table>
            <div className="mt-12 flex flex-col w-full items-center">
              <p className="text-2xl mb-4 w-10/12">What are you bringing?</p>
              <div className="flex flex-col items-center w-full">
                <div className="flex text-lg my-1 w-10/12">
                  <label className="w-2/12">Type</label>
                  <select className="rounded text-black w-10/12" value={newDishType} onChange={(e) => setNewDishType(e.target.value)}>
                    {dishTypes.map(type => {
                      return <option key={type} value={type} className="text-black">{type}</option>
                    })}
                  </select>
                </div>
                <div className="flex text-lg my-1 w-10/12">
                  <label className="w-2/12">Dish</label>
                  <input value={newDishName} onChange={(e) => setNewDishName(e.target.value)} className="rounded w-10/12 pl-2 text-black" />
                </div>
                <div className="flex text-lg my-1 w-10/12">
                  <label className="w-2/12">Name</label>
                  <input value={newDishPerson} onChange={(e) => setNewDishPerson(e.target.value)} className="rounded w-10/12 pl-2 text-black" />
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
