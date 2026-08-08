import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import { useState, useRef } from "react"
import html2pdf from "html2pdf.js"

import "../Styles/chapters.css"

export default function Chapters({chapters}){

    const [index, setIndex] = useState(0)
    const [exporting, setExporting] = useState(false)
    const pdfRef = useRef(null)

    if (!chapters || chapters.length === 0) {
        return <p>No chapters yet. Please go back and generate the outline first.</p>
    }

    const currentChapter = chapters[index]

    const prevChap = () => setIndex((i) => Math.max(0, i - 1))
    const nextChap = () => setIndex((i) => Math.min(chapters.length - 1, i + 1))

    async function downloadPDF() {
        setExporting(true)
        await html2pdf()
            .set({
                margin: 10,
                filename: "ebook.pdf",
                html2canvas: { scale: 2 },
                jsPDF: { unit: "mm", format: "a4", orientation: "portrait" }
            })
            .from(pdfRef.current)
            .save()
        setExporting(false)
    }

    return(
        <div className="chapter-page">

            <div className="chap-btns-div">
                <button className="chap-btn" onClick={prevChap} disabled={index === 0}>Previous Chapter</button>
                <p>Chapter {index + 1} of {chapters.length}: {currentChapter.chapterTitle}</p>
                <button className="chap-btn" onClick={nextChap} disabled={index === chapters.length - 1}>Next Chapter</button>
            </div>

            <div className="chapter-text">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {currentChapter.content}
                </ReactMarkdown>
            </div>

            <button style={{maxWidth: '400px', alignSelf: 'center'}} onClick={downloadPDF} disabled={exporting}>
                {exporting ? "Preparing PDF..." : "Download PDF"}
            </button>

            {/* Hidden container with ALL chapters — this is what actually becomes the PDF */}
            <div style={{ position: "absolute", left: "-9999px", top: 0 }}>
                <div ref={pdfRef} style={{ width: "700px", padding: "20px" }}>
                    {chapters.map((chapter) => (
                        <div key={chapter.chapterNo} style={{ pageBreakAfter: "always" }}>
                            <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                {`## Chapter ${chapter.chapterNo}: ${chapter.chapterTitle}\n\n${chapter.content}`}
                            </ReactMarkdown>
                        </div>
                    ))}
                </div>
            </div>

        </div>
    )
}