
import { BrowserRouter, Routes, Route , useLocation } from "react-router-dom";
import { useState } from "react";
import Homepage from "./pages/Homepage";
import Login from "./pages/Token";
import CalendarPage from "./pages/CalendarPage";
import LeftSide from "./pages/LeftSide";
import Schedule from "./pages/Schedule";
import Collaboration from "./pages/Collaboration";
import Setting from "./pages/Setting";

import "./App.css";

const AppLayout = () => {
  const location = useLocation();
  const [isCollapsed, _setIsCollapsed] = useState(false);

  return (
    <div className="container">
      {/* LeftSide (แสดงทุกหน้าที่ไม่ใช่ Login) */}
      {location.pathname !== "/" && location.pathname !== "/Login" && (
    <LeftSide isCollapsed={isCollapsed} />
)}


      {/* Main Content */}
      <div className="calendar-container">
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/Login" element={<Login />} />
          <Route path="/Planner" element={<CalendarPage />} />
          <Route path="/Schedule" element={<Schedule />} />
          <Route path="/Collaboration" element={<Collaboration />} />
          <Route path="/Setting" element={<Setting />} />

        </Routes>
      </div>
    </div>
  );
};

const App = () => (
  <BrowserRouter>
    <AppLayout />
  </BrowserRouter>
);

export default App;
