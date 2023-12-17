import { useContext, useEffect, useState } from "react";
import {
  UserContext,
  UpdateUserContext,
} from "../components/UserContextProvider";
import { Link, useParams, useNavigate } from "react-router-dom";

export function NotePage() {
  const { user } = useContext(UserContext);
  const { noteId } = useParams();
  const [currNote, setCurrNote] = useState(null);
  const updateUser = useContext(UpdateUserContext);
  const navigate = useNavigate();

  useEffect(() => {
    setCurrNote(user?.notes.find((note) => Number(note.id) === Number(noteId)));
  }, []);

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
        setCurrNote(
          updatedUser.notes.sort(function (a, b) {
            return b.createdAt - a.createdAt;
          })
        );
        navigate(`/${user.id}/notes`);
      })
      .catch((error) => {
        console.error("Ошибка при удалении заметки:", error);
      });
  };

  const handleDeleteButtonClick = (userId, noteId) => {
    const confirmation = window.confirm(
      "Вы уверены, что хотите удалить эту заметку?"
    );
    if (confirmation) {
      handleDeleteNote(userId, noteId);
    }
  };

  return (
    <div className="m-auto mt-10 w-1/2 p-5 shadow appearance-none border rounded-xl flex flex-col gap gap-2">
      <div className="flex justify-between  gap-3 font-bold text-gray-800 text-2xl">
        <Link to={`/${user.id}/notes`}>←</Link>
        <h1 class="text-xl font-bold">{currNote?.title}</h1>
        <div className="flex gap-3">
          <Link to={`/${user.id}/notes/${currNote?.id}/edit`}>✏️</Link>
          <button
            onClick={() => handleDeleteButtonClick(user.id, currNote?.id)}
          >
            🗑️
          </button>
        </div>
      </div>
      <div class="bg-gray-100 p-3 rounded-md">
        <p>{currNote?.text}</p>
      </div>
    </div>
  );
}
