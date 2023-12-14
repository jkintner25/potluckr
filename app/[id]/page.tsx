import { useRouter } from "next/navigation"


export default function Event({ params }: { params: { id: string } }) {
  const { id } = params;

  return (
    <div className="w-full flex flex-col items-center">
      <p>Your Event ID is {id}</p>
    </div>
  )
}