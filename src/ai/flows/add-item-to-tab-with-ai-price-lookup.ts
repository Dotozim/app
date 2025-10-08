'use server';

/**
 * @fileOverview An AI agent that adds an item to a client's tab with price automatically looked up using AI.
 *
 * - addItemToTabWithAIPriceLookup - A function that handles adding an item to a client's tab with AI price lookup.
 * - AddItemToTabInput - The input type for the addItemToTabWithAIPriceLookup function.
 * - AddItemToTabOutput - The return type for the addItemToTabWithAIPriceLookup function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AddItemToTabInputSchema = z.object({
  itemName: z.string().describe('The name of the item to add to the tab.'),
});
export type AddItemToTabInput = z.infer<typeof AddItemToTabInputSchema>;

const AddItemToTabOutputSchema = z.object({
  itemName: z.string().describe('The name of the item added to the tab.'),
  price: z.number().describe('The price of the item.'),
});
export type AddItemToTabOutput = z.infer<typeof AddItemToTabOutputSchema>;

const getItemPrice = ai.defineTool({
  name: 'getItemPrice',
  description: 'Returns the price of a given item at the pub.',
  inputSchema: z.object({
    itemName: z.string().describe('The name of the item.'),
  }),
  outputSchema: z.number().describe('The price of the item in USD.'),
},
async (input) => {
  // In a real implementation, this would fetch the price from a database or
  // other data source.
  // This is a placeholder implementation that returns a dummy price.
  switch (input.itemName.toLowerCase()) {
    case 'beer':
      return 5.0;
    case 'snacks':
      return 3.0;
    default:
      return 7.0; // Default price
  }
});

export async function addItemToTabWithAIPriceLookup(input: AddItemToTabInput): Promise<AddItemToTabOutput> {
  return addItemToTabFlow(input);
}

const prompt = ai.definePrompt({
  name: 'addItemToTabPrompt',
  tools: [getItemPrice],
  input: {schema: AddItemToTabInputSchema},
  output: {schema: AddItemToTabOutputSchema},
  prompt: `The user wants to add an item to a tab. Use the getItemPrice tool to find the price of the item. Return the item name and the price.

Item name: {{{itemName}}} `,
});

const addItemToTabFlow = ai.defineFlow(
  {
    name: 'addItemToTabFlow',
    inputSchema: AddItemToTabInputSchema,
    outputSchema: AddItemToTabOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
