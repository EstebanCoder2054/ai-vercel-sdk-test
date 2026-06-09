import {retrieveSimilarDocs} from "./retrieveSimilarDocs.js"
import {getRagPrompt, combineDocuments} from "./utils.js"
import {ANSWERING_MODEL} from "./constants.js"
import {openai} from "./config.js"
import {ingestDocuments} from "./upsertDocuments.js"

const query = "How many houses were damaged during the great fire of london?"

async function main(query){

  // split text into chunks, embed and store into vector db
  //  await ingestDocuments()

  // retrieve docs that contain content relevant to the query
  const docs = await retrieveSimilarDocs(query)
  console.log(docs)

  const contextString = combineDocuments(docs);


  //create a prompt including context docs to send to the model
  const prompt = getRagPrompt(contextString, query)

  console.log(`Prompt: ${prompt}`)

  //send prompt to model to generate response
  const response = await openai.responses.create({
    model: ANSWERING_MODEL,
    input: prompt
  });

  console.log(response.output_text);


}

main(query)