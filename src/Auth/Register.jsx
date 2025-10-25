import React, { useState, useContext } from "react";
import AuthContext from "../context/AuthContext";

export default function Register({ setMode }) {
  const { register } = useContext(AuthContext);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "student",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRoleChange = (newRole) => {
    setForm({ ...form, role: newRole });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    try {
      register(form.name, form.email, form.password, form.role);
      setSuccess("Registration successful! Redirecting to login...");
      setError("");
      setTimeout(() => setMode("login"), 1500);
    } catch (err) {
      setError(err?.message || "Something went wrong. Please try again.");
      setSuccess("");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-indigo-100 to-purple-200 px-4 sm:px-6 lg:px-8">
      <div className="bg-white shadow-xl rounded-2xl w-full max-w-md p-6 sm:p-8 md:p-10 transition-all hover:shadow-2xl">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-800 text-center mb-2">
          Create Your Account
        </h2>
        <p className="text-sm sm:text-base text-gray-500 text-center mb-6">
          Join <span className="font-semibold text-blue-600">Joineazy</span> as a student or admin
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
            <input
              name="name"
              placeholder="Enter your full name"
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
            <input
              name="email"
              type="email"
              placeholder="Enter your email"
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              name="password"
              type="password"
              placeholder="Enter a secure password"
              onChange={handleChange}
              required
              minLength={6}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition"
            />
          </div>

        
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Register as</label>
            <div className="grid grid-cols-2 gap-2 bg-gray-100 p-1 rounded-lg">
              {["student", "admin"].map((role) => (
                <button
                  key={role}
                  type="button"
                  onClick={() => handleRoleChange(role)}
                  aria-pressed={form.role === role}
                  className={`px-4 py-2 text-sm font-semibold rounded-md transition-colors duration-200 ${
                    form.role === role
                      ? "bg-white text-blue-600 shadow"
                      : "bg-transparent text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {role.charAt(0).toUpperCase() + role.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {error && <p className="text-red-500 text-sm text-center">{error}</p>}
          {success && <p className="text-green-600 text-sm text-center">{success}</p>}

          <button
            type="submit"
            className="mt-3 w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg shadow-md transition duration-200"
          >
            Register
          </button>
        </form>

        <p className="text-sm text-center mt-6 text-gray-600">
          Already have an account?{" "}
          <span
            onClick={() => setMode("login")}
            className="text-blue-600 font-medium hover:underline cursor-pointer"
          >
            Login here
          </span>
        </p>

        <p className="text-[10px] text-gray-400 text-center mt-4">
          © {new Date().getFullYear()} Joineazy. All rights reserved.
        </p>
      </div>
    </div>
  );
}
