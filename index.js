// import {openai} from './config.js';

// const content = [
//   "This text will be converted to an embedding.",
// ]; 

// async function main() {
//   const embedding = await openai.embeddings.create({
//     model: "text-embedding-3-small",
//     input: content,
//   });
//   console.log(embedding.data);
// }
// main();

import {ingestDocuments} from "./upsertDocuments.js"

async function main(){
  await ingestDocuments()
}

main()