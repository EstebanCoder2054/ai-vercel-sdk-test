import OpenAI from 'openai';

/** Ensure the OpenAI API key is available and correctly configured */
if (!process.env.OPENAI_API_KEY) {
    throw new Error("OpenAI API key is missing or invalid.");
}

export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

