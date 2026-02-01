import { Outlet, Link } from "react-router-dom";

function Layout() {
  return (
    <div>
      <nav style={{ padding: "10px", borderBottom: "1px solid #ccc" }}>
        <Link to="/">Feed</Link>{" | "}
        <Link to="/login">Login</Link>{" | "}
        <Link to="/register">Register</Link>
      </nav>

      <main style={{ padding: "16px" }}>
        <Outlet />
      </main>
    </div>
  );
}

export default Layout;
