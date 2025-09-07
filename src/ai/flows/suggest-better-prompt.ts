
'use server';

/**
 * @fileOverview This file defines a Genkit flow to refine a user's prompt for generating art.
 *
 * The flow takes a user's prompt and returns a more detailed and evocative version.
 * - suggestBetterPrompt - A function that refines a user prompt.
 * - SuggestBetterPromptInput - The input type for the suggestBetterPrompt function.
 * - SuggestBetterPromptOutput - The return type for the suggestBetterPrompt function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestBetterPromptInputSchema = z.object({
    prompt: z.string().describe('The user-provided prompt to be refined.'),
});
export type SuggestBetterPromptInput = z.infer<typeof SuggestBetterPromptInputSchema>;

const SuggestBetterPromptOutputSchema = z.string();
export type SuggestBetterPromptOutput = z.infer<typeof SuggestBetterPromptOutputSchema>;

export async function suggestBetterPrompt(
  input: SuggestBetterPromptInput
): Promise<SuggestBetterPromptOutput> {
  return suggestBetterPromptFlow(input);
}

// This prompt is now more flexible and does not enforce a strict string output schema.
// This prevents the Genkit validation error if the model returns null or an unexpected format.
const suggestBetterPromptPrompt = ai.definePrompt({
  name: 'suggestBetterPromptPrompt',
  input: {schema: SuggestBetterPromptInputSchema},
  prompt: `You are an AI assistant for creative writing and prompt engineering for text-to-image models.
  Your task is to take a user's input and transform it into a more descriptive, detailed, and evocative prompt.
  - Enhance the prompt by adding details about the subject, setting, lighting, mood, and artistic style.
  - DO NOT change the core subject of the user's prompt.
  - If you cannot improve the prompt or if it violates content policies, return the original prompt unmodified.
  - Your response must be only the prompt text itself, with no extra formatting, labels, or introductory text.

  User's Prompt:
  "{{{prompt}}}"

  Refined Prompt:
  `,
});

const suggestBetterPromptFlow = ai.defineFlow(
  {
    name: 'suggestBetterPromptFlow',
    inputSchema: SuggestBetterPromptInputSchema,
    outputSchema: SuggestBetterPromptOutputSchema,
  },
  async input => {
    const response = await suggestBetterPromptPrompt(input);
    const refinedPrompt = response.output;

    // This is the robust check. If the AI returns null, undefined, or a non-string response,
    // we safely fall back to the original prompt. This guarantees our flow always
    // returns a valid string, fulfilling its schema contract.
    if (typeof refinedPrompt === 'string' && refinedPrompt.trim().length > 0) {
        return refinedPrompt;
    }

    // Fallback to the original prompt if AI fails to provide a valid refinement.
    return input.prompt;
  }
);
