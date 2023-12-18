import GoHome from "@/components/GoHome";


export default function NotFound() {

  return (
    <>
      <div className="w-full min-h-[70vh] flex flex-col justify-center items-center px-8">
        <div className="flex items-center">
          <p className="text-5xl">404</p>
          <div className="w-[1px] h-[70px] border mx-6"></div>
          <p className="text-justify">Sorry! We didn&apos;t find the event you&apos;re looking for. Double-check the URL and try again.</p>
        </div>
        <div className="mt-16">
          <GoHome />
        </div>
      </div>
    </>
  )
};