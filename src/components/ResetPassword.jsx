import React, { useState } from "react";
import { toast } from "react-toastify";

const ResetPassword = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const BASE_URL = "http://127.0.0.1:8990/api";

  const resetPassword = async () => {
    debugger;
    try {
      const response = await fetch(`${BASE_URL}/user/auth/password-reset`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        toast.success("Password reset successfully!");

        setTimeout(() => {
          window.location.href = "/";
        }, 1000);
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || "Failed to reset password");
      }
    } catch (error) {
      toast.error("Failed to reset password");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(email, password, confirmPassword);

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    await resetPassword();
  };

  return (
    <div className="max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-4">Reset Password</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="email" className="block mb-1">
            Email
          </label>
          <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full px-3 py-2 border rounded" />
        </div>
        <div>
          <label htmlFor="password" className="block mb-1">
            New Password
          </label>
          <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="w-full px-3 py-2 border rounded" />
        </div>
        <div>
          <label htmlFor="confirmPassword" className="block mb-1">
            Confirm Password
          </label>
          <input type="password" id="confirmPassword" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required className="w-full px-3 py-2 border rounded" />
        </div>
        <button type="submit" className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600">
          Reset Password
        </button>
      </form>
    </div>
  );
};

export default ResetPassword;
