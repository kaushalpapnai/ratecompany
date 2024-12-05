import React, { useState } from "react";
import {
  createUserWithEmailAndPassword,
  getAuth,
  updateProfile,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { app } from "../firebase";
import { useDispatch } from "react-redux";
import { addUser } from "../store/slices/userSlice";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { ExclamationCircleIcon } from "@heroicons/react/16/solid";
// import { ExclamationCircleIcon } from '@heroicons/react/solid';


const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [isLogin, setIsLogin] = useState(true);
  const [loginError, setLoginError] = useState("");
  const [signUpError, setSignUpError] = useState("");

  const provider = new GoogleAuthProvider();
  const dispatch = useDispatch();
  const auth = getAuth(app);

  // google sign in ------------->
  const logInGoogle = () => {
    signInWithPopup(auth, provider)
      .then((result) => {
        // This gives you a Google Access Token. You can use it to access the Google API.
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential.accessToken;
        // The signed-in user info.
        const user = result.user;
        const { uid, displayName, email } = user;
        dispatch(addUser({ uid, displayName, email }));
        // IdP data available using getAdditionalUserInfo(result)
        // ...
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        setLoginError(errorCode);
        const email = error.customData.email;
        const credential = GoogleAuthProvider.credentialFromError(error);
        // ...
      });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  const handleIsLogin = () => {
    setLoginError("");
    setSignUpError("");
    setIsLogin(!isLogin);
  };

  const createUser = () => {
    setSignUpError("");
    if (name === "") {
      setSignUpError("enter the name");
      return;
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
            const { uid, displayName, email } = user;
            dispatch(addUser({ uid, email, displayName }));
          })
          .catch((error) => {
            console.error("Error updating profile:", error.message);
          });
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        setSignUpError(errorCode);
        // ..
      });
  };

  const logInUser = () => {
    setLoginError("")
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in
        const user = userCredential.user;
        const { uid, displayName, email } = user;
        dispatch(addUser({ uid, displayName, email }));
        // ...
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        setLoginError(errorCode);
      });
  };

  return (
    <div className="flex justify-center items-center h-screen bg-white">
      <div className="bg-white p-8 rounded-lg border border-gray-300 w-full max-w-md">
        <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">
          {isLogin ? "Login" : "Sign Up"}
        </h2>
        {loginError && (
          <p className="text-white text-center p-2 rounded-md mb-2 bg-red-500 flex items-center justify-center">
            <ExclamationCircleIcon className="h-5 w-5 mr-2" />
            {loginError}
          </p>
        )}

        {signUpError && (
          <p className="text-white text-center p-2 rounded-md mb-2 bg-red-500 flex items-center justify-center">
          <ExclamationCircleIcon className="h-5 w-5 mr-2" />
          {signUpError}
        </p>
        )}
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
          <div className="mb-8">
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
          {/* Submit Button */}

          {isLogin ? (
            <button
              onClick={logInUser}
              type="submit"
              className="w-full bg-blue-600 text-white py-3 rounded-full hover:bg-blue-700 focus:outline-none"
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
          <button
            onClick={logInGoogle}
            className="w-full mt-4 bg-white text-gray-800 py-3 rounded-full border border-gray-300 shadow-sm flex items-center justify-center hover:bg-gray-100 focus:outline-none"
          >
            <img
              src="https://w7.pngwing.com/pngs/338/520/png-transparent-g-suite-google-play-google-logo-google-text-logo-cloud-computing-thumbnail.png"
              alt="Google logo"
              className="h-5 w-5 mr-2"
            />
            Log in with Google
          </button>
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
