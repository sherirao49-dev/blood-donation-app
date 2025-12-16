const { GoogleGenerativeAI } = require("@google/generative-ai");
const db = require("../db");
require("dotenv").config();

// Initialize Gemini with your API Key
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

exports.chatWithAI = async (req, res) => {
  const { userMessage } = req.body;

  try {
    // 1. Fetch all active blood requests from the database
    const requests = await db.query(
      "SELECT blood_type, hospital_name, city, urgency_level, patient_name FROM blood_requests WHERE status = 'open'"
    );
    
    // 2. Format the data for the AI to read
    const requestList = requests.rows.map(
      (r) =>
        `- ${r.urgency_level} priority: Need ${r.blood_type} for patient ${r.patient_name} at ${r.hospital_name} in ${r.city}`
    ).join("\n");

    // 3. Create the instruction prompt
    const prompt = `
      You are a helpful medical assistant for a blood donation app called LifeFlow.
      
      Here are the current ACTIVE blood requests in our system:
      ${requestList}

      User Query: "${userMessage}"

      Instructions:
      - If the user asks for blood, check the list above and tell them if there is a match.
      - If there is no match, advise them to create a request.
      - Keep answers short, empathetic, and professional.
    `;

    // 4. Initialize the Model
    // UPDATED: Using 'gemini-flash-latest' because it was explicitly listed in your allowed models
    const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });

    // 5. Generate Response
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // 6. Send back to Frontend
    res.json({ botResponse: text });

  } catch (err) {
    console.error("AI Error:", err);
    res.status(500).json({ message: "AI is currently busy. Please try again in a moment." });
  }
};