import {openai} from "./configWithVercel.js"
import { generateText } from 'ai';
import { embed } from 'ai';


const EMBEDDING_MODEL_NAME = 'text-embedding-3-small'; 
const aiModel = openai("gpt-4o")


async function main(){

  await generateResponse()

  // await generateEmbeddings()
}

main()


async function generateResponse(){
  const { text } = await generateText({
    model: aiModel,
    prompt: 'Write a brief poem about deportivo independiente medellin.',
  });

  console.log(`Generated response: ${text}\n\n`)
}

async function generateEmbeddings(){
  // 'embedding' is a single embedding object (number[])
  const { embedding } = await embed({
    model: openai.textEmbeddingModel(EMBEDDING_MODEL_NAME),
    value: 'This text will be converted to embeddings',
  });

  console.log(`Embedding generated: ${embedding}`)
}