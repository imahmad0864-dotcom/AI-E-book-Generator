const ai = require("../config/gemini");

// keeping this fixed and simple: the whole flow is built around exactly 3 chapters
const CHAPTER_COUNT = 3;

// Gemini sometimes wraps JSON in ```json fences even when told not to - strip that off
function parseJsonResponse(text) {
    const cleaned = text.replace(/```json/gi, "").replace(/```/g, "").trim();
    return JSON.parse(cleaned);
}

// Step 1: turn the book details form into a 3-chapter outline
const generateOutline = async (req, res) => {
    const form = req.body;

    if (!form.title || !form.about) {
        return res.status(400).json({ success: false, message: "title and about are required" });
    }

    const prompt = `
    You are a professional e-book writer.

    Create an outline for an e-book with these details:
    Title / Topic: ${form.title}
    About: ${form.about}
    Target Audience: ${form.audience}
    Purpose: ${form.purpose}
    Writing Style: ${form.style}
    Tone: ${form.tone}
    Language: ${form.language}

    The outline must contain EXACTLY ${CHAPTER_COUNT} chapters. No more, no less.

    Respond with ONLY valid JSON and nothing else (no markdown, no code fences, no commentary).
    Use exactly this structure:
    {
      "title": "book title",
      "introduction": "2-3 sentence introduction to the book",
      "chapters": [
        { "chapterNo": 1, "chapterTitle": "chapter title", "points": ["point 1", "point 2", "point 3"] }
      ],
      "conclusion": "2-3 sentence closing summary"
    }
    `;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-3.5-flash",
            contents: prompt
        });

        const outline = parseJsonResponse(response.text);

        // enforce the chapter cap even if the model ignores the instruction
        outline.chapters = (outline.chapters || []).slice(0, CHAPTER_COUNT);

        return res.status(200).json({ success: true, outline });
    } catch (error) {
        console.log("outline generation error", error);
        return res.status(500).json({ success: false, message: "Failed to generate outline. Please try again." });
    }
};

// Step 2: turn the outline into full chapter content (max 3 chapters)
const generateChapters = async (req, res) => {
    const { form, outline } = req.body;

    if (!outline || !Array.isArray(outline.chapters) || outline.chapters.length === 0) {
        return res.status(400).json({ success: false, message: "outline is required" });
    }

    const chapterList = outline.chapters
        .slice(0, CHAPTER_COUNT)
        .map((c) => `Chapter ${c.chapterNo}: ${c.chapterTitle}\n${(c.points || []).map((p) => `- ${p}`).join("\n")}`)
        .join("\n\n");

    const prompt = `
    You are a professional e-book writer.

    Write the full content for EXACTLY ${CHAPTER_COUNT} chapters of an e-book, based on this outline.

    Book Title: ${outline.title}
    Target Audience: ${form.audience}
    Purpose: ${form.purpose}
    Writing Style: ${form.style}
    Tone: ${form.tone}
    Language: ${form.language}
    Approximate word count per chapter: ${form.words}

    Outline:
    ${chapterList}

    Each chapter's "content" field must be well formatted markdown (headings, paragraphs, and lists where useful).

    Respond with ONLY valid JSON and nothing else (no markdown, no code fences, no commentary).
    Use exactly this structure:
    {
      "chapters": [
        { "chapterNo": 1, "chapterTitle": "chapter title", "content": "full chapter content in markdown" }
      ]
    }
    `;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-3.5-flash",
            contents: prompt
        });

        const data = parseJsonResponse(response.text);
        const chapters = (data.chapters || []).slice(0, CHAPTER_COUNT);

        return res.status(200).json({ success: true, chapters });
    } catch (error) {
        console.log("chapters generation error", error);
        return res.status(500).json({ success: false, message: "Failed to generate chapters. Please try again." });
    }
};

module.exports = { generateOutline, generateChapters };
