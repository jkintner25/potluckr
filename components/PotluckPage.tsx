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

  const getEvent = async () => {
    let response = await fetch(`api/${id}`);
    let data = await response.json();
    if (response.ok) {
      setEventData(data.data)
    } else {
      setEventError(data.error)
      console.log(data)
    }
  };

  useEffect(() => {
    setLoading(true)
    getEvent();
    let loaded = setTimeout(() => {
      setLoading(false)
    }, 2000)
    return () => clearTimeout(loaded)
  }, [])

  const submitNewDish = async () => {
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
              <p className="text-3xl my-2">{eventData.title}</p>
              <p className="text-sm">{dayjs(eventData.datetime).format('dddd D/M/YY h:mma')}</p>
            </>
          ) : null}
          {eventError !== null ? (
            <p className="">{eventError}</p>
          ) : null}
          <div className="w-screen max-w-[500px] flex flex-col px-4 mt-6">
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
            <div className="mt-12 flex flex-col">
              <p className="text-2xl mb-4">What are you bringing?</p>
              <div className="flex flex-col">
                <div className="flex text-lg my-1">
                  <label className="w-3/12">Type</label>
                  <select className="rounded text-black" value={newDishType} onChange={(e) => setNewDishType(e.target.value)}>
                    {dishTypes.map(type => {
                      return <option key={type} value={type} className="text-black">{type}</option>
                    })}
                  </select>
                </div>
                <div className="flex text-lg my-1">
                  <label className="w-3/12">Dish</label>
                  <input value={newDishName} onChange={(e) => setNewDishName(e.target.value)} className="rounded w-7/12 pl-2 text-black" />
                </div>
                <div className="flex text-lg my-1">
                  <label className="w-3/12">Name</label>
                  <input value={newDishPerson} onChange={(e) => setNewDishPerson(e.target.value)} className="rounded w-7/12 pl-2 text-black" />
                </div>
                <div className="w-full flex justify-center">
                  <button onClick={submitNewDish} className="py-2 px-6 rounded my-8 bg-green-500 text-black">Submit</button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
};