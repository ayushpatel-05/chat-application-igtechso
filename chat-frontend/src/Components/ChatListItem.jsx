// export default function ChatListItem({name, unread, url, unreadCount = 1, id, handelChatSelect, isSelected}) {
//     return (
//         <li onClick={() => handelChatSelect(id)} 
//         className={`flex items-center text-sm cursor-pointer ${
//           isSelected ? 'text-white bg-gray-700' : 'text-gray-300 hover:text-white'
//         }`}>
//         <span className="relative inline-block mr-4">
//           <img src={url} className="w-10 h-10 p-1 rounded-full border-2 border-gray-300" />
//           <span className="h-3 w-3 rounded-full bg-yellow-500 block absolute bottom-1 right-0"></span>
//         </span>
//         {id}
//         {unread && <span
//               className="bg-red-500 min-w-[20px] min-h-[20px] px-1 flex items-center justify-center text-white text-[11px] font-bold rounded-full ml-auto">{unreadCount}
//             </span>}
//       </li>
//     );
//   }
import { useState } from "react";

export default function ChatListItem({
  name,
  unread,
  url,
  unreadCount = 1,
  id,
  handelChatSelect,
  isSelected,
  onDeleteChat,
  onArchiveChat,
}) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleDropdown = (e) => {
    e.stopPropagation();
    setIsDropdownOpen((prev) => !prev);
  };

  const handleDeleteChat = (e) => {
    e.stopPropagation();
    onDeleteChat(id);
    setIsDropdownOpen(false);
  };

  const handleArchiveChat = (e) => {
    e.stopPropagation();
    onArchiveChat(id);
    setIsDropdownOpen(false);
  };
  console.log(name);
  return (
    <li
      onClick={() => handelChatSelect(id)}
      className={`flex items-center text-sm cursor-pointer ${
        isSelected ? "text-white bg-gray-700" : "text-gray-300 hover:text-white"
      }`}
    >
      <span className="relative inline-block mr-4 min-w-11">
        <img
          src={url}
          className="w-10 h-10 p-1 rounded-full border-2 border-gray-300"
        />
        <span className="h-3 w-3 rounded-full bg-yellow-500 block absolute bottom-1 right-0"></span>
      </span>
      {name}
      {unread && (
        <span className="bg-red-500 min-w-[20px] min-h-[20px] px-1 flex items-center justify-center text-white text-[11px] font-bold rounded-full ml-auto">
          {unreadCount}
        </span>
      )}

      {/* 3-dot menu button */}
      <div className="relative ml-auto">
        <button
          onClick={toggleDropdown}
          className="bg-transparent text-gray-400 hover:text-white ml-2"
        >
          &#x22EE;
        </button>

        {isDropdownOpen && (
          <div className="absolute right-0 mt-2 w-32 bg-gray-800 shadow-lg z-10">
            <button
              onClick={handleDeleteChat}
              className="rounded-none block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 w-full text-left"
            >
              Delete Chat
            </button>
            <button
              onClick={handleArchiveChat}
              className="rounded-none block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 w-full text-left"
            >
              Archive Chat
            </button>
          </div>
        )}
      </div>
    </li>
  );
}
