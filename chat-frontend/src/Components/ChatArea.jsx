import { useEffect } from "react";
import ChatBubble from "./ChatBubble";
import SendMessage from "./SendMessage";
import { useOutletContext } from "react-router-dom";
import { fetchChatHistory } from "../slices/chatSlice";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { pushNewMessage } from "../slices/chatSlice";

export default function ChatArea() {
    const {chatID} = useParams();
    const dispatch = useDispatch();
    let chatHistory = useSelector((state) => state.chat.chatHistory[chatID]);
    const user = useSelector((state) => state.auth.user);
    if(!chatHistory)chatHistory = [];
    console.log("Chat History is: ",chatHistory)
    const [socket] = useOutletContext();

    useEffect(() => {
        if (!socket) return;
    
        socket.on("receiveMessage", (newMessage) => {
            dispatch(pushNewMessage({conversationID: chatID, message: newMessage}));
        });
        
        return () => socket.off("receiveMessage");
      }, [socket, chatID, dispatch]);

      useEffect(() => {
        console.log("Running chat history fetch: ");
        dispatch(fetchChatHistory(chatID));
      }, [])


    function handelMessageSend(newMessage) {
        socket.emit("message", {message: newMessage, conversationId: chatID});
    }

    return (
        <>
            <div className="h-screen grow flex flex-col">
                <div className="bg-gray-200 flex-1 overflow-y-scroll">
                    <div className="px-4 py-2">
                        <div className="flex items-center mb-2">
                            <img className="w-8 h-8 rounded-full mr-2" src="https://picsum.photos/50/50" alt="User Avatar" />
                            <div className="font-medium">{user.name}</div>
                        </div>

                        {chatHistory.map((item, index) => {
                            return (
                                <ChatBubble message={item.content}
                                ownerId={item.senderId}
                                key={index}></ChatBubble>
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