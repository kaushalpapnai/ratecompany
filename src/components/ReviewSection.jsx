import React, { forwardRef, useEffect, useImperativeHandle, useState } from "react";
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
import ReplySection from "./ReplySection";
import { ChevronUpIcon, ChevronDownIcon } from "@heroicons/react/24/solid";
import LikeDislikeButtons from "./LikeDislikesButtons";

const ReviewSection = forwardRef((_,ref) => {
  const [reviews, setReviews] = useState([]);
  const [companyDetails, setCompanyDetails] = useState();
  const user = useSelector((store) => store?.user?.user);
  const [activeReplyId, setActiveReplyId] = useState(null);
  const [replyText, setReplyText] = useState("");
  const [openReplies, setOpenReplies] = useState({});

  const { id } = useParams();
  const db = getFirestore(app);
  const replies = useSelector((store) => store?.replies?.replies);
  console.log(replies);

  const toggleResponseOpen = (reviewId) => {
    setOpenReplies((prevState) => ({
      ...prevState,
      [reviewId]: !prevState[reviewId], // Toggle the state for the specific review ID
    }));
  };

  const handleReplySubmit = async (reviewId, name) => {
    try {
      if (replyText.trim() !== "") {
        const replyRef = collection(
          db,
          `company/${id}/reviews/${reviewId}/replies`
        );

        const docRef = await addDoc(replyRef, {
          reviewReplyId: reviewId,
          replyText,
          userId: user?.uid,
          name,
          timestamp: Date.now(),
          likes: 0,
          dislikes: 0,
          likedBy: [],
          dislikedBy: [],
          parentReplyId: null,
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

 
  useImperativeHandle(ref, () => ({
    fetchReviews, // Expose the fetchReviews function to the parent
  }));


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
    <>
      {/* fetching the reviews */}
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
                <LikeDislikeButtons
                  reviewId={review.id}
                  userId={user?.uid}
                  companyId={id}
                  initialLikes={review.likes}
                  initialDislikes={review.dislikes}
                  likedBy={review.likedBy}
                  dislikedBy={review.dislikedBy}
                  refreshReviews={fetchReviews}
                />
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
                    onClick={() =>
                      handleReplySubmit(review?.id, user?.displayName)
                    }
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
              {openReplies[review.id] ? (
                <div
                  onClick={() => {
                    toggleResponseOpen(review.id);
                  }}
                  className="flex items-center border border-red-300 hover:cursor-pointer w-fit"
                >
                  <ChevronUpIcon className="h-5 w-5 text-gray-600 " />
                  <p className="text-blue-400 pl-2">replies</p>
                </div>
              ) : (
                <div
                  onClick={() => {
                    toggleResponseOpen(review.id);
                  }}
                  className="flex items-center  hover:cursor-pointer"
                >
                  <ChevronDownIcon className="h-5 w-5 text-gray-600" />
                  <p className="text-blue-400 pl-2">replies</p>
                </div>
              )}
              {openReplies[review.id] && (
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
              )}
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-600">
          No reviews yet. Be the first to write one!
        </p>
      )}
    </>
  );
});

export default ReviewSection;
