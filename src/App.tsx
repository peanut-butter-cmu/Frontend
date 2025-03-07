
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { useState } from "react";
import Homepage from "./pages/Homepage";
import Login from "./pages/Login";
import CalendarPage from "./pages/CalendarPage";
import LeftSide from "./pages/LeftSide";
import Schedule from "./pages/Schedule";
import Collaboration from "./pages/Collaboration";
import CollaborationConfig from "./pages/CollaborationConfig";
// import CollaborationView from "./pages/CollaboarationView";
import CollaborationEdit from "./pages/CollaborationEdit";
import CollaborationGen from "./pages/CollabGenerate";
import Setting from "./pages/Setting";
import "./App.css";

import { GroupVisibilityProvider } from "./pages/GroupVisibilityContext";

const AppLayout = () => {
  const location = useLocation();
  const [isCollapsed, _setIsCollapsed] = useState(false);

  return (
    <div className="container">
      {location.pathname !== "/" && location.pathname !== "/Login" && (
    <LeftSide isCollapsed={isCollapsed} />
)}

      <div className="calendar-container">
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/Login" element={<Login />} />
          <Route path="/Planner" element={<CalendarPage />} />
          <Route path="/Schedule" element={<Schedule />} />
          <Route path="/Collaboration" element={<Collaboration />} />
          <Route path="/Collaboration-Config" element={<CollaborationConfig />} />
          {/* <Route path="/Collaboration-View" element={<CollaborationView />} /> */}
          <Route path="/Collaboration-Edit" element={<CollaborationEdit />} />
          <Route path="/Collaboration-Gen" element={<CollaborationGen />} />
          <Route path="/Setting" element={<Setting />} />
        </Routes>
      </div>
    </div>
  );
};

const App = () => (
  <BrowserRouter>
    <GroupVisibilityProvider>
      <AppLayout />
    </GroupVisibilityProvider>
  </BrowserRouter>
);

export default App;
