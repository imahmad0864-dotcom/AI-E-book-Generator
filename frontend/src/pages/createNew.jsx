import { useState } from "react"

import "../Styles/createNew.css"
import NewForm from "../components/newForm";
import Outline from "../components/outline";
import Chapters from "../components/genChapters";

export default function CreateNew(){

    const [formData , setFormData] = useState({
        title: "",
        about: "",
        purpose: "Entertain",
        tone: "Beginner",
        audience: "Students",
        style: "Storytelling",
        language: "English",
        words: "1000"
    })
    const [step , setStep] = useState(1)
    const [outline, setOutline] = useState(null)
    const [chapters, setChapters] = useState(null)

    const handleStep = () => {
        setStep((s)=> s + 1);
    }

    function pages(step) {
        switch (step) {
            case 1:
                return <NewForm formData={formData} setFormData={setFormData} setOutline={setOutline} handleStep={handleStep}/>
            case 2:
                return <Outline outline={outline} formData={formData} setChapters={setChapters} handleStep={handleStep} />
            case 3:
                return <Chapters chapters={chapters} />
            default:
                return <p>Hello world</p>
        }
    }

    return(

        <div className="new-container">

            <h1 className="new-heading">Create New E-book</h1>

            <div className="new-progress-bar">

                <div className={`new-step ${step === 1 ? "active" : ""}`}>
                    <div className="new-step-number">1</div>
                    <div className="new-step-text">Book details</div>
                </div>

                <div className="arrow">→</div>

                <div className={`new-step ${step === 2 ? "active" : ""}`}>
                    <div className="new-step-number">2</div>
                    <div className="new-step-text">Outline</div>
                </div>

                <div className="arrow">→</div>

                <div className={`new-step ${step === 3 ? "active" : ""}`}>
                    <div className="new-step-number">3</div>
                    <div className="new-step-text">Generate</div>
                </div>

            </div>

            <hr />
            {pages(step)}
        </div>
    )
}
