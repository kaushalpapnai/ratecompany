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
  updateDoc,
} from "firebase/firestore";
import { app } from "../firebase";
import { useSelector } from "react-redux";
import { formatDistanceToNow } from "date-fns";
import ReplySection from "./ReplySection";


const CompanyDetailsPage = () => {
  const [reviews, setReviews] = useState([]);
  const [companyDetails, setCompanyDetails] = useState();
  const [rating, setRating] = useState(0); // State for user rating
  const user = useSelector((store) => store?.user?.user);
  const reviewTextRef = useRef(null);
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  const [activeReplyId, setActiveReplyId] = useState(null);
  const [replyText,setReplyText] = useState("")

  const { id } = useParams();
  const db = getFirestore(app);

  const handleInputChange = () => {
    const inputValue = reviewTextRef.current.value.trim();
    setIsButtonDisabled(inputValue === ""); // Enable button if there's text
  };

  const handleRatingChange = (newRating) => {
    setRating(newRating);
  };
   

  const handleReplySubmit = async (reviewId, name) => {
    try {
      if (replyText.trim() !== "") {
        const replyRef = collection(
          db,
          `company/${id}/reviews/${reviewId}/replies`
        );

        const docRef = await addDoc(replyRef, {
          reviewReplyId:reviewId,
          replyText,
          userId:user?.uid,
          name,
          timestamp: Date.now(),
          likes: 0,
          dislikes: 0,
          likedBy: [],
          dislikedBy: [],
          parentReplyId:  null,
          parentReplyName: null,
        });

        setReplyText("");
        setActiveReplyId(null);
        console.log("Document added with ID:", docRef.id);
      }
    } catch (error) {
      console.error("Error adding document:", error);
    }
  };


  const handleToggleLike = async (reviewId) => {
    const reviewRef = doc(db, `company/${id}/reviews/${reviewId}`);
    const reviewSnap = await getDoc(reviewRef);

    if (reviewSnap.exists()) {
      const reviewData = reviewSnap.data();

      let updatedLikes = reviewData.likes;
      let updatedLikedBy = [...reviewData.likedBy];
      let updatedDislikes = reviewData.dislikes;
      let updatedDislikedBy = [...reviewData.dislikedBy];

      if (updatedLikedBy.includes(user?.uid)) {
        // If user already liked, toggle off
        updatedLikedBy = updatedLikedBy.filter((uid) => uid !== user?.uid);
        updatedLikes--;
      } else {
        // If user dislikes, toggle it off first
        if (updatedDislikedBy.includes(user?.uid)) {
          updatedDislikedBy = updatedDislikedBy.filter(
            (uid) => uid !== user?.uid
          );
          updatedDislikes--;
        }
        // Add like
        updatedLikedBy.push(user?.uid);
        updatedLikes++;
      }

      await updateDoc(reviewRef, {
        likes: updatedLikes,
        likedBy: updatedLikedBy,
        dislikes: updatedDislikes,
        dislikedBy: updatedDislikedBy,
      });

      fetchReviews(); // Refresh the reviews list
    }
  };

  const handleToggleDislike = async (reviewId) => {
    const reviewRef = doc(db, `company/${id}/reviews/${reviewId}`);
    const reviewSnap = await getDoc(reviewRef);

    if (reviewSnap.exists()) {
      const reviewData = reviewSnap.data();

      let updatedLikes = reviewData.likes;
      let updatedLikedBy = [...reviewData.likedBy];
      let updatedDislikes = reviewData.dislikes;
      let updatedDislikedBy = [...reviewData.dislikedBy];

      if (updatedDislikedBy.includes(user?.uid)) {
        // If user already disliked, toggle off
        updatedDislikedBy = updatedDislikedBy.filter(
          (uid) => uid !== user?.uid
        );
        updatedDislikes--;
      } else {
        // If user likes, toggle it off first
        if (updatedLikedBy.includes(user?.uid)) {
          updatedLikedBy = updatedLikedBy.filter((uid) => uid !== user?.uid);
          updatedLikes--;
        }
        // Add dislike
        updatedDislikedBy.push(user?.uid);
        updatedDislikes++;
      }

      await updateDoc(reviewRef, {
        likes: updatedLikes,
        likedBy: updatedLikedBy,
        dislikes: updatedDislikes,
        dislikedBy: updatedDislikedBy,
      });

      fetchReviews(); // Refresh the reviews list
    }
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
        fetchReviews();
      } catch (error) {
        console.error("Error adding review:", error);
      }
    } else {
      console.log("Review text or rating is missing.");
    }
    setIsButtonDisabled(true);
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

        {reviews.length > 0 ? (
          <div className="space-y-4 ">
            {reviews.map((review) => (
              <div key={review.id} className="mb-8">
                <div className="flex items-center">
                  <h3 className="font-semibold text-sm text-gray-800 mr-2">
                    @{review?.name?.replace(/\s+/g, "").toLowerCase()}
                  </h3>
                  <p className="text-xs text-gray-500">
                    {formatDistanceToNow(new Date(review.timestamp))} ago
                  </p>
                </div>
                <p className="text-gray-600">{review.comment}</p>
                {/* <div className="mt-2 text-yellow-400">
                  {Array.from({ length: review.rating }, (_, index) => (
                    <span key={index}>★</span>
                  ))}
                  {Array.from({ length: 5 - review.rating }, (_, index) => (
                    <span key={index} className="text-gray-300">
                      ★
                    </span>
                  ))}
                </div> */}
                <div className="flex items-center space-x-4 mt-2">
                  <button
                    className="text-blue-600"
                    onClick={() => handleToggleLike(review.id, true)}
                  >
                    👍 {review.likes || 0}
                  </button>
                  <button
                    className="text-red-600"
                    onClick={() => handleToggleDislike(review.id, false)}
                  >
                    👎 {review.dislikes || 0}
                  </button>
                  <button
                  className="pl-2 text-xs font-semibold"
                  onClick={() => setActiveReplyId(review?.id)}
                >
                  Reply
                </button>
                </div>
                {activeReplyId === review?.id && (
                <div>
                  <textarea
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder="Add a public reply..."
                    className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-100 text-sm text-gray-800 shadow-sm resize-none transition-all duration-200 ease-in-out hover:bg-gray-50"
                    rows="2"
                  />
                  <button
                    onClick={()=>handleReplySubmit(review?.id,user?.displayName)}
                    className={`mt-2 mr-2 py-1 px-3 rounded-full bg-blue-600 text-white hover:bg-blue-700 text-sm`}
                  >
                    Reply
                  </button>
                  <button
                    onClick={() => setActiveReplyId(null)}
                    className="py-1 px-3 text-gray-800 hover:bg-gray-400 rounded-full text-sm"
                  >
                    Cancel
                  </button>
                </div>
              )}
                <div className="mt-2">
                  <ReplySection
                    reviewReplyId={review.id}
                    id={id}
                    userId={user?.uid}
                    name={user?.displayName}
                    parentId={user?.uid}
                    parentName={user?.displayName}
                  />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-600">
            No reviews yet. Be the first to write one!
          </p>
        )}
      </div>
    </div>
  );
};

export default CompanyDetailsPage;
