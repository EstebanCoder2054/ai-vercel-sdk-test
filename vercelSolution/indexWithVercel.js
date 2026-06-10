import {retrieveSimilarDocs} from "./retrieveSimilarDocs.js"
import {getRagPrompt, combineDocuments} from "./utils.js"
import {aiModel} from "./constants.js"
import { generateText } from 'ai';
import {ingestDocuments} from "./upsertDocuments.js"
import {classifyAndRetrieve} from "./agenticRetrieval.js"

// const query = "What are the best coworking spaces in Medellín for digital nomads?"
const query = "tell me the history of deportivo independiente medellin in one paragraph"

async function main(query){

  /* split text into chunks, embed and store into vector db */
  //  await ingestDocuments()

  /* retrieve docs that contain content relevant to the query */
  // await basicRetrieval(query)

  /*classify user prompt to decide whether to initiate retrieval */
  const response = await classifyAndRetrieve(query)

  console.log(`\n\nGenerated answer: ${response.answer}\n\nRetrieval docs: ${response.sources ? JSON.stringify(response.sources, null, 2): null}`);

}

main(query)


async function basicRetrieval(query){
  // retrieve docs that contain content relevant to the query
  // first embed the query and retrieve similar docs from supabase using the match_documents function with rpc
  const docs = await retrieveSimilarDocs(query);
  console.log(docs);

  //combine the docs into a single string mapping the content of the docs
  const contextString = combineDocuments(docs);


  //create a prompt including context docs to send to the model for RAG
  const finalPrompt = getRagPrompt(contextString, query);

  //send prompt to model to generate response

  const {text} = await generateText({
    model: aiModel,
    prompt: finalPrompt
  })

  console.log(text);
}