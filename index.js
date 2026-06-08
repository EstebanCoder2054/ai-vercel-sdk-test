import {retrieveSimilarDocs} from "./retrieveSimilarDocs.js"
import {getRagPrompt, combineDocuments} from "./utils.js"
import {ANSWERING_MODEL} from "./constants.js"
import {openai} from "./config.js"

const query = "In 1843, what was the key milestone in computing?"

async function main(query){
  //retrieve docs that contain content relevant to the query
  const retrievedDocs = await retrieveSimilarDocs(query)
  console.log(retrievedDocs)

  //create a prompt including context docs to send to the model

  const contextString = combineDocuments(retrievedDocs);

  //create a prompt including context docs to send to the model
  const prompt = getRagPrompt(contextString, query)

  // send prompt to model to generate response
  const response = await openai.responses.create({
    model: ANSWERING_MODEL,
    input: prompt
  });

  console.log(response.output_text);


}

main(query)