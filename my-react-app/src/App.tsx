// my-react-app/src/App.tsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./pages/CalendarPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* หน้าแรก "/" -> ไป CalendarPage */}
        <Route path="/" element={< HomePage />} />

        {/* หน้าที่สอง "/smart-meetings" -> ไป SmartMeetings */}


      </Routes>
    </BrowserRouter>
  );
}

export default App;
