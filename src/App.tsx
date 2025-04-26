import {
  RouterProvider,
  createBrowserRouter,
  redirect,
} from "react-router-dom";
import "./App.css";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Registration";
import store from "store";
import { authenticate, logout } from "store/auth-actions";
import { isLoggedIn, removeToken } from "utils/auth";
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "hooks/redux-hooks";
import { fetchReservations } from "store/reservations-actions";
import Reservations from "pages/Reservations";

const logoutLoader = () => {
  removeToken();
  store.dispatch(logout());
  return redirect("/");
};

const redirectIfNotLoggedIn = () => {
  if (!isLoggedIn()) {
    return redirect("/");
  }
  return null;
};

const BrowserRouter = createBrowserRouter([
  { path: "/", element: <Home />, id: "home" },
  { path: "/place/:placeId", element: <Home />, id: "place" },
  { path: "/reservations", element: <Reservations />, id: "reservations" },
  { path: "/login", element: <Login />, id: "login" },
  {
    path: "/register",
    element: <Register />,
    id: "register",
  },
  { path: "/logout", id: "logout", loader: logoutLoader },
  { path: "*", element: <div>Not found</div>, id: "not-found" },
]);

function App() {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);
  useEffect(() => {
    dispatch(authenticate());
  }, []);
  useEffect(() => {
    if (user) dispatch(fetchReservations());
  }, [user]);
  return <RouterProvider router={BrowserRouter} />;
}

export default App;
