import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import { Outlet } from "react-router-dom";

export default function AdminLayout() {
  return (
    <>
      <Header />

      <div className="main-content">
        <Outlet />
      </div>

      <Sidebar /> {/* bottom nav */}
    </>
  );
}