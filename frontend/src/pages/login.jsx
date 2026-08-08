// ==================== React Imports ====================
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

// ==================== Services ====================
import api from "../services/api";

// ==================== Assets & Styles ====================
import "../Styles/auth-styles.css";
import logo from "../assets/logo.png";

export default function Login() {

    // ==================== State ====================

    // Stores login form inputs
    const [formData, setFormData] = useState({
        email: "",
        password: ""
    });

    // React Router navigation
    const navigate = useNavigate();


    // ==================== Event Handlers ====================

    // Updates the corresponding form field
    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prevData) => ({
            ...prevData,
            [name]: value
        }));
    };


    // Sends login credentials to the backend
    async function loginUser(form) {
        const { email, password } = form;

        const response = await api.post("/api/auth/login", {
            email,
            password
        });

        // Redirect after successful login
        if (response.data.success) {
            localStorage.setItem("token", response.data.token);
            navigate("/dashboard");
        }
    }


    // Handles form submission
    const handleSubmit = (e) => {
        e.preventDefault();

        loginUser(formData);
    };


    // ==================== JSX ====================

    return (
        <div className="auth-container">
            <div className="auth-card">

                {/* Logo */}
                <div className="auth-logo">
                    <img src={logo} alt="Book AI Logo" />

                    <div className="logo-text">
                        <h1>Book AI</h1>
                        <p>AI e-book generator</p>
                    </div>
                </div>

                {/* Login Form */}
                <div className="auth-hero">

                    <h2>Welcome Back!</h2>
                    <p>Sign in to your account</p>

                    <form
                        className="auth-form"
                        onSubmit={handleSubmit}
                    >

                        {/* Email */}
                        <div className="input-group">
                            <label htmlFor="email">Email</label>

                            <input
                                id="email"
                                type="email"
                                name="email"
                                placeholder="Enter your email"
                                value={formData.email}
                                onChange={handleChange}
                            />
                        </div>

                        {/* Password */}
                        <div className="input-group">
                            <label htmlFor="password">Password</label>

                            <input
                                id="password"
                                type="password"
                                name="password"
                                placeholder="Enter your password"
                                value={formData.password}
                                onChange={handleChange}
                            />
                        </div>

                        <a href="#" className="forgot-password">
                            Forgot Password?
                        </a>

                        <button type="submit">
                            Login
                        </button>

                        <p className="signup-text">
                            Don't have an account? <Link to="/signup">Sign Up</Link>
                        </p>

                    </form>

                </div>
            </div>
        </div>
    );
}