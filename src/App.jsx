import React, { useContext, useState } from "react";
import AuthContext from "./context/AuthContext";

import AdminDashboard from "./components/AdminDashboard";
import StudentDashboard from "./components/StudentDashboard";
import Login from "./Auth/Login";
import Register from "./Auth/Register";

export default function App() {
  const { user } = useContext(AuthContext);
  const [mode, setMode] = useState("login");

 
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-indigo-100 to-purple-200 px-4">
        <div className="w-full max-w-md transition-all duration-300">
          {mode === "login" ? (
            <Login setMode={setMode} />
          ) : (
            <Register setMode={setMode} />
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-blue-50 to-purple-100">
      {user.role === "student" ? <StudentDashboard /> : <AdminDashboard />}
    </div>
  );
}
