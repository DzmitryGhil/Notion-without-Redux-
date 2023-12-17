import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { Login } from "./routes/Login";
import { Home } from "./routes/Home";
import { RequireAuth } from "./components/RequireAuth";
import { UserContextProvider } from "./components/UserContextProvider";
import { Error } from "./routes/Error";
import { Registration } from "./routes/Registration";
import { NotesList } from "./routes/NotesList";
import { NoteEdit } from "./routes/NoteEdit";
import { NoteAdd } from "./routes/NoteAdd";
import { NotePage } from "./routes/NotePage";
import { Header } from "./routes/Header";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Header />,
    children: [
      {
        path: "/",
        element: (
          <RequireAuth>
            <Home />
          </RequireAuth>
        ),
      },
      {
        path: "/:userId/notes",
        element: (
          <RequireAuth>
            <NotesList />
          </RequireAuth>
        ),
      },
      {
        path: "/:userId/notes/:noteId",
        element: (
          <RequireAuth>
            <NotePage />
          </RequireAuth>
        ),
      },
      {
        path: "/:userId/notes/:noteId/edit",
        element: (
          <RequireAuth>
            <NoteEdit />
          </RequireAuth>
        ),
      },
      {
        path: "/:userId/notes/add",
        element: (
          <RequireAuth>
            <NoteAdd />
          </RequireAuth>
        ),
      },
    ],
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "*",
    element: <Error />,
  },
  {
    path: "/registration/",
    element: <Registration />,
  },
]);

export default function App() {
  return (
    <UserContextProvider>
      <RouterProvider router={router} />
    </UserContextProvider>
  );
}
