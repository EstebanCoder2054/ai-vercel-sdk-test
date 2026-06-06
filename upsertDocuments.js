import {openai} from "./config.js"
import {supabase} from "./config.js"
// Node built-ins: fs = file system, path = path helpers, fileURLToPath = converts ESM URL to a normal path
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// --- Configuration ---
const SOURCE_DOCUMENTS_DIR = 'docs';                   // Folder name where source .txt/.md docs live
const EMBEDDING_MODEL_NAME = 'text-embedding-3-small'; // OpenAI model that turns text into vectors
const SUPABASE_TABLE_NAME = 'documents';               // Target table in Supabase
const CLEAR_SUPABASE_TABLE_CONTENTS = true;            // If true, wipe table before re-inserting

// In ES modules there is no __dirname by default, so we recreate it from import.meta.url
const __filename = fileURLToPath(import.meta.url);     // Absolute path to THIS file
const __dirname = path.dirname(__filename);            // Absolute path to the folder THIS file lives in

// --- Ingestion Logic ---
export async function ingestDocuments() {
  // Build absolute path to the /docs folder next to this script
  const docsDirPath = path.join(__dirname, SOURCE_DOCUMENTS_DIR);
  console.log(`Ingesting documents from directory: ${docsDirPath}`);

  // Accumulator: every doc we successfully embed gets pushed here, then bulk-inserted at the end
  const allDocumentsToInsert = [];

  try {
    // 1. Bail out early if /docs doesn't exist or isn't a directory
    if (
      !fs.existsSync(docsDirPath) ||
      !fs.lstatSync(docsDirPath).isDirectory()
    ) {
      throw new Error(
        `Source documents directory not found at ${docsDirPath}. Please create it and add files.`
      );
    }

    // Read the list of filenames inside /docs (just names, not contents)
    const files = fs.readdirSync(docsDirPath);

    // Nothing to do if the folder is empty
    if (files.length === 0) {
      console.log(
        `No files found in ${docsDirPath}. Nothing to ingest.`
      );
      return;
    }
    console.log(`Found ${files.length} files to process.`);

    // Optionally clear the table so we don't pile up duplicates on every run
    if (CLEAR_SUPABASE_TABLE_CONTENTS){

      console.log(
        `Clearing existing documents from table '${SUPABASE_TABLE_NAME}'...`
      );
      // Supabase requires a filter for delete; .neq('id', -1) matches every row (no id equals -1)
      const { error: deleteError } = await supabase
        .from(SUPABASE_TABLE_NAME)
        .delete()
        .neq('id', -1);
      if (deleteError) {
        // Warn but keep going — a failed clear isn't fatal for inserting new rows
        console.warn(
          `Warning: Could not clear existing documents: ${deleteError.message}`
        );
      } else {
        console.log('Existing documents cleared.');
      }
    }

    // Loop over each file in /docs and turn it into an embedding
    for (const filename of files) {
      const filePath = path.join(docsDirPath, filename); // Absolute path to this specific file
      console.log(`Processing file: ${filename}...`);

      // 2. Read the entire file into a string (utf-8 = plain text)
      const fileContent = fs.readFileSync(filePath, 'utf-8');
      console.log(` - Read ${fileContent.length} characters.`);


      try {
          // Ask OpenAI to convert the text into a vector (array of numbers representing meaning)
          const embeddings = await openai.embeddings.create({
            model: EMBEDDING_MODEL_NAME,
            input: fileContent,
          });
          // Queue this row for insertion: the raw text, its vector, and where it came from
          allDocumentsToInsert.push({
            content: fileContent,
            embedding: embeddings.data[0].embedding, // The actual number array OpenAI returned
            metadata: { source: filename },           // Useful for tracing results back to the file
          });
          console.log(`- Embedded content from ${filename}`);
        } catch (embedError) {
          // If one file fails to embed, log it and move on instead of killing the whole run
          console.error(
            `   - Failed to embed content from ${filename}: ${embedError.message}. Skipping chunk.`
          );
        }
     }

    // If nothing embedded successfully, skip the insert step entirely
    if (allDocumentsToInsert.length === 0) {
      console.log(
        'No documents were successfully embedded across all files. Aborting upload.'
      );
      return;
    }

    // Debug log: how many docs are ready + the full payload pretty-printed
    console.log(
      `Total documents successfully prepared for insertion: ${allDocumentsToInsert.length}\n\n${JSON.stringify(allDocumentsToInsert, null,2)}`
    );


    // 5. Single batched insert into Supabase (faster than inserting row by row)
    console.log(
      `Uploading ${allDocumentsToInsert.length} documents to Supabase table '${SUPABASE_TABLE_NAME}'...`
    );
    const { error: insertError } = await supabase
      .from(SUPABASE_TABLE_NAME)
      .insert(allDocumentsToInsert);

    if (insertError) {
      // Real failure here — throw so the outer catch handles it and exits the process
      console.error('Error inserting documents into Supabase:', insertError);
      throw new Error(`Supabase insert failed: ${insertError.message}`);
    } else {
      console.log(
        `Successfully inserted ${allDocumentsToInsert.length} documents into Supabase.`
      );
    }

    console.log('--- Ingestion Complete! ---');
  } catch (error) {
    // Anything thrown in the try-block lands here: log it and exit with a non-zero code for CI/scripts
    console.error('--- Ingestion Failed! ---');
    console.error('Error during ingestion process:', error);
    process.exit(1);
  }
}
