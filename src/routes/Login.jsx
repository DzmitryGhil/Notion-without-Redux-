import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from "../components/UserContextProvider";

export function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const userContext = useContext(UserContext);
  const navigate = useNavigate();

  function handleLogin() {
    const query = new URLSearchParams({
      email,
      password,
    }).toString();

    fetch(`http://localhost:5001/users?${query}`)
      .then((r) => r.json())
      .then((users) => users[0])
      .then((user) => {
        if (user) {
          userContext.onChange(user);
          navigate("/");
        } else {
          setError("Неверный email или пароль.");
        }
      })
      .catch((error) => {
        console.log(error);
        setError("Ошибка входа. Повторите попытку позже.");
      });
  }

  return (
    <div className="h-screen flex flex-col">
      <div className="justify-center items-center flex-grow flex flex-col">
        <div className="shadow-md px-10 pt-5 pb-5 mb-4">
          <h1 className="font-bold text-4xl mb-4">Log in</h1>
          <input
            className="w-full py-2 px-3 text-gray-700 focus:outline-none mb-4 shadow appearance-none border"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          ></input>
          <input
            className="w-full py-2 px-3 text-gray-700 focus:outline-none mb-4 shadow appearance-none border"
            placeholder="Password"
            value={password}
            type="password"
            onChange={(e) => setPassword(e.target.value)}
          ></input>
          {error && <div className="text-red-400 mb-4">{error}</div>}
          <button
            className="font-semibold text-gray-800 py-2 px-5 w-full text-2xl hover:text-gray-500"
            onClick={handleLogin}
          >
            Log in
          </button>
          <div className="text-center font-semibold text-gray-500 py-2 px-5 w-full hover:text-gray-400">
            <Link to={`/registration`}>Sign up</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
