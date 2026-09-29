const { GoogleGenerativeAI } = require('@google/generative-ai');

// Initialize the GoogleGenerativeAI client
const getClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'your_google_gemini_api_key_here') {
    throw new Error('Gemini API key is not configured. Please add GEMINI_API_KEY to your .env file.');
  }
  return new GoogleGenerativeAI(apiKey);
};

/**
 * Generates a concise answer for a user's question.
 * @param {string} question 
 * @returns {Promise<string>}
 */
const generateAnswer = async (question) => {
  try {
    const ai = getClient();
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `You are a helpful assistant. Provide a clear, concise, and direct answer to the following question. Do not include introductory text like "Sure, here is the answer" or markdown formatting. Just return the answer itself.

Question: ${question}`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    if (!text) {
      throw new Error('No response text received from Gemini API');
    }

    return text.trim();
  } catch (error) {
    console.error('Error in geminiService.generateAnswer:', error);
    throw new Error(`AI Answer Generation failed: ${error.message}`);
  }
};

/**
 * Generates a single FAQ question and answer pair for a topic.
 * @param {string} topic 
 * @returns {Promise<{question: string, answer: string}>}
 */
const generateFAQ = async (topic) => {
  try {
    const ai = getClient();
    const model = ai.getGenerativeModel({ 
      model: 'gemini-1.5-flash',
      generationConfig: {
        responseMimeType: 'application/json',
      }
    });

    const prompt = `Generate a single frequently asked question (FAQ) and its comprehensive answer regarding the topic: "${topic}".
Return ONLY a valid JSON object matching this schema:
{
  "question": "A clear, common question that a user would ask about the topic.",
  "answer": "A detailed, helpful, and accurate answer explaining the question."
}`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    if (!text) {
      throw new Error('No response received from Gemini API');
    }

    // Parse the structured JSON response
    const faqPair = JSON.parse(text);
    return faqPair;
  } catch (error) {
    console.error('Error in geminiService.generateFAQ:', error);
    throw new Error(`AI FAQ Generation failed: ${error.message}`);
  }
};

module.exports = {
  generateAnswer,
  generateFAQ,
};