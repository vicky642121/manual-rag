const axios = require("axios");
const dotenv = require("dotenv");
dotenv.config();

async function generateEmbedding(text) {
  const response = await axios.post(
    `${process.env.OPENROUTER_BASE_URL}/embeddings`,
    {
      input: text,
      model: process.env.EMBEDDING_MODEL,
    },
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
      },
    },
  );

  return response.data.data[0].embedding;
}

module.exports = { generateEmbedding };