export default function NewChat({handleInputChange, handelInitiateNewChat, message, error}) {



  return (
    <>
        <div className="flex gap-2 flex-wrap">
            <input
                type="text"
                value={message}
                onChange={handleInputChange}
                placeholder="Enter ID"

            />
            <button onClick={handelInitiateNewChat} className="bg-green-500 hover:bg-green-700 text-white py-1 px-2 rounded-full outline-none">
                New Chat
            </button>
        </div>
        {error && <p className="text-xs text-red-500">User does not exist</p>}
    </>
  );
}
