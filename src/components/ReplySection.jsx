import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  orderBy,
  query,
  updateDoc,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { app } from "../firebase";
import { formatDistanceToNow } from "date-fns";
import { useSelector } from "react-redux";

const ReplySection = ({
  reviewReplyId,
  id,
  userId,
  name,
  parentId,
  parentName,
}) => {
  const [replyText, setReplyText] = useState("");
  const [replies, setReplies] = useState([]);
  const [activeReplyId, setActiveReplyId] = useState(null);
  const user = useSelector((store) => store?.user?.user);

  const db = getFirestore(app);

  const handleReplySubmit = async () => {
    try {
      if (replyText.trim() !== "") {
        const replyRef = collection(
          db,
          `company/${id}/reviews/${reviewReplyId}/replies`
        );

        const docRef = await addDoc(replyRef, {
          reviewReplyId,
          replyText,
          userId,
          name,
          timestamp: Date.now(),
          likes: 0,
          dislikes: 0,
          likedBy: [],
          dislikedBy: [],
          parentReplyId: parentId || null,
          parentReplyName: parentName || null,
        });

        setReplyText("");
        fetchReplies();
        setActiveReplyId(null);
        console.log("Document added with ID:", docRef.id);
      }
    } catch (error) {
      console.error("Error adding document:", error);
    }
  };

  const handleToggleLike = async (replyId) => {
    const reviewRef = doc(
      db,
      `company/${id}/reviews/${reviewReplyId}/replies/${replyId}`
    );
    const reviewSnap = await getDoc(reviewRef);

    if (reviewSnap.exists()) {
      const reviewData = reviewSnap.data();

      let updatedLikes = reviewData.likes;
      let updatedLikedBy = [...reviewData.likedBy];
      let updatedDislikes = reviewData.dislikes;
      let updatedDislikedBy = [...reviewData.dislikedBy];

      if (updatedLikedBy.includes(userId)) {
        // If user already liked, toggle off
        updatedLikedBy = updatedLikedBy.filter((uid) => uid !== userId);
        updatedLikes--;
      } else {
        // If user dislikes, toggle it off first
        if (updatedDislikedBy.includes(userId)) {
          updatedDislikedBy = updatedDislikedBy.filter((uid) => uid !== userId);
          updatedDislikes--;
        }
        // Add like
        updatedLikedBy.push(userId);
        updatedLikes++;
      }

      await updateDoc(reviewRef, {
        likes: updatedLikes,
        likedBy: updatedLikedBy,
        dislikes: updatedDislikes,
        dislikedBy: updatedDislikedBy,
      });

      fetchReplies(); // Refresh the reviews list
    }
  };

  const handleToggleDislike = async (replyId) => {
    const reviewRef = doc(
      db,
      `company/${id}/reviews/${reviewReplyId}/replies/${replyId}`
    );
    const reviewSnap = await getDoc(reviewRef);

    if (reviewSnap.exists()) {
      const reviewData = reviewSnap.data();

      let updatedLikes = reviewData.likes;
      let updatedLikedBy = [...reviewData.likedBy];
      let updatedDislikes = reviewData.dislikes;
      let updatedDislikedBy = [...reviewData.dislikedBy];

      if (updatedDislikedBy.includes(userId)) {
        // If user already disliked, toggle off
        updatedDislikedBy = updatedDislikedBy.filter((uid) => uid !== userId);
        updatedDislikes--;
      } else {
        // If user likes, toggle it off first
        if (updatedLikedBy.includes(userId)) {
          updatedLikedBy = updatedLikedBy.filter((uid) => uid !== userId);
          updatedLikes--;
        }
        // Add dislike
        updatedDislikedBy.push(userId);
        updatedDislikes++;
      }

      await updateDoc(reviewRef, {
        likes: updatedLikes,
        likedBy: updatedLikedBy,
        dislikes: updatedDislikes,
        dislikedBy: updatedDislikedBy,
      });

      fetchReplies(); // Refresh the reviews list
    }
  };

  const fetchReplies = async () => {
    try {
      const collectionRef = collection(
        db,
        `company/${id}/reviews/${reviewReplyId}/replies`
      );
  
      // Fetch replies ordered by timestamp in descending order
      const querySnapshot = await getDocs(
        query(collectionRef, orderBy("timestamp", "desc"))
      );
  
      const fetchedReplies = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      console.log(fetchedReplies);
      setReplies(fetchedReplies);
    } catch (error) {
      console.error("Error fetching collection:", error);
    }
  };
  

  useEffect(() => {
    fetchReplies();
  }, []);

  const fetchCollection = async () => {
    try {
      // Reference to the collection you want to fetch
      const collectionRef = collection(db, "yourCollectionName");

      // Fetch all documents in the collection
      const querySnapshot = await getDocs(collectionRef);

      // Iterate through each document and log its data
      querySnapshot.forEach((doc) => {
        console.log(`Document ID: ${doc.id}`, doc.data());
      });
    } catch (error) {
      console.error("Error fetching collection:", error);
    }
  };

  fetchCollection();

  return (
    <div className="">
      {replies.length > 0 && (
        <div className="space-y-4">
          {replies.map((reply) => (
            <div
              key={reply?.id}
              className="pl-10"
            >
              <div className="flex items-center">
                <h3 className="font-semibold text-gray-800 mr-2 text-sm">
                  @{reply?.name?.replace(/\s+/g, "").toLowerCase()}
                </h3>
                <p className="text-xs text-gray-500">
                  {formatDistanceToNow(new Date(reply?.timestamp))} ago
                </p>
              </div>
              <div className="flex items-center">
                {reply.parentReplyName?<p className="text-blue-500 mr-2 text-xs">
                  @{reply?.parentReplyName?.replace(/\s+/g, "").toLowerCase()}
                </p>:null}
                <p className="text-gray-600 font-">{reply?.replyText}</p>
              </div>
              <div className="flexitems-center space-x-4 mt-2">
                <button
                  className="text-blue-600"
                  onClick={() => handleToggleLike(reply?.id, true)}
                >
                  👍 {reply?.likes || 0}
                </button>
                <button
                  className="text-red-600"
                  onClick={() => handleToggleDislike(reply?.id, false)}
                >
                  👎 {reply?.dislikes || 0}
                </button>
                <button
                  className="pl-2 text-xs font-semibold"
                  onClick={() => setActiveReplyId(reply?.id)}
                >
                  Reply
                </button>
              </div>
              {activeReplyId === reply?.id && (
                <div>
                  <textarea
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder="Add a public reply..."
                    className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-100 text-sm text-gray-800 shadow-sm resize-none transition-all duration-200 ease-in-out hover:bg-gray-50"
                    rows="2"
                  />
                  <button
                    onClick={handleReplySubmit}
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
              <ReplySection
                reviewReplyId={reply?.id}
                id={id}
                userId={userId}
                name={user?.displayName}
                parentId={reply?.id}
                parentName={reply?.name}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ReplySection;
