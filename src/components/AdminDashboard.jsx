import React, { useEffect, useState, useContext } from "react";
import AuthContext from "../context/AuthContext";
import { loadData, saveData, seedIfEmpty } from "../utils/storage";

const getProgressColor = (progress) => {
  if (progress === 100) return "bg-green-500";
  if (progress >= 75) return "bg-blue-500";
  if (progress >= 50) return "bg-yellow-400";
  return "bg-red-500";
};

export default function AdminDashboard() {
  const { logout } = useContext(AuthContext);
  const [data, setData] = useState(() => loadData());
  const [showCreate, setShowCreate] = useState(false);
  const [users, setUsers] = useState([]);
  const [newAssignment, setNewAssignment] = useState({
    title: "",
    dueDate: "",
    driveLink: "",
    assignedTo: [],
  });

  useEffect(() => {
    seedIfEmpty();
    const stored = loadData();
    const allUsers = JSON.parse(localStorage.getItem("joineazy_users")) || [];
    const studentUsers = allUsers.filter((u) => u.role === "student");
    setUsers(studentUsers);
    setData(stored);
  }, []);

  const handleCreate = () => {
    if (!newAssignment.title || !newAssignment.dueDate || newAssignment.assignedTo.length === 0) {
      alert("Please fill in all required fields and assign to at least one student.");
      return;
    }

    const updated = loadData() || { students: [], assignments: [] };
    const newA = {
      id: "a" + Date.now(),
      ...newAssignment,
      submissions: {},
    };
    updated.assignments.push(newA);
    saveData(updated);
    setData(updated);
    setShowCreate(false);
    setNewAssignment({ title: "", dueDate: "", driveLink: "", assignedTo: [] });
  };

  const toggleSubmission = (assignmentId, studentId) => {
    const updated = loadData();
    const a = updated.assignments.find((a) => a.id === assignmentId);
    if (!a.submissions) a.submissions = {};

    if (a.submissions[studentId]?.status === "submitted") {
      delete a.submissions[studentId];
    } else {
      a.submissions[studentId] = {
        status: "submitted",
        time: new Date().toLocaleString(),
      };
    }

    saveData(updated);
    setData(updated);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-blue-50 to-purple-100 p-4 sm:p-6 lg:p-10">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 bg-white p-6 rounded-2xl shadow-lg border-b-4 border-indigo-600">
        <h1 className="text-3xl font-extrabold text-gray-800 mb-4 sm:mb-0">
          Admin Dashboard 
        </h1>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => setShowCreate(true)}
            className="flex items-center px-5 py-2.5 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition duration-200 shadow-md"
          >
            + Create Assignment
          </button>
          <button
            onClick={logout}
            className="px-5 py-2.5 bg-red-500 text-white rounded-lg font-semibold hover:bg-red-600 transition duration-200 shadow-sm"
          >
            Logout
          </button>
        </div>
      </div>

      {data?.assignments?.length > 0 ? (
        data.assignments.map((a) => {
          const total = a.assignedTo.length;
          const submitted = Object.keys(a.submissions || {}).length;
          const progress = total > 0 ? Math.round((submitted / total) * 100) : 0;
          const progressColor = getProgressColor(progress);

          return (
            <div
              key={a.id}
              className="bg-white rounded-2xl p-6 shadow-md border border-gray-100 mb-6 hover:shadow-lg transition"
            >
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-3">
                <div>
                  <h3 className="font-bold text-xl text-gray-800">{a.title}</h3>
                  <p className="text-sm text-gray-500">Due: {a.dueDate}</p>
                  {a.driveLink && (
                    <a
                      href={a.driveLink}
                      target="_blank"
                      rel="noreferrer"
                      className="text-blue-600 hover:underline text-sm"
                    >
                       View Drive Link
                    </a>
                  )}
                </div>

                <div className="w-full md:w-64 mt-3 md:mt-0">
                  <p className="text-sm font-semibold text-gray-700 flex justify-between">
                    <span>Submissions:</span>
                    <span>
                      {submitted}/{total} ({progress}%)
                    </span>
                  </p>
                  <div className="h-2.5 bg-gray-200 rounded-full mt-1 overflow-hidden">
                    <div
                      className={`h-full ${progressColor} transition-all duration-500`}
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>
                </div>
              </div>

              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mt-4">
                {a.assignedTo.map((sid) => {
                  const stu = users.find((s) => s.id === sid);
                  const submitted = a.submissions?.[sid]?.status === "submitted";
                  return (
                    <div
                      key={sid}
                      className={`flex justify-between items-center p-3 rounded-lg border ${
                        submitted
                          ? "bg-green-50 border-green-200"
                          : "bg-red-50 border-red-200"
                      }`}
                    >
                      <span className="font-medium text-gray-800">{stu?.name}</span>
                      <button
                        onClick={() => toggleSubmission(a.id, sid)}
                        className={`text-xs px-3 py-1.5 rounded font-medium shadow-sm ${
                          submitted
                            ? "bg-red-400 text-white hover:bg-red-500"
                            : "bg-indigo-500 text-white hover:bg-indigo-600"
                        }`}
                      >
                        {submitted ? "Revoke" : "Mark"}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })
      ) : (
        <div className="text-center py-10 bg-white rounded-2xl shadow-lg border border-gray-100">
          <p className="text-xl font-medium text-gray-500">
            No assignments yet.
          </p>
          <p className="text-gray-400 mt-2">Click "+ Create Assignment" to start.</p>
        </div>
      )}

     
      {showCreate && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-lg shadow-2xl">
            <h3 className="font-bold text-2xl text-gray-800 mb-5 text-center">
               Create New Assignment
            </h3>

            <div className="space-y-4">
              <input
                type="text"
                placeholder="Assignment Title"
                value={newAssignment.title}
                onChange={(e) =>
                  setNewAssignment({ ...newAssignment, title: e.target.value })
                }
                className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-indigo-500"
              />

              <input
                type="date"
                value={newAssignment.dueDate}
                onChange={(e) =>
                  setNewAssignment({ ...newAssignment, dueDate: e.target.value })
                }
                className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-indigo-500"
              />

              <input
                type="url"
                placeholder="Drive Link (Optional)"
                value={newAssignment.driveLink}
                onChange={(e) =>
                  setNewAssignment({ ...newAssignment, driveLink: e.target.value })
                }
                className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-indigo-500"
              />

              <div className="max-h-36 overflow-y-auto border border-gray-200 p-3 rounded-lg bg-gray-50">
                <p className="text-sm font-semibold text-gray-700 mb-2">
                  Assign To:
                </p>
                {users.map((s) => (
                  <label key={s.id} className="flex items-center gap-2 mb-1 text-sm">
                    <input
                      type="checkbox"
                      checked={newAssignment.assignedTo.includes(s.id)}
                      onChange={() => {
                        setNewAssignment((prev) => ({
                          ...prev,
                          assignedTo: prev.assignedTo.includes(s.id)
                            ? prev.assignedTo.filter((id) => id !== s.id)
                            : [...prev.assignedTo, s.id],
                        }));
                      }}
                    />
                    <span>{s.name}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowCreate(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={handleCreate}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
