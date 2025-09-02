'use server';

/**
 * @fileOverview This file defines a Genkit flow to suggest cyberpunk-themed prompts to users.
 *
 * The flow takes no input and returns a list of suggested prompts.
 * - suggestCyberpunkPrompts - A function that returns cyberpunk prompts.
 * - SuggestCyberpunkPromptsInput - Empty input type for the suggestCyberpunkPrompts function.
 * - SuggestCyberpunkPromptsOutput - The return type for the suggestCyberpunkPrompts function, which is an array of strings.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestCyberpunkPromptsInputSchema = z.object({});
export type SuggestCyberpunkPromptsInput = z.infer<typeof SuggestCyberpunkPromptsInputSchema>;

const SuggestCyberpunkPromptsOutputSchema = z.array(z.string());
export type SuggestCyberpunkPromptsOutput = z.infer<typeof SuggestCyberpunkPromptsOutputSchema>;

export async function suggestCyberpunkPrompts(): Promise<SuggestCyberpunkPromptsOutput> {
  return suggestCyberpunkPromptsFlow({});
}

const prompt = ai.definePrompt({
  name: 'suggestCyberpunkPromptsPrompt',
  input: {schema: SuggestCyberpunkPromptsInputSchema},
  output: {schema: SuggestCyberpunkPromptsOutputSchema},
  prompt: `You are an AI assistant that specializes in providing creative prompts for generating cyberpunk-themed art.

  Generate a list of 5 diverse and imaginative prompts to inspire users to create cyberpunk artwork. The prompts should be short, evocative, and focus on various aspects of the cyberpunk genre, such as technology, dystopia, augmentation, and rebellion. Each prompt should be no more than 10 words.
  Do not include any introductory or concluding remarks.

  Example Output:
  [
    "Neon city at night, rainy streets",
    "Augmented human in a data stream",
    "Rebel hacker fighting a megacorp",
    "Dystopian future with flying cars",
    "Cyberpunk samurai with a glowing katana"
  ]
  `,
});

const suggestCyberpunkPromptsFlow = ai.defineFlow(
  {
    name: 'suggestCyberpunkPromptsFlow',
    inputSchema: SuggestCyberpunkPromptsInputSchema,
    outputSchema: SuggestCyberpunkPromptsOutputSchema,
  },
  async () => {
    const {output} = await prompt({});
    return output!;
  }
);
