'use server';

/**
 * @fileOverview AI-powered image transformation flow to convert drawings into anime-style images.
 *
 * - generateAnimeImage - A function that transforms a drawing into an anime-style image.
 * - GenerateAnimeImageInput - The input type for the generateAnimeImage function.
 * - GenerateAnimeImageOutput - The return type for the generateAnimeImage function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import wav from 'wav';

const GenerateAnimeImageInputSchema = z.object({
  drawingDataUri: z
    .string()
    .describe(
      'A drawing as a data URI that must include a MIME type and use Base64 encoding. Expected format: data:<mimetype>;base64,<encoded_data>.'
    ),
  animeStyle: z
    .enum(['classic', 'cyberpunk', 'fantasy', 'chibi'])
    .describe('The desired anime style.'),
});
export type GenerateAnimeImageInput = z.infer<typeof GenerateAnimeImageInputSchema>;

const GenerateAnimeImageOutputSchema = z.object({
  animeImageDataUri: z
    .string()
    .describe('The generated anime-style image as a data URI.'),
});
export type GenerateAnimeImageOutput = z.infer<typeof GenerateAnimeImageOutputSchema>;

export async function generateAnimeImage(
  input: GenerateAnimeImageInput
): Promise<GenerateAnimeImageOutput> {
  return generateAnimeImageFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateAnimeImagePrompt',
  input: {schema: GenerateAnimeImageInputSchema},
  output: {schema: GenerateAnimeImageOutputSchema},
  prompt: `Transform the given drawing into an anime-style image.

Drawing: {{media url=drawingDataUri}}

Desired Anime Style: {{animeStyle}}

Ensure the generated image maintains the key elements of the original drawing while applying the specified anime style. Return the image as a data URI.
`,
});

const generateAnimeImageFlow = ai.defineFlow(
  {
    name: 'generateAnimeImageFlow',
    inputSchema: GenerateAnimeImageInputSchema,
    outputSchema: GenerateAnimeImageOutputSchema,
  },
  async input => {
    const {media} = await ai.generate({
      model: 'googleai/gemini-2.0-flash-preview-image-generation',
      prompt: [
        {media: {url: input.drawingDataUri}},
        {text: `Analyze the provided drawing and interpret its subject (e.g., face, character, object). Then, generate a new, aesthetically pleasing image that brings that subject to life in a refined '{{animeStyle}}' theme. Focus on creating a high-quality, artistic interpretation rather than strictly adhering to the original colors. The final image should be a beautiful and imaginative piece of art.`},
      ],
      config: {
        responseModalities: ['TEXT', 'IMAGE'], // MUST provide both TEXT and IMAGE, IMAGE only won't work
      },
    });

    return {
      animeImageDataUri: media.url,
    };
  }
);
