import { useState } from "react";

import api from "../services/api";

import "../Styles/new-form.css"

export default function NewForm({formData,setFormData,setOutline,handleStep}){
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")

    const dropdowns = [
        {
            label: "Purpose",
            id: "purpose",
            options: ['Entertain', "Education" , "Fiction"]
        },
        {
            label: "Tone",
            id: "tone",
            options: ["Beginner","Professional","Friendly"]
        },
        {
            label: "Target Audience",
            id: "audience",
            options: ["Students", "Developer", "Childrens", "Professionals", "Enterprenuers"]
        },
        {
            label: "Writing style",
            id: "style",
            options: ["Storytelling", "Academic", "Conversational", "Technical", "Inspirational"]
        },
        {
            label: "Language",
            id: "language",
            options: ["English"]
        },
        {
            label: "Length per Chapter in words",
            id: "words",
            options: [500,1000,1500]
        }
    ]

    const handleChange = (e) => {
        const {name,value} = e.target
        setFormData((prev) => ({
            ...prev,
            [name]: value
        }))
    }

    async function sendData(form) {
        setLoading(true)
        setError("")
        try {
            const res = await api.post('/api/create', { ...form });
            setOutline(res.data.outline)
            handleStep()
        } catch (err) {
            setError("Couldn't generate the outline. Please try again.")
        } finally {
            setLoading(false)
        }
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!formData.title || !formData.about) {
            setError("Please fill in the title and description.")
            return;
        }
        sendData(formData);
    }
    return(
        <form className="new-form-container" onSubmit={handleSubmit}>

            <h2>Book information</h2>

            <div className="new-form-group">
                <label htmlFor="title">Title / Topic</label>
                <input id="title" name="title" type="text" value={formData.title} onChange={handleChange} placeholder="Example: Learn react in 30 days" />
            </div>

            <div className="new-form-group">
                <label htmlFor="about">What is this book about</label>
                <textarea name="about" id="about" rows={4} value={formData.about} onChange={handleChange} placeholder="Example: An efficient way to get hands on practice on react within 30 days. Cover all required topics for beginner to advanced" />
            </div>

            {dropdowns.map((item) => (
                <div key={item.id} className="drop-downs">
                    <label htmlFor={item.id} >{item.label}</label>
                    <select value={formData[item.id]} name={item.id} onChange={handleChange} >
                        {item.options.map((option) => (
                            <option key={option} value={option}>{option}</option>
                        ))}
                    </select>
                </div>
            ))}

            {error && <p className="error">{error}</p>}

            <button className="new-form-button" type="submit" disabled={loading} >
                {loading ? "Generating outline..." : "Generate outline"}
            </button>
        </form>
    )
}
