const axios = require("axios");
const dotenv = require("dotenv");

dotenv.config();

async function generateAnswer(prompt) {

    const response = await axios.post(`${process.env.OPENROUTER_BASE_URL}/chat/completions`, {
        model: process.env.LLM_MODEL,
        messages: [
            {
                role: "user",
                content: prompt,
            },
        ],
    }, {
        headers: {
            "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
            "Content-Type": "application/json",
        },
    })

    return response.data.choices[0].message.content;
}

module.exports = { generateAnswer };