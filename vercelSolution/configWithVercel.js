import { createOpenAI } from '@ai-sdk/openai';
import { createClient } from '@supabase/supabase-js'
import ws from 'ws';

if (!process.env.OPENAI_API_KEY) {
  throw new Error('Missing OPENAI_API_KEY environment variable');
}

export const openai = createOpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});


/** Supabase config */
const supabasePrivateKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!supabasePrivateKey) throw new Error(`SUPABASE_SERVICE_ROLE_KEY is missing or invalid`);
const url = process.env.SUPABASE_URL;
if (!url) throw new Error(`SUPABASE_URL is missing or invalid`);
export const supabase = createClient(url, supabasePrivateKey, {
  realtime: { transport: ws },
});