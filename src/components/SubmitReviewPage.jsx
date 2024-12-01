import React, { useState } from 'react';

const SubmitReviewPage = ({ companyName }) => {
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleRatingChange = (value) => {
    setRating(value);
    setErrorMessage(''); // Clear error message when rating is selected
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (rating === 0) {
      setErrorMessage('Please select a rating.');
      return;
    }
    if (reviewText.trim() === '') {
      setErrorMessage('Review cannot be empty.');
      return;
    }
    // Logic for submitting review
    console.log('Review Submitted:', { rating, reviewText });
    alert('Thank you for your review!');
    setRating(0);
    setReviewText('');
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-semibold text-gray-800 text-center mb-6">
          Submit a Review for {companyName || 'Company'}
        </h2>

        <form onSubmit={handleSubmit}>
          {/* Star Rating Section */}
          <div className="mb-4">
            <label className="block text-gray-600 mb-2">Rating</label>
            <div className="flex space-x-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => handleRatingChange(star)}
                  className={`text-2xl ${
                    star <= rating ? 'text-yellow-500' : 'text-gray-300'
                  }`}
                >
                  ★
                </button>
              ))}
            </div>
          </div>

          {/* Review Text Section */}
          <div className="mb-4">
            <label htmlFor="review" className="block text-gray-600 mb-2">
              Your Review
            </label>
            <textarea
              id="review"
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              placeholder="Write your review here..."
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows="4"
            ></textarea>
          </div>

          {/* Error Message */}
          {errorMessage && (
            <p className="text-red-500 text-sm mb-4">{errorMessage}</p>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 focus:outline-none"
          >
            Submit Review
          </button>
        </form>
      </div>
    </div>
  );
};

export default SubmitReviewPage;
