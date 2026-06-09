import { openai } from '@ai-sdk/openai';
import { generateObject } from 'ai';
import { z } from 'zod';

const model = openai('gpt-4o')

/**
 * The generateObject interface enables us to instruct the model to generate structured output in JSON format based on predefined schema.
 * 
 */

async function main(){
  // Generate a basic structured output
  // await basicStructuredOutput()

  // Generate structured output based on classification requirements
  await classificationStructuredOutput()
}

main()


async function basicStructuredOutput(){
  const result = await generateObject({
    model,
    schemaName: 'recipe',
    schemaDescription: 'A recipe for pizza.',
    schema: z.object({
      name: z.string(),
      ingredients: z.array(
        z.object({
          name: z.string(),
          amount: z.string(),
        }),
      ),
      steps: z.array(z.string()),
    }),
    prompt: 'Generate a pizza recipe.',
  });

  console.log(JSON.stringify(result.object, null, 2));
}


async function classificationStructuredOutput(){
  const result = await generateObject({
    model,
    schemaName: 'customer_review', //make sure there are no spaces
    schemaDescription: 'Classification of customer reviews.',
    schema: z.object({
      reasoning: z
        .string()
        .describe('Brief reasoning for the classification choice.'),
      type: z
        .enum(["positive", "negative"]) // An enum type is a special data type that enables for a variable to be a set of predefined constants
        .describe(
          'Sentiment of the customer review'
        ),
    }),
    prompt: "Classify the customer review below"+ "\n\n" + "I tried the app and it worked exactly as I expected.",
  });

  console.log(JSON.stringify(result.object, null, 2));
}


