import { useState } from "react";

export default function SendMessage({sendMessage}) {
    const [messageText, setMessageText] = useState("");

    function handelChange(event) {
        setMessageText(event.target.value);
    }

    const handleKeyDown = (event) => {
      if (event.key === 'Enter') {
          event.preventDefault(); // Prevents the default action (like form submission)
          handelMessageSend();
      }
    };

    function handelMessageSend() {
        if(messageText.trim() == "")return;
        sendMessage(messageText);
        setMessageText("");
    }

  return (
    <div className="bg-gray-100 px-4 py-2">
      <div className="flex items-center">
        <input
          className="w-full border rounded-full py-2 px-4 mr-2"
          type="text"
          value={messageText}
          placeholder="Type your message..."
          onChange={handelChange}
          onKeyDown={handleKeyDown}
        />
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-full" onClick={handelMessageSend}>
          Send
        </button>
      </div>
    </div>
  );
}
