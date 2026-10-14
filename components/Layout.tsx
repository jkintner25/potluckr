import Footer from "@/components/Footer";
import NavBar from "@/components/Navbar";

const Layout = ({ children }: {
  children: React.ReactNode
}) => {
  return (
    <div className="site-shell">
        <NavBar />
        <div className="site-main">
          {children}
        </div>
        <Footer />
    </div>
  )
}

export default Layout;
