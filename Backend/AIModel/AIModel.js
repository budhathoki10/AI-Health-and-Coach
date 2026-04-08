const { GoogleGenerativeAI } = require("@google/generative-ai");

const AIModel = async (Prompt) => {
  try {
    console.log("API key", process.env.GOOGLE_API);
    const ai = new GoogleGenerativeAI(process.env.GOOGLE_API);

    // Use gemini-2.5-flash-lite (supports structured outputs)
    const model = ai.getGenerativeModel({ model: "gemini-2.5-flash-lite" });

    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: Prompt }] }],
      generationConfig: {
        responseMimeType: "application/json" // force JSON output
      }
    });

    const rawText = result.response.text();
    let parsed;

    try {
      parsed = JSON.parse(rawText);
    } catch (err) {
      console.error("Failed to parse AI response:", err.message);
      console.error("Raw response was:", rawText);
      return null; // return null if parsing fails
    }

    return parsed;

  } catch (error) {
    console.error("AIModel error:", error.message);
    throw error;
  }
};

module.exports = AIModel;
