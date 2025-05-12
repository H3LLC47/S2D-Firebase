// 'use server';
/**
 * @fileOverview Generates a PowerShell script for deploying Windows Storage Spaces Direct based on provided configurations.
 *
 * - generatePowershellScript - A function that generates the PowerShell script.
 * - GeneratePowershellScriptInput - The input type for the generatePowershellScript function.
 * - GeneratePowershellScriptOutput - The return type for the generatePowershellScript function.
 */

'use server';
import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GeneratePowershellScriptInputSchema = z.object({
  virtualSwitchName: z.string().describe('The name of the external virtual switch for Hyper-V.'),
  storageNodes: z.string().describe('A comma-separated list of server names to be used as storage nodes.'),
  clusterName: z.string().describe('The name of the Storage Spaces Direct cluster.'),
  storagePoolFriendlyName: z.string().describe('The friendly name for the storage pool.'),
  storageTier1Name: z.string().describe('The name for the first storage tier (e.g., PerformanceTier).'),
  storageTier1MediaType: z.enum(['SSD', 'HDD']).describe('The media type for the first storage tier (SSD or HDD).'),
  storageTier1ResiliencySettingName: z.string().describe('The resiliency setting name for the first storage tier (e.g., Mirror).'),
  storageTier2Name: z.string().describe('The name for the second storage tier (e.g., CapacityTier).'),
  storageTier2MediaType: z.enum(['SSD', 'HDD']).describe('The media type for the second storage tier (SSD or HDD).'),
  storageTier2ResiliencySettingName: z.string().describe('The resiliency setting name for the second storage tier (e.g., Parity).'),
  enableDeduplication: z.boolean().describe('Whether to enable data deduplication on the storage tiers.'),
  cacheDriveLetter: z.string().describe('Drive letter assigned to the Cache tier.'),
  capacityDriveLetter: z.string().describe('Drive letter assigned to the Capacity tier.'),
});

export type GeneratePowershellScriptInput = z.infer<typeof GeneratePowershellScriptInputSchema>;

const GeneratePowershellScriptOutputSchema = z.object({
  powershellScript: z.string().describe('The generated PowerShell script for deploying Storage Spaces Direct.'),
});

export type GeneratePowershellScriptOutput = z.infer<typeof GeneratePowershellScriptOutputSchema>;

export async function generatePowershellScript(input: GeneratePowershellScriptInput): Promise<GeneratePowershellScriptOutput> {
  return generatePowershellScriptFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generatePowershellScriptPrompt',
  input: {schema: GeneratePowershellScriptInputSchema},
  output: {schema: GeneratePowershellScriptOutputSchema},
  prompt: `You are an expert system administrator specializing in Windows Storage Spaces Direct deployments.

You will generate a PowerShell script based on the provided configuration options. Ensure the script is well-formatted, efficient, and includes error handling.

Here are the configuration options:

Virtual Switch Name: {{{virtualSwitchName}}}
Storage Nodes: {{{storageNodes}}}
Cluster Name: {{{clusterName}}}
Storage Pool Friendly Name: {{{storagePoolFriendlyName}}}
Storage Tier 1 Name: {{{storageTier1Name}}}
Storage Tier 1 Media Type: {{{storageTier1MediaType}}}
Storage Tier 1 Resiliency Setting Name: {{{storageTier1ResiliencySettingName}}}
Storage Tier 2 Name: {{{storageTier2Name}}}
Storage Tier 2 Media Type: {{{storageTier2MediaType}}}
Storage Tier 2 Resiliency Setting Name: {{{storageTier2ResiliencySettingName}}}
Enable Data Deduplication: {{{enableDeduplication}}}
Cache Drive Letter: {{{cacheDriveLetter}}}
Capacity Drive Letter: {{{capacityDriveLetter}}}


Generate the PowerShell script to deploy Storage Spaces Direct using the above configuration options.
`,
});

const generatePowershellScriptFlow = ai.defineFlow(
  {
    name: 'generatePowershellScriptFlow',
    inputSchema: GeneratePowershellScriptInputSchema,
    outputSchema: GeneratePowershellScriptOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
