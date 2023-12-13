import Link from "next/link";

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-between">
      <div className="flex flex-col w-9/12 mt-16">
        <p className='text-2xl font-bold my-2'>
          Welcome to Potluckr
        </p>
        <p className='my-6 text-lg'>The premeire Dish Coordination Solution for Potluck Enthusiasts</p>
        <div className="w-full flex flex-col items-center my-16">
          <Link href="/create" className="px-4 py-3 border rounded-md">Get Started</Link>
        </div>
      </div>
    </main>
  )
}
