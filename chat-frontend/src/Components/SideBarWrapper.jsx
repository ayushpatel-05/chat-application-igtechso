import { Outlet } from "react-router-dom";
import SideBar from "./SideBar";
import { io } from "socket.io-client";
import { useEffect, useState, useRef } from "react";

export default function SideBarWrapper() {

  const [socket, setSocket] = useState(null);
  const socketRef = useRef(null);

  useEffect(() => {
    // if(!socketRef.current) {
    //   socketRef.current = io("http://localhost:3000");
    //   console.log("Reaching here");
    // }
    const newSocket = io("http://localhost:3000");
    setSocket(newSocket);

    return () => {
      // if (socketRef.current) {
      //   socketRef.current.disconnect();
      // }
      newSocket.disconnect();
    };
  }, [])

  console.log("In the wrapper class: ",socketRef.current);
  return (
    <div className="flex w-screen">
      <SideBar socket={socket}></SideBar>
      <Outlet context={[socket]}></Outlet>
    </div>
  );
}