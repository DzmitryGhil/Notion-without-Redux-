import { useContext } from "react";
import { UserContext } from "../components/UserContextProvider";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

export function Home() {
  const { user } = useContext(UserContext);

  return (
    <div className="py-8">
      <div className="text-center">
        <h1 className="font-bold text-4xl mb-12">About me</h1>
        <h2>
          Email: <span className="text-gray-500">{user.email}</span>
        </h2>
        <h2>
          Date sign up:{" "}
          <span className="text-gray-500">
            {new Date(user.date).toLocaleDateString("ru-RU")}
          </span>
        </h2>
      </div>
      <div className="text-center py-12 font-semibold text-gray-800 hover:text-gray-500 text-2xl">
        <Link to={`/${user.id}/notes`}>Go to notes</Link>
      </div>
    </div>
  );
}
