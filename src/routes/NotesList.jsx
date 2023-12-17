import { useContext, useEffect, useState } from "react";
import {
  UserContext,
  UpdateUserContext,
} from "../components/UserContextProvider";
import { Link } from "react-router-dom";

export function NotesList() {
  const { user } = useContext(UserContext);
  const [userNotes, setUserNotes] = useState(null);
  const updateUser = useContext(UpdateUserContext);

  const handleDeleteNote = (userId, noteId) => {
    const updatedUser = { ...user };
    const updatedNotes = updatedUser.notes.filter(
      (note) => note.id !== Number(noteId)
    );
    updatedUser.notes = updatedNotes;

    fetch(`http://localhost:5001/users/${userId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedUser),
    })
      .then((response) => response.json())
      .then((updatedUser) => {
        updateUser(updatedUser);
        setUserNotes(
          updatedUser.notes.sort(function (a, b) {
            return b.createdAt - a.createdAt;
          })
        );
      })
      .catch((error) => {
        console.error("Ошибка при удалении заметки:", error);
      });
  };

  useEffect(() => {
    setUserNotes(
      user?.notes?.sort(function (a, b) {
        return b.createdAt - a.createdAt;
      })
    );
  }, [user]);

  const handleDeleteButtonClick = (userId, noteId) => {
    const confirmation = window.confirm(
      "Вы уверены, что хотите удалить эту заметку?"
    );
    if (confirmation) {
      handleDeleteNote(userId, noteId);
    }
  };

  return (
    <div className="py-8">
      <h1 className="text-center font-bold text-4xl mb-4">Notes</h1>
      <Link
        className="flex flex-col items-center text-2xl hover:text-gray-500 text-gray-800 font-semibold"
        to={`/${user.id}/notes/add`}
      >
        Create Note
      </Link>

      <div className="flex flex-col gap-3 py-4 px-3 items-center justify-center">
        {userNotes?.map((note) => (
          <div
            key={note.id}
            className="p-2 w-80 flex items-center gap-3 border-solid shadow appearance-none border rounded-md justify-between"
          >
            <Link
              to={`/${user.id}/notes/${note.id}`}
              className="flex flex-col gap-1"
            >
              <h2 className="font-bold">{note.title}</h2>
              <p>
                {note.text.substring(0, 50)}
                {note.text.length > 50 ? "..." : ""}
              </p>
              <small className="text-gray-500">
                {new Date(note.createdAt).toLocaleDateString("ru-RU")}
              </small>
            </Link>
            <div className="flex gap-3">
              <Link to={`/${user.id}/notes/${note.id}/edit`}>✏️</Link>
              <button onClick={() => handleDeleteButtonClick(user.id, note.id)}>
                🗑️
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
