// import React from 'react';

// const AdminDashboard = ({ stats, companies, reviews }) => {
//   return (
//     <div className="min-h-screen bg-gray-100 p-6">
//       <h1 className="text-3xl font-semibold text-gray-800 text-center mb-8">
//         Admin Dashboard
//       </h1>

//       {/* Statistics Section */}
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
//         <div className="bg-white p-4 rounded-lg shadow-lg">
//           <h2 className="text-lg font-semibold text-gray-700">Total Users</h2>
//           <p className="text-2xl font-bold text-gray-900">{stats.users || 0}</p>
//         </div>
//         <div className="bg-white p-4 rounded-lg shadow-lg">
//           <h2 className="text-lg font-semibold text-gray-700">Total Companies</h2>
//           <p className="text-2xl font-bold text-gray-900">{stats.companies || 0}</p>
//         </div>
//         <div className="bg-white p-4 rounded-lg shadow-lg">
//           <h2 className="text-lg font-semibold text-gray-700">Total Reviews</h2>
//           <p className="text-2xl font-bold text-gray-900">{stats.reviews || 0}</p>
//         </div>
//       </div>

//       {/* Companies Management Section */}
//       <div className="mb-8">
//         <h2 className="text-2xl font-semibold text-gray-800 mb-4">Manage Companies</h2>
//         <div className="bg-white shadow-lg rounded-lg overflow-hidden">
//           <table className="w-full table-auto">
//             <thead>
//               <tr className="bg-gray-200 text-gray-700 text-left">
//                 <th className="px-4 py-2">Company</th>
//                 <th className="px-4 py-2">Reviews</th>
//                 <th className="px-4 py-2">Actions</th>
//               </tr>
//             </thead>
//             <tbody>
//               {companies.map((company) => (
//                 <tr key={company.id} className="border-t">
//                   <td className="px-4 py-2">{company.name}</td>
//                   <td className="px-4 py-2">{company.reviewCount}</td>
//                   <td className="px-4 py-2">
//                     <button className="text-blue-600 hover:underline mr-4">
//                       View
//                     </button>
//                     <button className="text-red-600 hover:underline">
//                       Delete
//                     </button>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       </div>

//       {/* Reviews Management Section */}
//       <div>
//         <h2 className="text-2xl font-semibold text-gray-800 mb-4">Manage Reviews</h2>
//         <div className="bg-white shadow-lg rounded-lg overflow-hidden">
//           <table className="w-full table-auto">
//             <thead>
//               <tr className="bg-gray-200 text-gray-700 text-left">
//                 <th className="px-4 py-2">User</th>
//                 <th className="px-4 py-2">Company</th>
//                 <th className="px-4 py-2">Rating</th>
//                 <th className="px-4 py-2">Actions</th>
//               </tr>
//             </thead>
//             <tbody>
//               {reviews.map((review) => (
//                 <tr key={review.id} className="border-t">
//                   <td className="px-4 py-2">{review.userName}</td>
//                   <td className="px-4 py-2">{review.companyName}</td>
//                   <td className="px-4 py-2">{review.rating} ★</td>
//                   <td className="px-4 py-2">
//                     <button className="text-red-600 hover:underline">
//                       Delete
//                     </button>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AdminDashboard;
