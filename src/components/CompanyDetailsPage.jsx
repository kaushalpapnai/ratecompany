import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import {
  doc,
  getDoc,
  addDoc,
  collection,
  getFirestore,
} from "firebase/firestore";
import { app } from "../firebase";
import { useSelector } from "react-redux";
import ReviewSection from "./ReviewSection";

const CompanyDetailsPage = () => {
  const [companyDetails, setCompanyDetails] = useState();
  const [rating, setRating] = useState(0); // State for user rating
  const user = useSelector((store) => store?.user?.user);
  const reviewTextRef = useRef(null);
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);

  const { id } = useParams();
  const db = getFirestore(app);
  const reviewSectionRef = useRef(); // Reference to ReviewSection

  const handleInputChange = () => {
    const inputValue = reviewTextRef.current.value.trim();
    setIsButtonDisabled(inputValue === ""); // Enable button if there's text
  };

  const handleRatingChange = (newRating) => {
    setRating(newRating);
  };

  const renderStars = () => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span
          key={i}
          className={`cursor-pointer text-xl ${
            i <= rating ? "text-yellow-400" : "text-gray-400"
          }`}
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
        rating: rating, // Add the rating
        timestamp: Date.now(),
        likes: 0,
        dislikes: 0,
        likedBy: [], // Array to track users who liked
        dislikedBy: [], // Array to track users who disliked
      };

      try {
        const reviewsRef = collection(db, `company/${id}/reviews`);
        await addDoc(reviewsRef, newReview);

        console.log("Review added successfully!");
        reviewTextRef.current.value = "";
        setRating(0);

        // Trigger fetchReviews in ReviewSection
        if (reviewSectionRef.current) {
          reviewSectionRef.current.fetchReviews();
        }
      } catch (error) {
        console.error("Error adding review:", error);
      }
    } else {
      console.log("Review text or rating is missing.");
    }
    setIsButtonDisabled(true);
  };

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

  if (!companyDetails) return null;

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
        <h2 className="text-2xl font-semibold text-gray-800">
          About the Company
        </h2>
        <p className="mt-4 text-gray-600">{companyDetails.description}</p>
        {companyDetails.location && (
          <p className="mt-4 text-gray-600">
            <span className="font-bold">Location:</span>{" "}
            {companyDetails.location}
          </p>
        )}
      </div>

      <div className="bg-white p-6 ">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Reviews</h2>
        <div className="mb-4">
          <textarea
            ref={reviewTextRef}
            placeholder="Write a review..."
            onInput={handleInputChange}
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <div className="flex mt-2">{renderStars()}</div>

          <button
            disabled={isButtonDisabled}
            onClick={handleAddReview}
            className={`mt-2 py-2 px-4 rounded-md ${
              isButtonDisabled
                ? "bg-blue-300 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            } text-white`}
          >
            Submit Review
          </button>
        </div>
        <ReviewSection ref={reviewSectionRef} />
      </div>
    </div>
  );
};

export default CompanyDetailsPage;
