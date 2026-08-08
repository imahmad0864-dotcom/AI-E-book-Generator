// ==================== React Imports ====================
import { useState } from "react";
import { useNavigate } from "react-router-dom";

// ==================== Services ====================
import api from "../services/api";

// ==================== Assets & Styles ====================
import "../Styles/auth-styles.css";
import logo from "../assets/logo.png";

export default function Signup() {

    // ==================== State ====================

    // Stores all form input values
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        cPassword: ""
    });

    // Controls the password mismatch message
    const [notMatch, setNotMatch] = useState(false);

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

        // Hide the mismatch message while the user types
        if (notMatch) {
            setNotMatch(false);
        }
    };


    // Sends signup data to the backend
    async function handleSignup(form) {
        const { name, email, password } = form;

        const response = await api.post("/api/auth/signup", {
            name,
            email,
            password
        });

        // Redirect after successful signup
        if (response.data.success) {
            navigate("/dashboard");
        }
    }


    // Handles form submission
    const handleSubmit = (e) => {
        e.preventDefault();

        // Prevent submission if passwords don't match
        if (formData.password !== formData.cPassword) {
            setNotMatch(true);
            return;
        }

        handleSignup(formData);
    };


    // ==================== JSX ====================

    return (
        <div className="auth-container">
            <div className="auth-card">

                {/* Logo */}
                <div className="auth-logo">
                    <img src={logo} alt="Book AI logo" />

                    <div className="logo-text">
                        <h1>Book AI</h1>
                        <p>AI e-book generator</p>
                    </div>
                </div>

                {/* Signup Form */}
                <div className="auth-hero">

                    <h1>Welcome</h1>
                    <p>Sign up to create your account</p>

                    <form className="auth-form" onSubmit={handleSubmit}>

                        {/* Name */}
                        <div className="input-group">
                            <label htmlFor="name">Name</label>

                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                            />
                        </div>

                        {/* Email */}
                        <div className="input-group">
                            <label htmlFor="email">Email</label>

                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                            />
                        </div>

                        {/* Password */}
                        <div className="input-group">
                            <label htmlFor="password">Password</label>

                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                            />
                        </div>

                        {/* Confirm Password */}
                        <div className="input-group">
                            <label htmlFor="cPassword">
                                Confirm Password
                            </label>

                            <input
                                type="password"
                                name="cPassword"
                                value={formData.cPassword}
                                onChange={handleChange}
                            />

                            {notMatch && (
                                <p className="error">
                                    Passwords do not match
                                </p>
                            )}
                        </div>

                        <button
                            className="signup-btn"
                            type="submit"
                        >
                            Sign up
                        </button>

                    </form>

                </div>
            </div>
        </div>
    );
}