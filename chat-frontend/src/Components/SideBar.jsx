import ChatListItem from "./ChatListItem";

export default function SideBar({socket}) {
  return (
    <nav
      className="bg-[#211636] shadow-lg h-screen top-0 left-0 min-w-[270px] py-6 px-4 font-[sans-serif] flex flex-col overflow-auto no-scrollbar">
      <div className="flex flex-wrap items-center cursor-pointer">

        <div className="relative">
          <img src='https://readymadeui.com/profile_2.webp' className="w-12 h-12 p-1 rounded-full border-2 border-gray-300" />
          <span className="h-3 w-3 rounded-full bg-green-600 block absolute bottom-1 right-0"></span>
        </div>

        <div className="ml-6">
          <p className="text-xs text-gray-300">Hello</p>
          <h6 className="text-base text-white">John Doe</h6>
        </div>
      </div>

      <hr className="border-gray-500 mt-8" />

      <div className="my-8 flex-1">
        <h6 className="text-sm text-white inline-block">Chats</h6>
        <svg xmlns="http://www.w3.org/2000/svg" fill="#fff" className="w-[15px] h-[15px] float-right cursor-pointer ml-auto"
          viewBox="0 0 118.783 118.783">
          <path
            d="M115.97 101.597 88.661 74.286a47.75 47.75 0 0 0 7.333-25.488c0-26.509-21.49-47.996-47.998-47.996S0 22.289 0 48.798c0 26.51 21.487 47.995 47.996 47.995a47.776 47.776 0 0 0 27.414-8.605l26.984 26.986a9.574 9.574 0 0 0 6.788 2.806 9.58 9.58 0 0 0 6.791-2.806 9.602 9.602 0 0 0-.003-13.577zM47.996 81.243c-17.917 0-32.443-14.525-32.443-32.443s14.526-32.444 32.443-32.444c17.918 0 32.443 14.526 32.443 32.444S65.914 81.243 47.996 81.243z"
            data-original="#000000"></path>
        </svg>

        <ul className="mt-6 space-y-6">
         {data.map((item, index) => {
            return (
                <ChatListItem name={item.name}
                unread={item.unread}
                key={index}
                url={item.imageUrl}></ChatListItem>
            )
         })}
        </ul>
      </div>
    </nav>
  );
}




const data = [
    {
        name: "Peter Taylor",
        imageUrl: "https://readymadeui.com/profile_2.webp",
        unread: true
    },
    {
        name: "Johne Words",
        imageUrl: "https://readymadeui.com/profile_4.webp",
        unread: false
    },
    {
        name: "Alen Walwa",
        imageUrl: "https://readymadeui.com/profile_3.webp",
        unread: false
    },
    {
        name: "User",
        imageUrl: "https://readymadeui.com/profile.webp",
        unread: true
    },
    {
        name: "User",
        imageUrl: "https://readymadeui.com/team-1.webp",
        unread: false
    },
    {
        name: "User",
        imageUrl: "https://readymadeui.com/team-2.webp",
        unread: false
    },
    {
        name: "User",
        imageUrl: "https://readymadeui.com/team-3.webp",
        unread: false
    }
]