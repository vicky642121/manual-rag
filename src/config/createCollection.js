const qdrant = require("./qdrant");
const dontenv = require("dotenv");
dontenv.config();

async function createCollection() {
    const collectionName = process.env.QDRANT_COLLECTION;
    const collections = await qdrant.qdrantClient.getCollections();

    const exists = collections.collections.some(
        (collection) => collection.name === collectionName
    );

    if(exists) {
        console.log(`Collection "${collectionName}" already exists.`);
        return false;
    }

    await qdrant.qdrantClient.createCollection(collectionName, {
        vectors: {
            size: parseInt(process.env.EMBEDDING_DIMENSION),
            distance: "Cosine",
        },
    });

    return true;
}


module.exports = { createCollection };