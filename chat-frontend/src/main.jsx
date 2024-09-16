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
import { Provider } from "react-redux";
import { store } from "./store.js";
import VideoPage from "./Components/VideoPage.jsx";

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
        element: <h1 className="h-screen grow flex justify-center align-middle">Select a chat to start conversation</h1>
      },
      {
        path: "/:chatID",
        element: <ChatArea></ChatArea>
      },
      {
        path: "/:chatID/video",
        element: <VideoPage></VideoPage>
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
  // <React.StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  // </React.StrictMode>
);