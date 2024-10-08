import { useEffect, useState } from "react";
import ChatBubble from "./ChatBubble";
import SendMessage from "./SendMessage";
import { useOutletContext } from "react-router-dom";
import { fetchChatHistory, deleteMessage } from "../slices/chatSlice";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { pushNewMessage, selectPerson } from "../slices/chatSlice";
import { LuVideo } from "react-icons/lu";
import { MdOutlineCall, MdDelete } from "react-icons/md";
// import { selectPerson } from "../slices/chatSlice";
// import { MdDelete } from "react-icons/md";
import { useNavigate } from "react-router-dom";

export default function ChatArea() {
    const navigate = useNavigate();
    const {chatID} = useParams();
    const dispatch = useDispatch();
    const [deleteList, setDeleteList] = useState([]);
    let chatHistory = useSelector((state) => state.chat.chatHistory[chatID]);
    const user = useSelector((state) => state.auth.user);
    if(!chatHistory)chatHistory = [];
    console.log(chatHistory);
    const [socket] = useOutletContext();
    // console.log("We have the socket: ", socket);

    useEffect(() => {
        console.log("Inside the useEffect");
        if (!socket) {
            console.log("Socket not initialized");
            return;
        }
        console.log("SSSSSSSSSSSSS");
        socket.on("receiveMessage", (newMessage) => {
            console.log("Received a message");
            dispatch(pushNewMessage({conversationID: chatID, message: newMessage}));
        });
        
        return () => {
            console.log("Turned of the socket receiveMessage");
            socket.off("receiveMessage");
        }
      }, [socket, chatID, dispatch]);

      useEffect(() => {
        dispatch(fetchChatHistory(chatID));
        dispatch(selectPerson(chatID));
      }, [])

    function handelVideoCall() {
        navigate(`/${chatID}/video`)
    }
    
    function handelMessageSend(newMessage) {
        // console.log(socket);
        // if(chatHistory.length == 0) {
        //     socket.emit("newChatMessage", {message: newMessage, conversationId: chatID, senderId: user.id});
        // }
        // else
        // dispatch(fetchPeople());
        socket.emit("message", {message: newMessage, conversationId: chatID, senderId: user.id});
        // dispatch(pushNewMessage({conversationID: chatID, message: newMessage}));
    }

    function handelMessageDelete() {
        dispatch(deleteMessage({messageList: deleteList,conversationID: chatID}))
    }

    function handelMessageSelect(id) {
        setDeleteList((prevState) => {
          const index = prevState.indexOf(id);
      
          if (index > -1) {
            return prevState.filter((messageId) => messageId !== id);
          } else {
            return [...prevState, id];
          }
        });
      }

    return (
        <>
            <div className="h-screen grow flex flex-col">
                <div className="bg-gray-200 flex-1 overflow-y-scroll">
                    <div className="px-4 py-2">
                        <div className="flex items-center mb-2">
                            <img className="w-8 h-8 rounded-full mr-2" src="https://picsum.photos/50/50" alt="User Avatar" />
                            <div className="font-medium">{user.name}</div>
                            <button className="m-5" onClick={handelVideoCall}>
                                <LuVideo></LuVideo>
                            </button>
                            <button className="" onClick={handelVideoCall}>
                                <MdOutlineCall></MdOutlineCall>
                            </button>
                            {deleteList.length > 0 && 
                            <button onClick={handelMessageDelete} className="m-4">
                                <MdDelete></MdDelete>
                            </button>}
                        </div>

                        {chatHistory.map((item, index) => {
                            return (
                                <ChatBubble message={item.content}
                                selectMessage={handelMessageSelect}
                                ownerId={item.senderId}
                                key={index}
                                id={item._id}></ChatBubble>
                                
                            )
                        })}
                    </div>
                </div>
                <SendMessage sendMessage={handelMessageSend}></SendMessage>
            </div>
        </>
    );
}


// //TODO
// //Add an image on side of message(Optional)