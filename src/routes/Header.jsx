import { useContext } from "react";
import { UserContext } from "../components/UserContextProvider";
import { NavLink, Outlet } from "react-router-dom";

export function Header() {
  const { user } = useContext(UserContext);

  return (
    <div>
      <header className="flex justify-between items-center py-4 mx-5">
        <div className="flex items-center">
          <h1>Hello, {user?.email}!</h1>
        </div>
        <div className="flex items-center space-x-5">
          <NavLink
            to="/"
            className={({ isActive }) => (isActive ? "font-bold" : "")}
          >
            Home
          </NavLink>
          <NavLink
            to="/:userId/notes"
            className={({ isActive }) => (isActive ? "font-bold" : "")}
          >
            Notes
          </NavLink>
          <NavLink to="/login">Log out</NavLink>
        </div>
      </header>
      <main>
        <Outlet />
      </main>
    </div>
  );
}
