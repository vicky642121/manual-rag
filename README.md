# Manual RAG Example

A small Retrieval-Augmented Generation (RAG) example using:

- Node.js
- OpenRouter for embeddings and chat responses
- Qdrant for vector storage
- A PDF employee leave policy as the knowledge source

The application reads the PDF, splits it into smaller text chunks, creates an embedding for each chunk, stores the embeddings in Qdrant, and then retrieves relevant chunks to answer a question.

## How the RAG flow works

```text
PDF document
    -> extract text
    -> clean text
    -> split into chunks
    -> create embeddings
    -> store chunks in Qdrant

User question
    -> create question embedding
    -> search Qdrant for similar chunks
    -> send the chunks and question to the LLM
    -> print the answer
```

## Prerequisites

Install the following before starting:

- Node.js 18 or newer
- npm
- Docker Desktop or Docker Engine
- An OpenRouter API key

Check Node.js and npm:

```bash
node --version
npm --version
```

## 1. Install the project

Open a terminal in this project directory and install the dependencies:

```bash
npm install
```

## 2. Start Qdrant

This project expects Qdrant at `http://localhost:6333`.

Start Qdrant with Docker:

```bash
docker run --rm \
  -p 6333:6333 \
  -v "$(pwd)/qdrant_storage:/qdrant/storage" \
  qdrant/qdrant
```

Keep this terminal running. Open a second terminal for the remaining commands.

Check that Qdrant is available:

```bash
curl http://localhost:6333/healthz
```

A successful response means that Qdrant is ready.

## 3. Configure environment variables

Copy the provided example file to `.env` in the project root:

```bash
cp .env-example .env
```

Open `.env` and add your OpenRouter API key to `OPENROUTER_API_KEY`. Keep `.env` private and do not commit it. The `.env-example` file intentionally contains no API key value and can be shared safely.

The `EMBEDDING_DIMENSION` must match the embedding model. The value `1536` matches `openai/text-embedding-3-small`.

## 4. Check the document

The example PDF is already included here:

```text
documents/Employee_Leave_Policy_2026.pdf
```

The ingestion code currently reads this exact path. If you use another PDF, either replace the existing file or update the path in `index.js`.

## 5. Ingest the PDF into Qdrant

Ingestion means loading the PDF into the vector database. It only needs to be done when the document changes or when the Qdrant collection is empty.

Open `index.js` and uncomment the last line:

```js
ingestion();
```

Then run:

```bash
node index.js
```

You should see messages such as:

```text
Generating embedding for chunk 1
Document ingestion completed!
```

The first run creates the `employee_documents` collection and stores the document chunks in Qdrant. After ingestion finishes, you can comment `ingestion();` again. Leaving it enabled is also safe for this example, but it will process the PDF each time `node index.js` is run.

## 6. Ask a question

Run the search script with your question in quotes:

```bash
node src/search/search.js "How much salary for the manager"
```

More example questions:

```bash
node src/search/search.js "How many leave days can an employee take?"
node src/search/search.js "What is the maternity leave policy?"
node src/search/search.js "Who should approve leave requests?"
```

The script will:

1. Create an embedding for your question.
2. Find the three most similar chunks in Qdrant.
3. Send those chunks to the language model.
4. Print the final answer.

The prompt tells the model to answer only from the retrieved document context. If the document does not contain the answer, it should say that there is not enough information.

## Updating the knowledge document

To use a different PDF:

1. Put the PDF in the `documents` directory.
2. Update the PDF path in `index.js`.
3. Use a new Qdrant collection name in `.env`, for example `employee_documents_v2`.
4. Run ingestion again with `node index.js`.
5. Ask questions with `node src/search/search.js "your question"`.

Using a new collection avoids mixing chunks from the old and new documents.

## Troubleshooting

### `ECONNREFUSED` or Qdrant connection errors

Make sure the Docker container is running and that `.env` contains:

```env
QDRANT_URL=http://localhost:6333
```

Also check:

```bash
curl http://localhost:6333/healthz
```

### OpenRouter authentication errors

Check that `OPENROUTER_API_KEY` is present in `.env`, has not expired, and has available credits.

### Vector dimension errors

The embedding model and collection dimension must agree. For this example use:

```env
EMBEDDING_MODEL=openai/text-embedding-3-small
EMBEDDING_DIMENSION=1536
```

If the collection was created with a different dimension, use a new collection name or delete and recreate the old collection in Qdrant.

### Search returns no useful answer

Run ingestion first and confirm that it completed successfully. Also make sure that your question is related to the PDF content.

### `Cannot find module` errors

Run:

```bash
npm install
```

## Project structure

```text
manual-rag/
├── documents/                 # Source PDF files
├── index.js                   # PDF ingestion entry point
├── src/
│   ├── config/                # Qdrant client and collection creation
│   ├── ingestion/             # Parsing, cleaning, chunking, embeddings, storage
│   ├── llm/                   # OpenRouter chat completion
│   └── search/                # Vector search and question answering
├── qdrant_storage/            # Local Qdrant data
├── .env                       # Local secrets and configuration
└── package.json               # Node.js dependencies
```

## Quick start

After the initial setup, the shortest workflow is:

```bash
# Terminal 1: start Qdrant
docker run --rm -p 6333:6333 -v "$(pwd)/qdrant_storage:/qdrant/storage" qdrant/qdrant

# Terminal 2: install dependencies and ingest
npm install
# Uncomment ingestion(); in index.js first
node index.js

# Ask a question
node src/search/search.js "What is the leave policy?"
```
