import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import { getUser } from "../utils/auth";
import { Outlet, useLocation } from "react-router-dom";

function Layout({ children }) {
  const user = getUser();
  const location = useLocation();

  // Page title logic
  const getPageTitle = () => {
    if (location.pathname === "/") return "Social";
    return "";
  };

  const activeSidebarItem = location.pathname === "/" ? "Social" : null;


  return (
    <div className="app-layout">
      <Navbar user={user} pageTitle={getPageTitle()} />
      <div className="body">
        <Sidebar active={activeSidebarItem} />
        <main className="content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default Layout;
