import { Outlet } from "react-router-dom";
// import Header from "../Header";
import Navbar from "../Navbar";
import Footer from "../Footer";
import MarqueeBanner from "../MarqueeBanner";

const Layout = () => {
  return (
    <>
      <MarqueeBanner/>
      {/* <Header /> */}
      <Navbar />
      <main>
        <Outlet />
      </main>
      <Footer />
    </>
  );
};

export default Layout;
