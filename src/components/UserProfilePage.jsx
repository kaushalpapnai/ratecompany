import React from 'react';
import { useSelector } from "react-redux";

const UserProfilePage = () => {

  const user = useSelector((store)=>store?.user?.user)
  

  return (
    <div className="min-h-screen bg-gray-100 p-6 flex justify-center">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg">
        <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">
          Your Profile
        </h2>

        {/* User Information Section */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-700">Personal Details</h3>
          <div className="mt-4 space-y-2">
            <p>
              <strong>Name:</strong> { user ? user.displayName : "undefined"}
            </p>
            <p>
              <strong>Email:</strong> { user ? user.email : "undefined"}
            </p>
          </div>
        </div>

        {/* User Reviews Section */}
        {/* <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-700">Your Reviews</h3>
          {user.reviews && user.reviews.length > 0 ? (
            <ul className="mt-4 space-y-4">
              {user.reviews.map((review, index) => (
                <li
                  key={index}
                  className="p-4 bg-gray-50 rounded-lg shadow-sm border border-gray-200"
                >
                  <p className="font-semibold">{review.companyName}</p>
                  <p className="text-sm text-gray-600">Rating: {review.rating} ★</p>
                  <p className="text-gray-700 mt-2">{review.comment}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-4 text-gray-600">You haven't submitted any reviews yet.</p>
          )}
        </div> */}

        {/* Edit Profile Button */}
        <div className="flex justify-center">
          <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none">
            Edit Profile
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserProfilePage;
