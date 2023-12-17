import { useContext, useEffect, useRef, useState } from "react";
import {
  UpdateUserContext,
  UserContext,
} from "../components/UserContextProvider";
import { Link, useNavigate, useParams } from "react-router-dom";

export function NoteEdit() {
  const { user } = useContext(UserContext);
  const { userId, noteId } = useParams();
  const [noteTitle, setNoteTitle] = useState(null);
  const [noteText, setNoteText] = useState(null);
  const titleError = useRef(null);
  const textError = useRef(null);
  const updateUser = useContext(UpdateUserContext);
  const navigate = useNavigate();
  const [currNote, setCurrNote] = useState(null);

  useEffect(() => {
    let note = user?.notes.find((note) => Number(note.id) === Number(noteId));
    setCurrNote(note);
    setNoteTitle(note.title);
    setNoteText(note.text);
  }, []);

  function handleCreateNote() {
    titleError.current.classList.add("hidden");
    textError.current.classList.add("hidden");

    if (!noteTitle) titleError.current.classList.remove("hidden");

    if (!noteText) textError.current.classList.remove("hidden");

    if (!noteTitle || !noteText) return;

    const createNote = {
      id: currNote.id,
      title: noteTitle,
      text: noteText,
      createdAt: Date.now(),
    };

    const updatedUser = { ...user };
    updatedUser.notes[currNote.id - 1] = { ...createNote };

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
        navigate(`/${userId}/notes`);
      })
      .catch((error) => {
        console.error("Error when adding a note:", error);
      });
  }

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
        <Link className=" hover:text-gray-500" to={`/${user.id}/notes`}>
          ←
        </Link>
        <h1 class="text-xl font-bold">Edit note</h1>
        <div className="flex gap-3">
          <button
            onClick={() => handleDeleteButtonClick(user.id, currNote?.id)}
          >
            🗑️
          </button>
        </div>
      </div>
      <div className="flex flex-col gap-3 w-full">
        <div className="flex flex-col gap-0.5">
          <input
            className="h-10 shadow appearance-none border rounded-lg px-2 focus:outline-none"
            value={noteTitle ? noteTitle : ""}
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
            className="h-20 shadow appearance-none border rounded-lg px-2 focus:outline-none"
            value={noteText ? noteText : ""}
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
          Save changes
        </button>
      </div>
    </div>
  );
}
