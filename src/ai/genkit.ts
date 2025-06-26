import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';
import fs from 'fs';
import path from 'path';

// This is a workaround for environments where process.env isn't populated.
// In a real production app, this should come from a secure secret manager.
let apiKey: string | undefined;
try {
    // We construct an absolute path to be safe.
    const ffPath = path.join(process.cwd(), 'ff.txt');
    if (fs.existsSync(ffPath)) {
        apiKey = fs.readFileSync(ffPath, 'utf-8').trim();
    }
} catch (e) {
    // This might fail in some environments, which is fine.
    console.error("Could not read API key from ff.txt:", e);
}

// Fallback to environment variable if reading file fails or file doesn't exist.
if (!apiKey) {
    apiKey = process.env.GOOGLE_API_KEY;
}


export const ai = genkit({
  plugins: [
    googleAI({
      // We explicitly pass the API key to prevent issues where
      // the environment variable isn't available in the runtime.
      apiKey: apiKey,
    }),
  ],
  model: 'googleai/gemini-2.0-flash',
});
