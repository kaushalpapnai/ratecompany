import React, { useState } from "react";
import { useSelector } from "react-redux";
import { getAuth, signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";

const UserProfilePage = () => {
  const user = useSelector((store) => store?.user?.user);
  const auth = getAuth();
  const navigate = useNavigate();

  const handleLogOut = () => {
    signOut(auth)
      .then(() => {
      })
      .catch((error) => {
        console.error("Error signing out:", error);
      });
  };

  const handleLogIn = () => {
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6 flex justify-center">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg">
        <h2 className="text-2xl font-semibold text-center mb-6">
          Your Profile
        </h2>
        {user ? (
          <div className="mb-6">
            <p>
              <strong>Name:</strong> {user?.displayName || "undefined"}
            </p>
            <p>
              <strong>Email:</strong> {user?.email || "undefined"}
            </p>
          </div>
        ) : (
          <h1 className="text-gray-600 text-3xl font-semibold mb-5 text-center  p-4">
            Please login!!!{" "}
            <span role="img" aria-label="unamused face">
              🫤
            </span>
          </h1>
        )}
        <div className="flex justify-center">
          {user ? (
            <button
              onClick={handleLogOut}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
            >
              Log Out
            </button>
          ) : (
            <button
              onClick={handleLogIn}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
            >
              Log In
            </button>
          )}
        </div>
      </div>

    </div>
  );
};

export default UserProfilePage;
