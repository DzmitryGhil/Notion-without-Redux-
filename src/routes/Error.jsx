import { Link } from "react-router-dom";
import { UserContext } from "../components/UserContextProvider";
import { useContext } from "react";

export function Error() {
  const userContext = useContext(UserContext);

  function isLoggedIn() {
    return userContext.user !== null;
  }

  return (
    <div className="text-center font-bold">
      <div className="py-20">
        <h1 className="text-4xl">404</h1>
        <h2 className="text-5xl">Page not found</h2>
        {isLoggedIn() ? (
          <Link to={`/`} className="text-3xl text-gray-700">
            Home
          </Link>
        ) : (
          <Link to={`/`}>Log in</Link>
        )}
      </div>
    </div>
  );
}
