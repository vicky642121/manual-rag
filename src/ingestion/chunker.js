function CreateChunker(text, chunkSize=500, overlap=50) {
    const chunks = [];
    let start = 0;
    
    while(start < text.length) {
        let end = start + chunkSize;
        if(end > text.length) {
            end = text.length;
        }
        chunks.push(text.slice(start, end));
        start += chunkSize - overlap;
    }

    return chunks;
}

module.exports = { CreateChunker };