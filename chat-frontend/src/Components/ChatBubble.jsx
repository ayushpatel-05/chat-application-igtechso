import { useSelector } from "react-redux";

export default function ChatBubble({ message, ownerId, selectMessage, id}) {
  const userId = useSelector((state) => state.auth.user.id);
  const user = (userId == ownerId);
    return (
      <div className={`flex items-center ${user ? "justify-end" : "justify-start"} mb-2`} onDoubleClick={() => selectMessage(id)}>
        {!user && (
          <div className="bg-white text-gray-800 rounded-lg p-2 shadow max-w-sm">
            {message}
          </div>
        )}
  
        {user && (
          <>
            <div className="bg-blue-500 text-white rounded-lg p-2 shadow max-w-sm mr-2">
              {message}
            </div>
          </>
        )}
      </div>
    );
}
  
