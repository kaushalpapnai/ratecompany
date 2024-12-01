import React, { useState } from 'react';

const CompanyDetailsPage = ({ company }) => {
  const [reviewText, setReviewText] = useState('');
  const [reviews, setReviews] = useState([
    { id: 1, username: 'John Doe', comment: 'Amazing company!', rating: 5 },
    { id: 2, username: 'Jane Smith', comment: 'Good services but a bit expensive.', rating: 4 },
  ]);

  const handleAddReview = () => {
    if (reviewText.trim() !== '') {
      const newReview = {
        id: reviews.length + 1,
        username: 'Anonymous', // Replace with actual username when integrated with authentication
        comment: reviewText,
        rating: 4, // Example fixed rating, adjust for actual rating input
      };
      setReviews([newReview, ...reviews]);
      setReviewText('');
    }
  };

  // Example company data (replace with props or fetched data)
  const exampleCompany = {
    id: 1,
    name: 'TechCorp',
    industry: 'Technology',
    rating: 4.8,
    description:
      'TechCorp is a leading technology company known for its innovative solutions and customer-centric approach.',
    location: 'San Francisco, CA',
  };

  const companyData = company || exampleCompany;

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {/* Header Section */}
      <header className="bg-blue-600 text-white py-12 text-center rounded-lg mb-6">
        <h1 className="text-4xl font-bold">{companyData.name}</h1>
        <p className="text-lg mt-4">{companyData.industry}</p>
        <p className="mt-2 text-yellow-400 font-bold">⭐ {companyData.rating.toFixed(1)}</p>
      </header>

      {/* Company Details Section */}
      <div className="bg-white p-6 rounded-lg shadow-lg mb-6">
        <h2 className="text-2xl font-semibold text-gray-800">About the Company</h2>
        <p className="mt-4 text-gray-600">{companyData.description}</p>
        <p className="mt-4 text-gray-600">
          <span className="font-bold">Location:</span> {companyData.location}
        </p>
      </div>

      {/* Reviews Section */}
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Reviews</h2>
        <div className="mb-4">
          <textarea
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
            placeholder="Write a review..."
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handleAddReview}
            className="mt-2 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
          >
            Submit Review
          </button>
        </div>
        {reviews.length > 0 ? (
          <div className="space-y-4">
            {reviews.map((review) => (
              <div
                key={review.id}
                className="bg-gray-100 p-4 rounded-lg shadow-sm hover:shadow-md"
              >
                <h3 className="font-semibold text-gray-800">{review.username}</h3>
                <p className="text-gray-600">{review.comment}</p>
                <p className="text-yellow-500 mt-2">⭐ {review.rating}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-600">No reviews yet. Be the first to write one!</p>
        )}
      </div>
    </div>
  );
};

export default CompanyDetailsPage;
