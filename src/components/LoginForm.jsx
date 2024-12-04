import React, { useState } from "react";
import {
  createUserWithEmailAndPassword,
  getAuth,
  updateProfile,
  signInWithEmailAndPassword
} from "firebase/auth";
import { app } from "../firebase";
import { useDispatch } from "react-redux";
import { addUser } from "../store/slices/userSlice";


const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [isLogin, setIsLogin] = useState(true);
  const [loginError,setLoginError] = useState(" ")
  const [signUpError,setSignUpError] = useState(" ")

  const dispatch = useDispatch()
  const auth = getAuth(app);

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  const handleIsLogin = () => {
    setLoginError(" ")
    setSignUpError(" ")
    setIsLogin(!isLogin);
  };

  const createUser = () => {
    if(name === ""){
        setSignUpError("enter the name")
        return
    }
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed up
        const user = userCredential.user;
        // Update the user's display name
        updateProfile(user, {
          displayName: name,
        })
          .then(() => {
            const {uid,displayName,email} = user;
            dispatch(addUser({ uid, email, displayName }))
          })
          .catch((error) => {
            console.error("Error updating profile:", error.message);
          });
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        setSignUpError(errorCode)
        // ..
      });
  };

  const logInUser = () => {
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in
        const user = userCredential.user;
        const {uid,displayName,email} = user
        dispatch(addUser({uid,displayName,email}))
        // ...
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        setLoginError(errorCode)
      });
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-200">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">
          {isLogin ? "Login" : "Sign Up"}
        </h2>
        <form onSubmit={handleSubmit}>
          {/* Name Input */}
          {!isLogin && (
            <div className="mb-4">
              <label htmlFor="name" className="block text-gray-600">
                Name
              </label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
                placeholder="Enter your name"
              />
            </div>
          )}

          {/* Email Input */}
          <div className="mb-4">
            <label htmlFor="email" className="block text-black">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
              placeholder="Enter your email"
            />
          </div>

          {/* Password Input */}
          <div className="mb-4">
            <label htmlFor="password" className="block text-gray-600">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
              placeholder="Enter your password"
            />
          </div>
          {loginError ? <p className="text-red-500 mb-2" >{loginError}</p> : null}
          {signUpError ? <p className="text-red-500 mb-2" >{signUpError}</p> : null}
          {/* Submit Button */}

          {isLogin ? (
            <button
              onClick={logInUser}
              type="submit"
              className="w-full bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 focus:outline-none"
            >
              Login{" "}
            </button>
          ) : (
            <button
              onClick={createUser}
              type="submit"
              className="w-full bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 focus:outline-none"
            >
              Sign Up
            </button>
          )}
        </form>

        {/* Toggle Login/Sign Up */}
        <p className="mt-4 text-center text-gray-600">
          {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
          <button
            onClick={handleIsLogin}
            className="text-blue-600 hover:underline"
          >
            {isLogin ? "Sign up" : "Login"}
          </button>
        </p>
      </div>
    </div>
  );
};

export default LoginForm;
