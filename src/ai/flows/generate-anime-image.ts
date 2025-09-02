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

const stylePrompts = {
    classic: "You are an expert creative artist. Your task is to analyze the provided user's drawing and identify its core subject (e.g., a person's face, a full character, an animal, an object). Then, you will generate a new, high-quality image that artistically re-imagines that subject. Re-create the subject in a classic, well-proportioned anime style. Focus on clean lines, expressive eyes, and standard anime aesthetics. Guess the anime characters if they are similar to some character existing.",
    cyberpunk: "You are an expert creative artist. Your task is to analyze the provided user's drawing and identify its core subject (e.g., a person's face, a full character, an animal, an object). Then, you will generate a new, high-quality image that artistically re-imagines that subject. Transform the subject with futuristic elements. Incorporate neon lighting, cybernetic augmentations, high-tech clothing, or a dystopian city background. The result should feel gritty, advanced, and distinctly cyberpunk.",
    fantasy: "You are an expert creative artist. Your task is to analyze the provided user's drawing and identify its core subject (e.g., a person's face, a full character, an animal, an object). Then, you will generate a new, high-quality image that artistically re-imagines that subject. Re-imagine the subject in a magical or mythical setting. Add elements like glowing magical effects, medieval armor, enchanted forests, or fantasy creatures. The image should evoke a sense of wonder and adventure.",
    chibi: "You are an expert creative artist. Your task is to analyze the provided user's drawing and identify its core subject (e.g., a person's face, a full character, an animal, an object). Then, you will generate a new, high-quality image that artistically re-imagines that subject. Redraw the subject in a \"super-deformed\" chibi style. This means a large head, small body, and exaggeratedly cute features. The result should be playful, charming, and adorable.",
};

const generateAnimeImageFlow = ai.defineFlow(
  {
    name: 'generateAnimeImageFlow',
    inputSchema: GenerateAnimeImageInputSchema,
    outputSchema: GenerateAnimeImageOutputSchema,
  },
  async input => {
    const selectedPrompt = stylePrompts[input.animeStyle];

    const {media} = await ai.generate({
      model: 'googleai/gemini-2.0-flash-preview-image-generation',
      prompt: [
        {media: {url: input.drawingDataUri}},
        {text: selectedPrompt},
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
