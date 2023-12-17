import { createContext, useState, useEffect } from "react";

export const UserContext = createContext(null);
export const UpdateUserContext = createContext(null);

export function UserContextProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    setLoading(true);
    const id = localStorage.getItem("userId");
    if (id) {
      fetch(`http://localhost:5001/users?id=${id}`)
        .then((r) => r.json())
        .then((users) => users[0])
        .then((user) => {
          setUser(user);
          setLoading(false);
        });
    }
  }, []);

  useEffect(() => {
    if (user?.id) {
      localStorage.setItem("userId", user.id);
    }
  }, [user?.id]);

  const updateUser = (updatedUser) => {
    setUser(updatedUser);
  };

  return (
    <UserContext.Provider value={{ user, onChange: setUser, loading }}>
      <UpdateUserContext.Provider value={updateUser}>
        {children}
      </UpdateUserContext.Provider>
    </UserContext.Provider>
  );
}
