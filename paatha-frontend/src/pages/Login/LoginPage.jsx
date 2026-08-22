import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { setToken } from "../../utils/auth";
import { BACKEND_URL } from "../../config";
import { FiUser, FiLock } from "react-icons/fi";
import { FaSpinner } from "react-icons/fa";
import { IoShieldCheckmarkOutline } from "react-icons/io5";

const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const formData = new URLSearchParams();
      formData.append("username", username);
      formData.append("password", password);

      const response = await fetch(`${BACKEND_URL}/api/v1/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        setToken(data.access_token);
        navigate("/creator");
      } else {
        const errorData = await response.json();
        setError(errorData.detail || "Invalid username or password.");
      }
    } catch (err) {
      setError("Unable to connect. Please check if backend is running.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[100dvh] w-full bg-gradient-to-br from-slate-50 via-slate-100 to-emerald-50/60 px-4 select-none">
      <div className="w-full max-w-md bg-white/80 backdrop-blur-xl border border-slate-200/80 shadow-2xl rounded-3xl p-8 md:p-10 transition-all duration-300">
        
        {/* Header/Logo Section */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 bg-emerald-50 border border-emerald-100 rounded-2xl flex items-center justify-center mb-4 text-emerald-600 shadow-sm">
            <IoShieldCheckmarkOutline className="w-9 h-9 animate-pulse" />
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-800 mb-1.5 text-center">
            Paadha Admin Panel
          </h2>
          <p className="text-xs text-slate-500 font-medium text-center">
            Enter credentials to manage indoor navigation layout
          </p>
        </div>

        {/* Error Callout */}
        {error && (
          <div className="mb-6 p-3.5 bg-rose-50 border border-rose-100 text-rose-800 text-xs rounded-2xl font-medium flex items-center gap-2.5 animate-slide-in">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0"></span>
            <span>{error}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-5">
          
          {/* Username Field */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold tracking-wider text-slate-500 uppercase">
              Username or Email
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400">
                <FiUser className="w-4 h-4" />
              </span>
              <input
                type="text"
                placeholder="admin"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                disabled={loading}
                className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-2xl focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-sm text-slate-800 placeholder-slate-400 transition-all outline-none shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>
          </div>

          {/* Password Field */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold tracking-wider text-slate-500 uppercase">
              Password
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400">
                <FiLock className="w-4 h-4" />
              </span>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
                className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-2xl focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-sm text-slate-800 placeholder-slate-400 transition-all outline-none shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold rounded-2xl shadow-lg shadow-emerald-600/10 active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed mt-2"
          >
            {loading ? (
              <>
                <FaSpinner className="w-4 h-4 animate-spin" />
                <span>Verifying credentials...</span>
              </>
            ) : (
              <span>Access Admin Dashboard</span>
            )}
          </button>

        </form>

      </div>
    </div>
  );
};

export default LoginPage;
