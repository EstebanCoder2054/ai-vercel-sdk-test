-- 1. Enable the pgvector extension
-- pgvector is a Postgres add-on that adds a `vector` data type + similarity search operators.
-- Without this, Postgres has no idea what a "vector" column is. "if not exists" makes it safe to re-run.
create extension if not exists vector;

-- 2. Create the documents table
-- This is the table the upsertDocuments.js script writes into.
create table documents (
  id bigserial primary key,   -- Auto-incrementing 64-bit integer ID; primary key = unique row identifier
  content text,               -- The raw text chunk from the source file (no length limit)
  metadata jsonb,             -- Flexible JSON blob; we store { "source": "filename.md" } for traceability
                              -- jsonb (binary JSON) is indexable and faster to query than plain json
  embedding vector(1536)      -- The OpenAI embedding: an array of 1536 floats
                              -- 1536 is the fixed output size of the text-embedding-3-small model
);
