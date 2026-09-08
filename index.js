require("dotenv").config();

const { generateAnswer } = require("./src/llm/generate.js");
const { extractTextFromPDF } = require("./src/ingestion/parser.js");
const { cleanText } = require("./src/ingestion/cleaner.js");
const { CreateChunker } = require("./src/ingestion/chunker.js");
const { generateEmbedding } = require("./src/ingestion/embedding.js");
const { vectorStore } = require("./src/ingestion/vectorStore.js");
const { createCollection } = require("./src/config/createCollection.js");
const qdrant = require("./src/config/qdrant.js");

async function ingestion() {
   const text = await extractTextFromPDF("./documents/Employee_Leave_Policy_2026.pdf");
   const cleanedText = cleanText(text);
   const chunks = CreateChunker(cleanedText);

   await createCollection();

   await Promise.all(chunks.map(async (chunk,i) => {
      console.log(`Generating embedding for chunk ${i + 1}`);
      const vectors = await generateEmbedding(chunk);
      await vectorStore({
         id: `${i + 1}`,
         vector: vectors,
         text: chunk,
         metadata: {
            source: "Employee_Leave_Policy_2026.pdf",
            document_id:"leave_policy_2026",
            chunkIndex: i,
            version: "1.0"
         }
      });
   })); 

   //we used the promise.all so concurrently generate instead of using  a loop and waiting for each one to finish before starting the next one.
   console.log("Document ingestion completed!");

   //below is only check if the collection is created and the points are inserted successfully.
   const result = await qdrant.qdrantClient.scroll("employee_documents", {
      limit: 10,
      with_payload: true,
      with_vector: true
   });
   console.log("Collection created");
   console.log("Number of points:", result.points);

}

// ingestion(); 
//user search