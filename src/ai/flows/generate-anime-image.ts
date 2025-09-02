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
        {text: `You are an expert creative artist. Your task is to analyze the provided user's drawing and identify its core subject (e.g., a person's face, a full character, an animal, an object). Then, you will generate a new, high-quality, aesthetically pleasing image that artistically re-imagines that subject, strictly adhering to the selected theme: '{{animeStyle}}'.

Your primary goal is to transform the drawing, not just copy it. Do not focus on replicating the original colors; instead, create a beautiful and imaginative piece of art that embodies the chosen style.

Follow these specific instructions for the selected '{{animeStyle}}':
- If the style is 'Anime': Re-create the subject in a classic, well-proportioned anime style. Focus on clean lines, expressive eyes, and standard anime aesthetics.
- If the style is 'Cyberpunk': Transform the subject with futuristic elements. Incorporate neon lighting, cybernetic augmentations, high-tech clothing, or a dystopian city background. The result should feel gritty, advanced, and distinctly cyberpunk.
- If the style is 'Fantasy': Re-imagine the subject in a magical or mythical setting. Add elements like glowing magical effects, medieval armor, enchanted forests, or fantasy creatures. The image should evoke a sense of wonder and adventure.
- If the style is 'Chibi': Redraw the subject in a "super-deformed" style. This means a large head, small body, and exaggeratedly cute features. The result should be playful, charming, and adorable.

The final image must be a polished, artistic, and beautiful piece that is a clear and faithful representation of the selected style.`},
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
