import {SIMILARITY_MATCH_COUNT, EMBEDDING_MODEL_NAME} from "./constants.js"
import {openai, supabase} from "./configWithVercel.js"
import { embed } from 'ai';


export async function retrieveSimilarDocs(query){

  // Create vector embeddings based on the query

  const {embedding} = await embed({
    model: openai.textEmbeddingModel(EMBEDDING_MODEL_NAME),
    value: query,
  });

  //retrieve similar docs from supabase based on embeddings
  const { data: documents, error: matchError } = await supabase.rpc(
      'match_documents',
    {
      query_embedding: embedding,
      match_count: SIMILARITY_MATCH_COUNT,
    }
  );

  if(matchError){
    throw new Error (`Failed to fetch docs from supabase. Error: ${matchError}`)
  }

  return documents
}