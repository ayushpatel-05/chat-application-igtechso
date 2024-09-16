import { Outlet } from "react-router-dom";
import SideBar from "./SideBar";
import { io } from "socket.io-client";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchPeople } from "../slices/chatSlice";

export default function SideBarWrapper() {
  const dispatch = useDispatch();
  const [socket, setSocket] = useState(null);
  const newChatId = useSelector((state) => state.chat.newChatId);
  
  useEffect(() => {
    const token = document.cookie.split('; ').find(row => row.startsWith('token='))?.split('=')[1];
    const newSocket = io("http://localhost:3000", {
      auth: {
        token
      }
    });
    console.log("The new socket is: ",newSocket);
    setSocket(newSocket);
    dispatch(fetchPeople());
    return () => {
      // if (socketRef.current) {
      //   socketRef.current.disconnect();
      // }
      console.log("Disconnecting socket")
      newSocket.disconnect();
    };
  }, [newChatId])


  return (
    <div className="flex w-screen">
      <SideBar socket={socket}></SideBar>
      <Outlet context={[socket]}></Outlet>
    </div>
  );
}