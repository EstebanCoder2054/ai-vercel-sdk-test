/**
 * Generates the prompt for classifying the question type (RETRIEVAL vs GENERAL).
 * @param {string} question - The user's question.
 * @param {string} knowledgeBaseDescription - Description of the knowledge base.
 * @returns {string} The classification prompt.
 */
export function getClassificationPrompt(question, knowledgeBaseDescription) {
    return `Classify the user's question. The goal is to use a travel knowledge base about '${knowledgeBaseDescription}' IF the question is about Medellín or traveling there (neighborhoods, food, transit, safety, day trips, nightlife, costs, remote work, etc.). If the question is clearly off-topic (e.g., coding help, sports, general trivia unrelated to Medellín or travel), respond 'GENERAL'. Otherwise, respond 'RETRIEVAL'.
  
  Question: "${question}"
  Classification:`;
  }
  
  /**
   * Generates the prompt for answering a general question directly.
   * @param {string} question - The user's question.
   * @returns {string} The general prompt.
   */
  export function getGeneralPrompt(question) {
    return `Answer the following question concisely: ${question}`;
  }
  
  /**
   * Generates the prompt for when no relevant documents are found during retrieval.
   * @param {string} question - The original user question.
   * @param {string} knowledgeBaseDescription - Description of the knowledge base.
   * @returns {string} The fallback prompt.
   */
  export function getFallbackPrompt(question, knowledgeBaseDescription) {
    return `You were asked: "${question}". You searched a knowledge base about ${knowledgeBaseDescription} but found no relevant information. Inform the user politely that you couldn't find specific details in the knowledge base and offer to answer generally if possible, or state you cannot answer.`;
  }
  
  /**
   * Generates the prompt for answering based on retrieved context.
   * @param {string} contextString - The combined context from retrieved documents.
   * @param {string} question - The user's question.
   * @param {string} knowledgeBaseDescription - Description of the knowledge base.
   * @returns {string} The RAG prompt.
   */
  export function getRagPrompt(
    contextString,
    question,
    knowledgeBaseDescription
  ) {
    return `You are a helpful assistant for ${knowledgeBaseDescription}. Answer the user's question based on the provided context. If the context doesn't contain the answer, kindly inform the user.
  
  Context:
  ---
  ${contextString}
  ---
  
  Question: ${question}
  Answer:`;
  }
  