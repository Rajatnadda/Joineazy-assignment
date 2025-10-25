import React, { createContext, useState } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const savedUser = sessionStorage.getItem("joineazy_user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const loadUsers = () => {
    try {
      return JSON.parse(localStorage.getItem("joineazy_users")) || [];
    } catch {
      return [];
    }
  };

  const saveUsers = (users) => {
    localStorage.setItem("joineazy_users", JSON.stringify(users));
  };

  const register = (name, email, password, role) => {
    const users = loadUsers();
    const exists = users.some((u) => u.email === email);
    if (exists) throw new Error("User already exists");

    const newUser = {
      id: Date.now().toString(),
      name,
      email,
      password,
      role,
    };

    const updatedUsers = [...users, newUser];
    saveUsers(updatedUsers);
    return newUser;
  };

  const login = (email, password, role) => {
    const users = loadUsers();
    const found = users.find(
      (u) => u.email === email && u.password === password && u.role === role
    );
    if (!found) throw new Error("Invalid credentials");

    sessionStorage.setItem("joineazy_user", JSON.stringify(found));
    setUser(found);
  };

  const logout = () => {
    sessionStorage.removeItem("joineazy_user");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, register, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export default AuthContext;
