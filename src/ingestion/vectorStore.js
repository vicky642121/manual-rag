const dotenv = require("dotenv");
const qdrant = require("../config/qdrant");
dotenv.config();

async function vectorStore({id,vector,text, metadata}) {

    await qdrant.qdrantClient.upsert(process.env.QDRANT_COLLECTION, {
        wait: true,
        points: [
            {
                id: Number(id),
                vector: vector,
                payload: {
                    text: text,
                    metadata: metadata
                }
            }
        ]
    });
}

module.exports = { vectorStore };