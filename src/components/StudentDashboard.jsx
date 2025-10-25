import React, { useEffect, useState, useContext } from "react";
import AuthContext from "../context/AuthContext";
import { loadData, saveData, seedIfEmpty } from "../utils/storage";

export default function StudentDashboard() {
  const { user, logout } = useContext(AuthContext);
  const [data, setData] = useState(() => loadData());
  const [confirmModal, setConfirmModal] = useState({ open: false, id: null });

  useEffect(() => {
    seedIfEmpty();
    setData(loadData());
  }, []);

  const allUsers = JSON.parse(localStorage.getItem("joineazy_users")) || [];
  const student = allUsers.find((u) => u.id === user.id);
  const studentName = student ? student.name : "Student";
  const studentId = user.id;

  const assigned =
    data?.assignments?.filter((a) => a.assignedTo.includes(studentId)) || [];

  const handleConfirm = (id) => {
    const updated = loadData();
    const assignment = updated.assignments.find((a) => a.id === id);
    if (!assignment) return;

    assignment.submissions[studentId] = {
      status: "submitted",
      time: new Date().toLocaleString(),
    };

    saveData(updated);
    setData(updated);
    setConfirmModal({ open: false, id: null });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-blue-50 to-purple-100 p-4 sm:p-6 lg:p-10">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white p-6 rounded-2xl shadow-lg border-b-4 border-blue-600 mb-8">
        <h1 className="text-3xl font-extrabold text-gray-800 mb-3 sm:mb-0">
          Welcome, <span className="text-blue-600">{studentName}</span> 
        </h1>
        <button
          onClick={logout}
          className="px-5 py-2.5 bg-red-500 text-white rounded-lg font-semibold hover:bg-red-600 transition duration-200 shadow-sm"
        >
          Logout
        </button>
      </div>

      <h2 className="text-2xl font-semibold text-gray-700 mb-6">
        Your Assignments ({assigned.length})
      </h2>

      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {assigned.length > 0 ? (
          assigned.map((a) => {
            const submission = a.submissions[studentId];
            const submitted = submission?.status === "submitted";
            const dueInPast = new Date(a.dueDate) < new Date();

            return (
              <div
                key={a.id}
                className={`rounded-2xl border p-6 bg-white shadow-md hover:shadow-xl transform transition duration-300 ${
                  submitted
                    ? "border-green-300"
                    : dueInPast
                    ? "border-red-300"
                    : "border-blue-200"
                }`}
              >
                <h3 className="font-bold text-xl text-gray-800 mb-2">
                  {a.title}
                </h3>
                <p
                  className={`text-sm ${
                    dueInPast && !submitted
                      ? "text-red-500 font-semibold"
                      : "text-gray-500"
                  }`}
                >
                  Due: {a.dueDate}
                </p>

                {a.driveLink && (
                  <a
                    href={a.driveLink}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-block mt-2 text-blue-600 hover:text-blue-800 text-sm font-medium"
                  >
                     View Resources
                  </a>
                )}

                <hr className="my-4 border-gray-100" />

                <div className="mb-4">
                  <p
                    className={`text-sm font-semibold ${
                      submitted ? "text-green-600" : "text-red-500"
                    }`}
                  >
                    {submitted ? " Submitted." : " Pending...."}
                  </p>
                  {submitted && (
                    <p className="text-xs text-gray-500 mt-1">
                      Submitted on {submission.time.split(",")[0]}
                    </p>
                  )}
                </div>

                <div className="h-2 bg-gray-200 rounded-full overflow-hidden mb-4">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      submitted
                        ? "bg-green-500 w-full"
                        : dueInPast
                        ? "bg-red-400 w-full"
                        : "bg-yellow-400 w-1/2"
                    }`}
                  ></div>
                </div>

            
                {!submitted ? (
                  <button
                    onClick={() => setConfirmModal({ open: true, id: a.id })}
                    className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2 rounded-lg transition shadow-md focus:ring-2 focus:ring-green-500"
                  >
                    Mark as Completed
                  </button>
                ) : (
                  <button
                    disabled
                    className="w-full bg-gray-300 text-white font-medium py-2 rounded-lg cursor-not-allowed"
                  >
                    Already Submitted
                  </button>
                )}
              </div>
            );
          })
        ) : (
          <div className="col-span-full text-center py-10 bg-white rounded-2xl shadow-lg border border-gray-100">
            <p className="text-xl font-medium text-gray-500"> All caught up!</p>
            <p className="text-gray-400 mt-2">
              You have no active assignments right now.
            </p>
          </div>
        )}
      </div>
      {confirmModal.open && (
        <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-sm shadow-2xl">
            <h3 className="text-xl font-bold text-gray-800 mb-3 text-center">
              Confirm Submission
            </h3>
            <p className="text-sm text-gray-600 mb-6 text-center">
              Are you sure you’ve completed this assignment?  
              Once confirmed, this action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setConfirmModal({ open: false, id: null })}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition"
              >
                Cancel
              </button>
              <button
                onClick={() => handleConfirm(confirmModal.id)}
                className="px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition shadow-md"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
