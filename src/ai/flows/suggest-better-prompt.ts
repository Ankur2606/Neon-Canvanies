
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

const prompt = ai.definePrompt({
  name: 'suggestBetterPromptPrompt',
  input: {schema: SuggestBetterPromptInputSchema},
  output: {schema: SuggestBetterPromptOutputSchema},
  prompt: `You are an AI assistant that excels at creative writing and prompt engineering for text-to-image models. Your task is to take a user's input and transform it into a more descriptive, detailed, and evocative prompt that will result in a higher-quality and more artistic image.

  Focus on adding details about the subject, setting, lighting, mood, and artistic style. Do not change the core subject of the user's prompt, but enhance it.

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
    const {output} = await prompt(input);
    if (!output) {
      throw new Error('The AI was unable to refine the prompt. This may be due to a content policy or temporary issue.');
    }
    return output;
  }
);
