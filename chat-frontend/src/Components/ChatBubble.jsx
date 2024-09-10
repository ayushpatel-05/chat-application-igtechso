export default function ChatBubble({ message, user }) {
    return (
      <div className={`flex items-center ${user ? "justify-end" : "justify-start"} mb-2`}>
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
  

//Message send by user
{
  /* <div className="flex items-center justify-end">
  <div className="bg-blue-500 text-white rounded-lg p-2 shadow mr-2 max-w-sm">
    Sure, I can help with that.
  </div>
  <img
    className="w-8 h-8 rounded-full"
    src="https://picsum.photos/50/50"
    alt="User Avatar"
  />
</div>; */
}
