function cleanText(text) {
 return text
        .replace(/--\s*\d+\s+of\s+\d+\s*--/g, '')
        .replace(/\r/g, "")
        .replace(/[ \t]+/g, " ")
        .replace(/\n{3,}/g, "\n\n")
        .trim();
}

module.exports = { cleanText };