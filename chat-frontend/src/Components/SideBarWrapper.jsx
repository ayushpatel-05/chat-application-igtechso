import { Outlet } from "react-router-dom";
import SideBar from "./SideBar";
import { io } from "socket.io-client";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { fetchPeople } from "../slices/chatSlice";

export default function SideBarWrapper() {
  const dispatch = useDispatch();
  const [socket, setSocket] = useState(null);
  
  useEffect(() => {
    const token = document.cookie.split('; ').find(row => row.startsWith('token='))?.split('=')[1];
    const newSocket = io("http://localhost:3000", {
      auth: {
        token
      }
    });
    setSocket(newSocket);
    dispatch(fetchPeople());
    return () => {
      // if (socketRef.current) {
      //   socketRef.current.disconnect();
      // }
      newSocket.disconnect();
    };
  }, [])


  return (
    <div className="flex w-screen">
      <SideBar socket={socket}></SideBar>
      <Outlet context={[socket]}></Outlet>
    </div>
  );
}