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

const router = createBrowserRouter([
  {
    path: "/",
    element: <SideBarWrapper></SideBarWrapper>,
    // element: <ChatArea></ChatArea>,
    children: [
      {
        path: "",
        element: <ChatArea></ChatArea>
      }
    ]
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);