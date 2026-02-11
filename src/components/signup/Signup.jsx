// src/pages/Signup.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Signup() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirm: "",
  });
  const [errors, setErrors] = useState({});
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    validateField(e.target.name, e.target.value);
  };

  const validateField = (field, value) => {
    let error = "";

    if (field === "name") {
      if (!/^[A-Za-z\s]+$/.test(value)) {
        error = "Name must contain only letters";
      }
    }

    if (field === "email") {
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
        error = "Invalid email format";
      }
    }

    if (field === "password") {
      if (!/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/.test(value)) {
        error =
          "Password must be ≥8 chars, include letters, numbers & special characters";
      }
    }

    if (field === "confirm") {
      if (value !== form.password) {
        error = "Passwords do not match";
      }
    }

    setErrors((prev) => ({ ...prev, [field]: error }));
  };

  const sendOtp = () => {
    if (errors.email || !form.email) {
      return setMessage("Enter a valid email first");
    }
    setOtpSent(true);
    setMessage("OTP sent to your email");
  };

  const verifyOtpAndSignup = () => {
    if (!otp) {
      return setMessage("Enter the OTP");
    }

    if (Object.values(errors).some((err) => err)) {
      return setMessage("Fix validation errors first");
    }

    // Assume signup success
    setMessage("Signup successful!");

    // Redirect to login page
    setTimeout(() => {
      navigate("/login");
    }, 1000);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
      <div className="bg-white shadow-2xl rounded-xl p-8 w-full max-w-md">
        <h2 className="text-3xl font-bold text-center text-indigo-700 mb-6">
          Create Account
        </h2>

        <form className="space-y-4">
          {/* Name */}
          <div>
            <input
              name="name"
              type="text"
              placeholder="Full Name"
              value={form.name}
              onChange={handleChange}
              className={`w-full p-3 border rounded-lg focus:outline-none ${
                errors.name ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.name && (
              <p className="text-red-600 text-sm mt-1">{errors.name}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <input
              name="email"
              type="email"
              placeholder="Email Address"
              value={form.email}
              onChange={handleChange}
              onBlur={(e) => validateField("email", e.target.value)}
              className={`w-full p-3 border rounded-lg focus:outline-none ${
                errors.email ? "border-red-500" : "border-gray-300"
              }`}
            />

            {errors.email && form.email && (
              <p className="text-red-600 text-sm mt-1">{errors.email}</p>
            )}

            {form.email && !errors.email && !otpSent && (
              <button
                type="button"
                onClick={sendOtp}
                className="mt-2 w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition"
              >
                Send OTP
              </button>
            )}
          </div>

          {/* OTP */}
          {otpSent && (
            <input
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="w-full p-3 border rounded-lg focus:outline-none border-gray-300"
            />
          )}

          {/* Password */}
          <div>
            <input
              name="password"
              type="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              className={`w-full p-3 border rounded-lg focus:outline-none ${
                errors.password ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.password && (
              <p className="text-red-600 text-sm mt-1">{errors.password}</p>
            )}
          </div>

          {/* Confirm Password */}
          <div>
            <input
              name="confirm"
              type="password"
              placeholder="Confirm Password"
              value={form.confirm}
              onChange={handleChange}
              className={`w-full p-3 border rounded-lg focus:outline-none ${
                errors.confirm ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.confirm && (
              <p className="text-red-600 text-sm mt-1">{errors.confirm}</p>
            )}
          </div>

          {/* Signup Button */}
          <button
            type="button"
            onClick={verifyOtpAndSignup}
            className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition"
          >
            Sign Up
          </button>
        </form>

        <p className="mt-4 text-center text-sm">
          Already have an account?{" "}
          <a href="/login" className="text-indigo-600 hover:underline">
            Login
          </a>
        </p>

        {message && (
          <p className="mt-4 text-center text-sm text-red-600">{message}</p>
        )}
      </div>
    </div>
  );
}

export default Signup;
