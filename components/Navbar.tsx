import Link from "next/link";


const Navbar = () => {

    return (
        <div className="flex justify-between items-center w-full max-w-[80vw] py-4">
            <Link href="/">Potluckr</Link>
        </div>
    )
}

export default Navbar;