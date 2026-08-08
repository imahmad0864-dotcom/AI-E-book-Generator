import { useState } from "react"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"

import api from "../services/api";

function buildOutlineMarkdown(outline) {
    let md = `# ${outline.title}\n\n## Introduction\n${outline.introduction}\n\n`;

    outline.chapters.forEach((chapter) => {
        md += `## Chapter ${chapter.chapterNo}: ${chapter.chapterTitle}\n`;
        (chapter.points || []).forEach((point) => {
            md += `* ${point}\n`;
        });
        md += `\n`;
    });

    md += `## Conclusion\n${outline.conclusion}\n`;

    return md;
}

export default function Outline({outline, formData, setChapters, handleStep}){
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")

    if (!outline) {
        return <p>No outline yet. Please go back and fill in the book details.</p>
    }

    async function generateChapters() {
        setLoading(true)
        setError("")
        try {
            const res = await api.post('/api/chapters', { form: formData, outline });
            setChapters(res.data.chapters)
            handleStep()
        } catch (err) {
            setError("Couldn't generate the chapters. Please try again.")
        } finally {
            setLoading(false)
        }
    }

    return(
        <div className="outline-page" style={{display: 'flex', flexDirection: 'column', gap: '24px'}} >
            <div className="outline-text">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {buildOutlineMarkdown(outline)}
                </ReactMarkdown>
            </div>

            {error && <p className="error">{error}</p>}

            <button style={{maxWidth: '400px', alignSelf: 'center'}} onClick={generateChapters} disabled={loading} >
                {loading ? "Generating chapters..." : "Generate Chapters"}
            </button>
        </div>
    )
}
