import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import {
  doc,
  getDoc,
  addDoc,
  collection,
  getFirestore,
  getDocs,
  query,
  orderBy,
} from "firebase/firestore";
import { app } from "../firebase";
import { useSelector } from "react-redux";
import { formatDistanceToNow } from "date-fns";

const CompanyDetailsPage = () => {
  const [reviews, setReviews] = useState([]);
  const [companyDetails, setCompanyDetails] = useState();
  const [rating, setRating] = useState(0);  // State for user rating
  const user = useSelector((store) => store?.user?.user);
  const reviewTextRef = useRef(null);

  const { id } = useParams();
  const db = getFirestore(app);

  const handleRatingChange = (newRating) => {
    setRating(newRating);
  };

  const renderStars = () => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span
          key={i}
          className={`cursor-pointer text-xl ${i <= rating ? 'text-yellow-400' : 'text-gray-400'}`}
          onClick={() => handleRatingChange(i)}
        >
          ★
        </span>
      );
    }
    return stars;
  };

  const handleAddReview = async () => {
    const reviewText = reviewTextRef.current?.value.trim();
    if (reviewText !== "" && rating > 0) {
      const newReview = {
        userId: user?.uid,
        name: user?.displayName,
        comment: reviewText,
        rating: rating,  // Add the rating
        timestamp: Date.now(),
      };

      try {
        const reviewsRef = collection(db, `company/${id}/reviews`);
        await addDoc(reviewsRef, newReview);

        console.log("Review added successfully!");
        reviewTextRef.current.value = "";
        setRating(0);
        fetchReviews();
      } catch (error) {
        console.error("Error adding review:", error);
      }
    } else {
      console.log("Review text or rating is missing.");
    }
  };

  const fetchReviews = async () => {
    if (!id) return;
  
    try {
      const reviewsRef = collection(db, "company", id, "reviews");
      const orderedQuery = query(reviewsRef, orderBy("timestamp", "desc"));
      const querySnapshot = await getDocs(orderedQuery);
      const reviewsArray = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setReviews(reviewsArray);
    } catch (error) {
      console.error("Error fetching reviews:", error);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [id]);

  useEffect(() => {
    if (!id) return;
    const getData = async () => {
      try {
        const docRef = doc(db, "company", id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setCompanyDetails(docSnap.data());
        } else {
          console.log("No such document!");
        }
      } catch (error) {
        console.error("Error fetching document:", error);
      }
    };
    getData();
  }, [id, db]);

  if (!companyDetails) return;

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <header className="bg-blue-600 text-white py-12 text-center rounded-lg mb-6">
        <h1 className="text-4xl font-bold">{companyDetails.name}</h1>
        <p className="text-lg mt-4">{companyDetails.industry}</p>
        <p className="mt-2 text-yellow-400 font-bold">
          ⭐ {companyDetails.rating.toFixed(1)}
        </p>
      </header>

      <div className="bg-white p-6 rounded-lg shadow-lg mb-6">
        <h2 className="text-2xl font-semibold text-gray-800">About the Company</h2>
        <p className="mt-4 text-gray-600">{companyDetails.description}</p>
        {companyDetails.location && (
          <p className="mt-4 text-gray-600">
            <span className="font-bold">Location:</span> {companyDetails.location}
          </p>
        )}
      </div>

      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Reviews</h2>
        <div className="mb-4">
          <textarea
            ref={reviewTextRef}
            placeholder="Write a review..."
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          
          <div className="flex mt-2">
            {renderStars()}
          </div>

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
              <div key={review.id} className="bg-gray-100 p-4 rounded-lg shadow-sm hover:shadow-md">
                <div className="flex items-center">
                  <h3 className="font-semibold text-gray-800 mr-2">{review.name}</h3>
                  <p className="text-xs text-gray-500">
                    {formatDistanceToNow(new Date(review.timestamp))} ago
                  </p>
                </div>
                <p className="text-gray-600">{review.comment}</p>
                <div className="mt-2 text-yellow-400">
                  {Array.from({ length: review.rating }, (_, index) => (
                    <span key={index}>★</span>
                  ))}
                  {Array.from({ length: 5 - review.rating }, (_, index) => (
                    <span key={index} className="text-gray-300">★</span>
                  ))}
                </div>
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
