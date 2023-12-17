import { useContext, useRef, useState } from "react";
import {
  UpdateUserContext,
  UserContext,
} from "../components/UserContextProvider";
import { Link, useNavigate, useParams } from "react-router-dom";

export function NoteAdd() {
  const { user } = useContext(UserContext);
  const { userId } = useParams();
  const [noteTitle, setNoteTitle] = useState(null);
  const [noteText, setNoteText] = useState(null);
  const titleError = useRef(null);
  const textError = useRef(null);
  const updateUser = useContext(UpdateUserContext);
  const navigate = useNavigate();

  function handleCreateNote() {
    titleError.current.classList.add("hidden");
    textError.current.classList.add("hidden");

    if (!noteTitle) titleError.current.classList.remove("hidden");

    if (!noteText) textError.current.classList.remove("hidden");

    if (!noteTitle || !noteText) return;

    const createNote = {
      id: user.notes.length + 1,
      title: noteTitle,
      text: noteText,
      createdAt: Date.now(),
    };

    const updatedUser = { ...user };
    updatedUser.notes.push(createNote);

    fetch(`http://localhost:5001/users/${userId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedUser),
    })
      .then((response) => response.json())
      .then((updatedUser) => {
        console.log(updatedUser);
        updateUser(updatedUser);
        navigate(`/${userId}/notes`);
      })
      .catch((error) => {
        console.error("Error when adding a note:", error);
      });
  }

  return (
    <div className="py-8">
      <h1 className="text-center text-4xl font-bold mb-12">Create new note</h1>
      <div className="m-auto mt-10 w-1/2 p-5 shadow appearance-none border rounded-xl flex flex-col gap gap-2">
        <div className="flex justify-between  gap-3 font-bold hover:text-gray-500 text-gray-800 text-2xl">
          <Link to={`/${user.id}/notes`}>←</Link>{" "}
        </div>
        <div className="flex flex-col gap-3 w-full">
          <div className="flex flex-col gap-0.5">
            <input
              className="h-10 shadow appearance-none border rounded-lg px-2"
              value={noteTitle}
              onChange={(e) => {
                setNoteTitle(e.currentTarget.value);
              }}
              placeholder="Title"
            />
            <span className="text-red-400 hidden" ref={titleError}>
              Поле не может быть пустым.
            </span>
          </div>

          <div className="flex flex-col gap-0.5">
            <textarea
              className="h-20 shadow appearance-none border rounded-lg px-2"
              value={noteText}
              onChange={(e) => {
                setNoteText(e.currentTarget.value);
              }}
              placeholder="Note text..."
            />
            <span className="text-red-400 hidden" ref={textError}>
              Поле не может быть пустым.
            </span>
          </div>

          <button
            className="font-semibold text-gray-800 text-2xl hover:text-gray-500"
            to={`/${user.id}/notes`}
            onClick={(e) => {
              handleCreateNote();
            }}
          >
            Add new note
          </button>
        </div>
      </div>
    </div>
  );
}
