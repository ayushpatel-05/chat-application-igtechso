export default function ChatListItem({name, unread, url, unreadCount = 1, id, handelChatSelect, isSelected}) {
    return (
        <li onClick={() => handelChatSelect(id)} 
        className={`flex items-center text-sm cursor-pointer ${
          isSelected ? 'text-white bg-gray-700' : 'text-gray-300 hover:text-white'
        }`}>
        <span className="relative inline-block mr-4">
          <img src={url} className="w-10 h-10 p-1 rounded-full border-2 border-gray-300" />
          <span className="h-3 w-3 rounded-full bg-yellow-500 block absolute bottom-1 right-0"></span>
        </span>
        {id}
        {unread && <span
              className="bg-red-500 min-w-[20px] min-h-[20px] px-1 flex items-center justify-center text-white text-[11px] font-bold rounded-full ml-auto">{unreadCount}
            </span>}
      </li>
    );
  }