import { BrowserRouter, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Tasks from "./pages/Tasks";
import Habits from "./pages/Habits";
import Goals from "./pages/Goals";
import Calendar from "./pages/Calendar";
import Journal from "./pages/Journal";
import Notes from "./pages/Notes";
import Study from "./pages/Study";
import Documents from "./pages/Documents";
import Notifications from "./pages/Notifications";
import AIAssistant from "./pages/AIAssistant";
import StudyWorkspace from "./pages/StudyWorkspace";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/login" element={<Login />} />
        <Route path="/tasks" element={<Tasks />} />
        <Route path="/habits" element={<Habits />} />
        <Route path="/goals" element={<Goals />} />
        <Route path="/calendar" element={<Calendar />} />
        <Route path="/journal" element={<Journal />} />
        <Route path="/notes" element={<Notes />} />
        <Route path="/study" element={<Study />} />
        <Route path="/documents" element={<Documents />} />
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/ai" element={<AIAssistant />} />
        <Route
          path="/study-workspace"
          element={<StudyWorkspace />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;