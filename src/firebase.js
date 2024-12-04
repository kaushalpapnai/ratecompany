import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDDzbrqq8TzFDl0kfOphWHoGG6qH2btTPE",
  authDomain: "ratecompany-ba9b8.firebaseapp.com",
  projectId: "ratecompany-ba9b8",
  storageBucket: "ratecompany-ba9b8.appspot.com",
  messagingSenderId: "581174957234",
  appId: "1:581174957234:web:9eb4af275adeb8003ba5ab",
  measurementId: "G-E061HPKSTX",
  databaseURL: "https://ratecompany-ba9b8-default-rtdb.firebaseio.com",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

// Optional: Enable analytics if set up
export const analytics = getAnalytics(app);

export const auth = getAuth()
