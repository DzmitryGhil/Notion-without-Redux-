import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { User } from "../util/validation";
import { z } from "zod";

export function Registration() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [errors, setErrors] = useState({
    email: "",
    password: "",
    repeatPassword: "",
  });
  const navigate = useNavigate();

  async function handleSignUp() {
    if (password !== repeatPassword) {
      setErrors({ ...errors, repeatPassword: "Пароли не совпадают." });
      return;
    }

    const newUser = {
      id: Date.now(),
      email,
      password,
      date: Date.now(),
      notes: [],
    };

    try {
      const validUser = User.parse(newUser);

      const response = await fetch("http://localhost:5001/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(validUser),
      });

      if (response.ok) {
        console.log("User successfully added:", validUser);
        navigate("/login");
      } else {
        const error = await response.json();
        if (error.length > 0) {
          const messagesAboutErrors = error.map((err) => err.message);
          setErrors(messagesAboutErrors);
          console.error("Registration errors:", messagesAboutErrors);
        }
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors = {};

        error.errors.forEach((err) => {
          const fieldName = err.path[0];
          if (!fieldErrors[fieldName]) {
            fieldErrors[fieldName] = err.message;
          }
        });

        setErrors(fieldErrors);
      } else {
        console.error("Error adding user:", error);
      }
    }
  }

  return (
    <div className="h-screen flex flex-col ">
      <div className="justify-center items-center flex-grow flex flex-col">
        <div className="shadow-md px-10 pt-5 pb-5 mb-8">
          <h1 className="font-bold text-4xl mb-4">Sign up</h1>
          <div>
            <input
              className="w-full py-2 px-3 text-gray-700 focus:outline-none mb-4 shadow appearance-none border"
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            {errors.email && (
              <div className="text-red-400 mb-4">{errors.email}</div>
            )}
          </div>

          <div>
            <input
              className="w-full py-2 px-3 text-gray-700 focus:outline-none mb-4 shadow appearance-none border"
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {errors.password && (
              <div className="text-red-400 mb-4">{errors.password}</div>
            )}
          </div>

          <div>
            <input
              className="w-full py-2 px-3 text-gray-700 focus:outline-none mb-4 shadow appearance-none border"
              type="password"
              placeholder="Repeat password"
              value={repeatPassword}
              onChange={(e) => setRepeatPassword(e.target.value)}
            />
            {errors.repeatPassword && (
              <div className="text-red-400 mb-4">{errors.repeatPassword}</div>
            )}
          </div>

          <button
            className="font-semibold text-gray-800 py-2 px-5 w-full text-2xl hover:text-gray-500"
            type="button"
            onClick={handleSignUp}
          >
            Sign up
          </button>
        </div>
      </div>
    </div>
  );
}
