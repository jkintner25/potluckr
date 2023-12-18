import PotluckPage from "@/components/PotluckPage";

export default function Event({ params }: { params: { id: string } }) {
  const { id } = params;

  return (
    <PotluckPage id={id} />
  )
}