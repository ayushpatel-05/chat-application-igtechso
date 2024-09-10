import { useState } from "react";
import ChatBubble from "./ChatBubble";
import SendMessage from "./SendMessage";

export default function ChatArea({messages}) {
    const [messageList, setMessageList] = useState(data);//Later to be changed 

    function handelMessageSend(newMessage) {
        setMessageList(oldState => [
            ...oldState, // shallow copy of the array
            {
                message: newMessage,
                user: true, // Assuming this is a user message
            }
        ]);
    }

    return (
        <>
            <div className="h-screen grow flex flex-col">
                <div className="bg-gray-200 flex-1 overflow-y-scroll">
                    <div className="px-4 py-2">
                        <div className="flex items-center mb-2">
                            <img className="w-8 h-8 rounded-full mr-2" src="https://picsum.photos/50/50" alt="User Avatar" />
                            <div className="font-medium">John Doe</div>
                        </div>

                        {messageList.map((item, index) => {
                            return (
                                <ChatBubble message={item.message}
                                user={item.user}
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


const data = [
        {
            message: "Hi, how can I help you?",
            user: false,
        },
    {
        message: "You cant",
        user: true,
    },
    {
        message: "Hi, how can I help you?",
        user: false,
    },
    {
        message: "You cant",
        user: true,
    },
    {
        message: "Hi, how can I help you?",
        user: false,
    },
    {
        message: "You cant",
        user: true,
    },
    {
        message: "Hi, how can I help you?",
        user: false,
    },
    {
        message: "You cant",
        user: true,
    },
    {
        message: "Hi, how can I help you?",
        user: false,
    },
    {
        message: "You cant",
        user: true,
    },
    {
        message: "Hi, how can I help you?",
        user: false,
    },
    {
        message: "You cant",
        user: true,
    },
    {
        message: "Hi, how can I help you?",
        user: false,
    },
    {
        message: "You cant",
        user: true,
    },
    {
        message: "Hi, how can I help you?",
        user: false,
    },
    {
        message: "You cant",
        user: true,
    },
    {
        message: "Hi, how can I help you?",
        user: false,
    },
    {
        message: "You cant",
        user: true,
    },
    {
        message: "Hi, how can I help you?",
        user: false,
    },
    {
        message: "You cant",
        user: true,
    }
]

//TODO
//Add an image on side of message(Optional)