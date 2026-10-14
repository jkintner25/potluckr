import GoHome from "@/components/GoHome";


export default function NotFound() {

  return (
    <main className="container notfound">
      <div>
        <span className="eyebrow">Lost your way?</span>
        <h1 className="display">404</h1>
        <h2>This table is empty.</h2>
        <p>We couldn&apos;t find that potluck. Double-check the link, or head home and start a new gathering.</p>
        <GoHome />
      </div>
    </main>
  )
};
