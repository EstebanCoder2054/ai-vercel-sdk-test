import {openai} from "./configWithVercel.js"


export const SIMILARITY_MATCH_COUNT = 3
export const ANSWERING_MODEL = "gpt-4o"
export const EMBEDDING_MODEL_NAME = 'text-embedding-3-small'; 
export const CLASSIFICATION_MODEL = 'gpt-4o';
export const aiModel = openai(ANSWERING_MODEL)
export const KNOWLEDGE_BASE_DESCRIPTION = 'a travel guide to Medellín, Colombia — covering neighborhoods, food, nightlife, transit, safety, day trips, and tips for visitors and digital nomads';
