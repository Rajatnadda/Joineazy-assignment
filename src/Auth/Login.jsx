import React, { useState, useContext } from "react";
import AuthContext from "../context/AuthContext";

export default function Login({ setMode }) {
  const { login } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("student");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    try {
      login(email, password, role);
    } catch (err) {
      setError(err?.message || "Login failed. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-indigo-100 to-purple-200 px-4 sm:px-6 lg:px-8">
      <div className="bg-white shadow-xl rounded-2xl w-full max-w-md p-6 sm:p-8 md:p-10 transition-all hover:shadow-2xl">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-800 text-center mb-2">
          Welcome Back
        </h2>
        <p className="text-sm sm:text-base text-gray-500 text-center mb-6">
          Login to your <span className="font-semibold text-blue-600">Joineazy</span> account
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
            <input
              type="email"
              placeholder="Enter your email"
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Login as</label>
            <div className="grid grid-cols-2 gap-2 bg-gray-100 p-1 rounded-lg">
              {["student", "admin"].map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setRole(r)}
                  aria-pressed={role === r}
                  className={`px-4 py-2 text-sm font-semibold rounded-md transition-colors duration-200 ${
                    role === r
                      ? "bg-white text-blue-600 shadow"
                      : "bg-transparent text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {r.charAt(0).toUpperCase() + r.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {error && <p className="text-red-500 text-sm text-center">{error}</p>}

          <button
            type="submit"
            className="mt-3 w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg shadow-md transition duration-200"
          >
            Login
          </button>
        </form>

        <p className="text-sm text-center mt-6 text-gray-600">
          Don’t have an account?{" "}
          <span
            onClick={() => setMode("register")}
            className="text-blue-600 font-medium hover:underline cursor-pointer"
          >
            Register here
          </span>
        </p>

        <p className="text-[10px] text-gray-400 text-center mt-4">
          © {new Date().getFullYear()} Joineazy. All rights reserved.
        </p>
      </div>
    </div>
  );
}
