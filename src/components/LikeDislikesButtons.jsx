import React from "react";
import { doc, getDoc, updateDoc, getFirestore } from "firebase/firestore";
import { app } from "../firebase";

const LikeDislikeButtons = ({
  reviewId,
  userId,
  companyId,
  initialLikes,
  initialDislikes,
  likedBy,
  dislikedBy,
  refreshReviews,
}) => {
  const db = getFirestore(app);

  const handleToggleLike = async () => {
    const reviewRef = doc(db, `company/${companyId}/reviews/${reviewId}`);
    const reviewSnap = await getDoc(reviewRef);

    if (reviewSnap.exists()) {
      const reviewData = reviewSnap.data();

      let updatedLikes = reviewData.likes;
      let updatedLikedBy = [...reviewData.likedBy];
      let updatedDislikes = reviewData.dislikes;
      let updatedDislikedBy = [...reviewData.dislikedBy];

      if (updatedLikedBy.includes(userId)) {
        updatedLikedBy = updatedLikedBy.filter((uid) => uid !== userId);
        updatedLikes--;
      } else {
        if (updatedDislikedBy.includes(userId)) {
          updatedDislikedBy = updatedDislikedBy.filter((uid) => uid !== userId);
          updatedDislikes--;
        }
        updatedLikedBy.push(userId);
        updatedLikes++;
      }

      await updateDoc(reviewRef, {
        likes: updatedLikes,
        likedBy: updatedLikedBy,
        dislikes: updatedDislikes,
        dislikedBy: updatedDislikedBy,
      });

      refreshReviews(); // Refresh reviews after update
    }
  };

  const handleToggleDislike = async () => {
    const reviewRef = doc(db, `company/${companyId}/reviews/${reviewId}`);
    const reviewSnap = await getDoc(reviewRef);

    if (reviewSnap.exists()) {
      const reviewData = reviewSnap.data();

      let updatedLikes = reviewData.likes;
      let updatedLikedBy = [...reviewData.likedBy];
      let updatedDislikes = reviewData.dislikes;
      let updatedDislikedBy = [...reviewData.dislikedBy];

      if (updatedDislikedBy.includes(userId)) {
        updatedDislikedBy = updatedDislikedBy.filter((uid) => uid !== userId);
        updatedDislikes--;
      } else {
        if (updatedLikedBy.includes(userId)) {
          updatedLikedBy = updatedLikedBy.filter((uid) => uid !== userId);
          updatedLikes--;
        }
        updatedDislikedBy.push(userId);
        updatedDislikes++;
      }

      await updateDoc(reviewRef, {
        likes: updatedLikes,
        likedBy: updatedLikedBy,
        dislikes: updatedDislikes,
        dislikedBy: updatedDislikedBy,
      });

      refreshReviews(); // Refresh reviews after update
    }
  };

  return (
    <div className="flex items-center space-x-4">
      <button
        className="text-blue-600"
        onClick={handleToggleLike}
      >
        👍 {initialLikes || 0}
      </button>
      <button
        className="text-red-600"
        onClick={handleToggleDislike}
      >
        👎 {initialDislikes || 0}
      </button>
    </div>
  );
};

export default LikeDislikeButtons;
