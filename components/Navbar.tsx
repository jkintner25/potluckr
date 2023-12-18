'use client'
import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";

const Navbar = () => {
  const [showCopied, setShowCopied] = useState(false);
  const { id } = useParams();

  const copyUrl = () => {
    navigator.clipboard.writeText(document.URL)
  }

  return (
    <div className="flex justify-between items-center w-full max-w-[80vw] py-4">
      <Link href="/">Potluckr</Link>
      {!(id === undefined) ? (
        <button className="underline" onClick={copyUrl}>Copy Event Link</button>
      ) : null}
    </div>
  )
}

export default Navbar;