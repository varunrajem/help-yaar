// src/pages/Login.jsx
import React, { useState } from "react";
import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "../firebase";
import { useNavigate, Link } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      alert("Logged in successfully!");
      navigate("/");
    } catch (error) {
      alert(error.message);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      alert("Google login successful!");
      navigate("/");
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="h-full bg-gradient-to-tl from-green-400 to-indigo-900 w-full py-12 px-4">
      <div className="flex flex-col items-center justify-center">
        <div className="bg-white shadow rounded lg:w-1/3 md:w-1/2 w-full p-10 mt-16">
          <p className="text-2xl font-extrabold leading-6 text-gray-800">
            Login to Help-Yaar
          </p>
          <p className="text-sm mt-4 text-gray-500">
            Don’t have an account?{" "}
            <Link
              to="/signup"
              className="text-gray-800 hover:underline font-medium"
            >
              Sign up here
            </Link>
          </p>

          {/* Google Login */}
          <button
            onClick={handleGoogleLogin}
            className="py-3.5 px-4 border rounded-lg border-gray-700 flex items-center w-full mt-10 justify-center hover:bg-gray-100"
          >
            <img
              src="https://www.svgrepo.com/show/355037/google.svg"
              alt="Google"
              className="w-5 h-5 mr-3"
            />
            <span className="text-base font-medium text-gray-700">
              Continue with Google
            </span>
          </button>

          {/* Divider */}
          <div className="w-full flex items-center justify-between py-5">
            <hr className="w-full bg-gray-400" />
            <p className="text-base font-medium leading-4 px-2.5 text-gray-400">
              OR
            </p>
            <hr className="w-full bg-gray-400" />
          </div>

          {/* Email + Password Form */}
          <form onSubmit={handleLogin}>
            <div>
              <label className="text-sm font-medium text-gray-800">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-gray-200 border rounded text-sm py-3 w-full pl-3 mt-2"
                placeholder="Enter your email"
              />
            </div>

            <div className="mt-6 w-full">
              <label className="text-sm font-medium text-gray-800">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-gray-200 border rounded text-sm py-3 w-full pl-3 mt-2"
                placeholder="Enter your password"
              />
            </div>

            <div className="mt-8">
              <button
                type="submit"
                className="bg-indigo-700 text-white font-semibold py-3 rounded w-full hover:bg-indigo-600"
              >
                Sign In
              </button>
            </div>

            <p className="mt-3 text-sm text-gray-600 text-center hover:underline cursor-pointer">
              Forgot Password?
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
