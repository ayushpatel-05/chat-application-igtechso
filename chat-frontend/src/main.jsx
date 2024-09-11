import * as React from "react";
import * as ReactDOM from "react-dom/client";
// import SideBar from "./Components/SideBar.jsx";
import ChatArea from "./Components/ChatArea.jsx";
import SideBarWrapper from "./Components/SideBarWrapper.jsx";
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import "./index.css";
import Login from "./Components/Login.jsx";
import Register from "./Components/Register.jsx";
import ProtectedRoute from "./Components/ProtectedRoute.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <SideBarWrapper></SideBarWrapper>
      </ProtectedRoute>
    ),
    // element:<Login></Login>
    // element: <Register></Register>
    children: [
      {
        path: "",
        element: <ChatArea></ChatArea>
      }
    ]
  },
  {
    path: "/login",
    element: <Login></Login>
  },
  {
    path: "/register",
    element: <Register></Register>
  }
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);