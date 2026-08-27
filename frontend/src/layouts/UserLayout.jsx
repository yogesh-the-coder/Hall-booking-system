import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import { Outlet } from "react-router-dom";

export default function UserLayout() {
  return (
    <div>

      {/* SIDEBAR */}
      <Sidebar />

      {/* ✅ MAIN CONTENT FIX */}
      <div
  style={{
    marginLeft: "0",
    width: "100%",
    height: "100vh",
    display: "flex",
    flexDirection: "column"
  }}
>
  <Header />

  {/* ✅ SCROLL ENABLE */}
  <div
    style={{
      flex: 1,
      padding: "20px",
      overflowY: "auto"
    }}
  >
    <Outlet />
  </div>
</div>

    </div>
  );
}