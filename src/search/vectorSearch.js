const dotenv = require("dotenv");
const qdrant = require("../config/qdrant.js");
dotenv.config();

const searchDocument = async (Queryvector) => {

  const result = await qdrant.qdrantClient.query(
    process.env.QDRANT_COLLECTION,
    {
      vector: Queryvector,
      limit: 3,
      with_payload: true,
    },
  );
  console.log("result",result);
  return result;
};


module.exports = { searchDocument };