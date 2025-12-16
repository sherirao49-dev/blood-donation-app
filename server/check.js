const dotenv = require("dotenv");
dotenv.config();

const apiKey = process.env.GEMINI_API_KEY;

console.log("Checking API Key:", apiKey ? "Key Found (starts with " + apiKey.substring(0, 5) + "...)" : "❌ NO KEY FOUND");

async function checkModels() {
  // We use the raw URL to ask Google what models are available for your specific key
  const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (data.error) {
        console.log("\n❌ GOOGLE API ERROR:");
        console.log(data.error.message);
    } else {
        console.log("\n✅ AVAILABLE MODELS FOR YOU:");
        // List all models that support 'generateContent'
        const models = data.models
            .filter(m => m.supportedGenerationMethods.includes("generateContent"))
            .map(m => m.name.replace("models/", ""));

        console.log(models.join("\n"));
    }
  } catch (err) {
    console.log("Network Error:", err);
  }
}

checkModels();