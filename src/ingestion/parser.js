const fs = require("fs");
const { PDFParse } = require("pdf-parse");

async function extractTextFromPDF(filePath) {
  const buffer = fs.readFileSync(filePath);
  const data = new Uint8Array(buffer);
  const parser = new PDFParse(data);

  const result = await parser.getText();

  await parser.destroy();

  return result.text;
}

module.exports = { extractTextFromPDF };
