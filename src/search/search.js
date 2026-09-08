const { generateEmbedding } = require("../ingestion/embedding.js");
const { searchDocument } = require("./vectorSearch.js");
const { generateAnswer } = require("../llm/generate.js");

const buildContext = (results) => {
    console.log("results",results);
  return results.points
    .map((result, index) => {
      return `SOURCE ${index + 1} ${result.payload.text}`;
    })
    .join("\n");
};

const userSearch = async () => {
  const userText = process.argv[2];
  console.log("userText", userText);

  const userEmbedding = await generateEmbedding(userText);
  const searchResults = await searchDocument(userEmbedding);
  const context = await buildContext(searchResults);

  console.log("4. Building LLM prompt...");

  const prompt = `You are an HR policy assistant.

Answer the user's question using only
the provided context.

Do not invent information.

If the answer is not available in the context,
say that you do not have enough information. 

CONTEXT:${context}

USER QUESTION:${userText}`;

  const answer = await generateAnswer(prompt);

  console.log("\nFINAL ANSWER:\n");

  console.log(answer);
};

userSearch();
