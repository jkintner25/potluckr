import Footer from "@/components/Footer";
import NavBar from "@/components/Navbar";

const Layout = ({ children }: {
  children: React.ReactNode
}) => {
  return (
    <div className="flex flex-col items-center text-white min-h-screen">
        <NavBar />
        <div className="flex-grow">
          {children}
        </div>
        <Footer />
    </div>
  )
}

export default Layout;