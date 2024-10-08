import ChatListItem from "./ChatListItem";
import { useSelector } from "react-redux";
import NewChat from "./NewChat";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { createChat } from "../slices/chatSlice";
import { selectPerson } from "../slices/chatSlice";
import { useNavigate } from "react-router-dom";
import { logout } from "../slices/authSlice";

export default function SideBar({ socket }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const userName = useSelector((state) => state.auth.user.name);
  console.log(userName);
  const peopleList = useSelector((state) => state.chat.people);
  const error = useSelector((state) => state.chat.error);
  const selectedConversationID = useSelector(
    (state) => state.chat.selectedConversationID
  );
  const [newUserID, setNewUserID] = useState("");


  useEffect(() => {
    if(selectedConversationID) {
      navigate(`/${selectedConversationID}`);
    }
  }, [selectedConversationID])


  const handelChatSelect = (id) => {
    console.log("Chat with id clicked", id);
    dispatch(selectPerson(id));
    // navigate(`/${id}`);
  };

  const handleInputChange = (event) => {
    setNewUserID(event.target.value);
  };

  const handelLogout = () => {
    dispatch(logout());
  }

  const handelInitiateNewChat = () => {
    dispatch(createChat(newUserID));
    setNewUserID("");
    // navigate(`/${selectedConversationID}`)
  };

  const handleDeleteChat = () => {
    console.log("Chat Deleted");
  }
  const handelArchiveChat = () => {
    console.log("Chat Archived");
  }

  return (
    <nav className="bg-[#211636] shadow-lg h-screen top-0 left-0 min-w-[300px] py-6 px-4 font-[sans-serif] flex flex-col overflow-auto no-scrollbar">

      <div className="flex items-center justify-between cursor-pointer p-4">
        <div className="flex items-center">
          <div className="relative">
            <img
              src="https://readymadeui.com/profile_2.webp"
              className="w-12 h-12 p-1 rounded-full border-2 border-gray-300"
            />
            <span className="h-3 w-3 rounded-full bg-green-600 block absolute bottom-1 right-0"></span>
          </div>
          <div className="ml-4">
            <p className="text-xs text-gray-300">Hello</p>
            <h6 className="text-base text-white">{userName}</h6>
          </div>
        </div>

        <div>
          <button className="text-base text-white bg-inherit" onClick={handelLogout}>Logout</button>
        </div>
      </div>

      <hr className="border-gray-500 mt-8" />
      <NewChat
        {...{ handleInputChange, handelInitiateNewChat, message: newUserID, error }}
      ></NewChat>
      <div className="my-8 flex-1">
        <h6 className="text-sm text-white inline-block">Chats</h6>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="#fff"
          className="w-[15px] h-[15px] float-right cursor-pointer ml-auto"
          viewBox="0 0 118.783 118.783"
        >
          <path
            d="M115.97 101.597 88.661 74.286a47.75 47.75 0 0 0 7.333-25.488c0-26.509-21.49-47.996-47.998-47.996S0 22.289 0 48.798c0 26.51 21.487 47.995 47.996 47.995a47.776 47.776 0 0 0 27.414-8.605l26.984 26.986a9.574 9.574 0 0 0 6.788 2.806 9.58 9.58 0 0 0 6.791-2.806 9.602 9.602 0 0 0-.003-13.577zM47.996 81.243c-17.917 0-32.443-14.525-32.443-32.443s14.526-32.444 32.443-32.444c17.918 0 32.443 14.526 32.443 32.444S65.914 81.243 47.996 81.243z"
            data-original="#000000"
          ></path>
        </svg>

        <ul className="mt-6 space-y-6">
          {peopleList.map((item, index) => {
            const isSelected = selectedConversationID === item._id;
            return (
              <ChatListItem
                name={item._id}
                id={item._id}
                unread={item.unread}
                key={index}
                url={item.imageUrl}
                isSelected={isSelected}
                handelChatSelect={handelChatSelect}
                onArchiveChat={handelArchiveChat}
                onDeleteChat={handleDeleteChat}
              ></ChatListItem>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}


