import { Outlet } from "react-router-dom";
import SideBar from "./SideBar";

export default function SideBarWrapper() {
  return (
    <div className="flex w-screen">
      <SideBar></SideBar>
      <Outlet></Outlet>
    </div>
  );
}