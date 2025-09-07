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

const suggestBetterPromptPrompt = ai.definePrompt({
  name: 'suggestBetterPromptPrompt',
  input: {schema: SuggestBetterPromptInputSchema},
  prompt: `You are an AI assistant for creative writing and prompt engineering for text-to-image models.
  Your task is to take a user's input and transform it into a more descriptive, detailed, and evocative prompt.
  
  - Be creative: Enhance the prompt by adding details about the subject, setting, lighting, mood, and artistic style.
  - DO NOT change the core subject of the user's prompt. For example, if the prompt is "a man", the refined prompt should still be about a man.
  - Add specific visual details like lighting (golden hour, neon lights, soft ambient), atmosphere (misty, dramatic, serene), art style (anime, photorealistic, digital art), and composition details.
  - If the prompt is already very detailed and well-crafted, you may return it unchanged.
  - Your response must be only the refined prompt text itself, with no extra formatting, labels, or introductory text.
  
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
    console.log('Starting AI prompt refinement for:', input.prompt);
    
    try {
      const response = await suggestBetterPromptPrompt(input);
      const refinedPrompt = response.output;
      
      console.log('AI Refinement returned:', refinedPrompt);
      
      // Validate the response
      if (!refinedPrompt || typeof refinedPrompt !== 'string') {
        console.log('AI returned invalid response type. Fallback enhancement.');
        return enhancePromptFallback(input.prompt);
      }
      
      const cleanedPrompt = refinedPrompt.trim();
      if (cleanedPrompt.length === 0) {
        console.log('AI returned empty response. Fallback enhancement.');
        return enhancePromptFallback(input.prompt);
      }
      
      // Check if the AI returned exactly the same prompt
      if (cleanedPrompt.toLowerCase() === input.prompt.toLowerCase().trim()) {
        console.log('AI returned identical prompt. Applying fallback enhancement.');
        return enhancePromptFallback(input.prompt);
      }
      
      // Return the refined prompt
      return cleanedPrompt;
      
    } catch (error) {
      console.error("Error during AI prompt refinement:", error);
      
      // Create a more descriptive error message
      let errorMessage = 'AI refinement service is currently unavailable';
      
      if (error instanceof Error) {
        // Check for common error types
        if (error.message.includes('timeout')) {
          errorMessage = 'AI refinement timed out - please try again';
        } else if (error.message.includes('rate limit')) {
          errorMessage = 'Too many requests - please wait a moment and try again';
        } else if (error.message.includes('network')) {
          errorMessage = 'Network error - check your connection and try again';
        } else {
          errorMessage = `AI service error: ${error.message}`;
        }
      }
      
      // Throw a user-friendly error that will be caught by the frontend
      throw new Error(errorMessage);
    }
  }
);

// Fallback function to ensure we always enhance the prompt
function enhancePromptFallback(originalPrompt: string): string {
  const enhancements = [
    'highly detailed, cinematic lighting',
    'masterpiece quality, vibrant colors',
    '8k resolution, trending on artstation',
    'dramatic shadows, ethereal atmosphere',
    'photorealistic, stunning composition',
    'beautiful lighting, award-winning art'
  ];
  
  const randomEnhancement = enhancements[Math.floor(Math.random() * enhancements.length)];
  
  // Add enhancement to the original prompt
  return `${originalPrompt.trim()}, ${randomEnhancement}`;
}