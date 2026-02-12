import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import CrButton from "../components/CrButton";
import bgImage from "../assets/login.png";
import { Helmet } from "react-helmet-async";
import { clearAuth, getAuth, isTokenExpired, setAuth } from "../utils/auth";

const Login = () => {
  const navigate = useNavigate();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  //  useEffect(() => {
  //   document.title = "Login - Digital Minds";
  // }, []);

  useEffect(() => {
    try {
      const existingAuth = getAuth();
      if (!existingAuth) return;
      if (isTokenExpired(existingAuth)) {
        clearAuth();
        return;
      }
      if (existingAuth?.type === "admin") {
        navigate("/admin/quizzes");
      } else if (existingAuth?.type === "user") {
        navigate("/user/home");
      }
    } catch {}
  }, [navigate]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const isEmail = identifier.includes("@");
      const endpoint = isEmail ? "admin" : "user";
      const payload = isEmail
        ? { email: identifier, password }
        : { username: identifier, password };

      const response = await fetch(
        `${process.env.REACT_APP_API_BASE_URL || "http://localhost:4000"}/api/${endpoint}/login`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        setError(data?.message || "Login failed. Please try again.");
        return;
      }

      setAuth({
        type: endpoint,
        token: data.token,
        expiresAt: data.expiresAt,
        ...data,
      });

      if (endpoint === "admin") {
        navigate("/admin/quizzes");
      } else {
        navigate("/user/home");
      }
    } catch (err) {
      setError("Unable to reach the server. Check your connection.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Login - Digital Minds</title>
      </Helmet>
      {/* Main Container */}
      <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden">
        {/* 1. THE IMAGE (Bottom Layer) */}
        <div
          className="fixed inset-0 z-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${bgImage})` }} // Replace with your image path
        ></div>

        {/* 2. THE BLACK SHADOW/OVERLAY (Middle Layer) */}
        <div className="fixed inset-0 z-10 bg-black/50"></div>

        {/* 3. THE FORM (Top Layer) */}
        <div className="relative z-20 w-full max-w-sm mx-4 bg-white rounded-3xl border-8 shadow-2xl overflow-hidden animate-fadeIn">
          {/* Input Area */}
          <form className="p-6 sm:p-8 space-y-4" onSubmit={handleSubmit}>
            {/* Email or Username Field */}
            <div className="space-y-1">
              <label className="text-xs sm:text-sm font-luckiest text-[#C21A1A] uppercase ml-2">
                Username
              </label>
              <input
                type="text"
                placeholder="USERNAME..."
                value={identifier}
                onChange={(event) => setIdentifier(event.target.value)}
                className="text-black w-full p-3 bg-gray-100 border-4 border-gray-300 rounded-2xl text-center font-luckiest text-base sm:text-base focus:border-cr-blue focus:outline-none transition-all placeholder:opacity-30"
                required
              />
            </div>

            {/* Password Field */}
            <div className="space-y-1">
              <label className="text-xs sm:text-sm font-luckiest text-[#C21A1A] uppercase ml-2">
                Password
              </label>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="text-black w-full p-3 bg-gray-100 border-4 border-gray-300 rounded-2xl text-center font-luckiest text-base sm:text-base focus:border-cr-blue focus:outline-none transition-all placeholder:opacity-30"
                required
              />
            </div>

            {error && (
              <p className="text-center text-xs text-red-600 font-sans">
                {error}
              </p>
            )}

            <div className="flex justify-center pt-2">
              <CrButton
                color="blue"
                type="submit"
                disabled={isSubmitting}
                className="w-full sm:w-auto"
              >
                {isSubmitting ? "Logging in..." : "Login"}
              </CrButton>
            </div>
          </form>

          <div className="bg-gray-50 p-4 text-center border-t-2 border-gray-200">
            <p className="text-[10px] text-gray-400 font-sans uppercase">
              Need help? Contact your Clan Leader (Host)
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
