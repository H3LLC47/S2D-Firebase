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
  cacheDriveLetter: z.string().describe('Uppercase drive letter assigned to the Cache tier (e.g. C).'),
  capacityDriveLetter: z.string().describe('Uppercase drive letter assigned to the Capacity tier (e.g. D).'),
  rebootAfterCompletion: z.boolean().describe('Whether the nodes should be rebooted after the script successfully completes.'),
});

export type GeneratePowershellScriptInput = z.infer<typeof GeneratePowershellScriptInputSchema>;

const GeneratePowershellScriptOutputSchema = z.object({
  powershellScript: z.string().describe('The generated PowerShell script for deploying Storage Spaces Direct.'),
});

export type GeneratePowershellScriptOutput = z.infer<typeof GeneratePowershellScriptOutputSchema>;

export async function generatePowershellScript(input: GeneratePowershellScriptInput): Promise<GeneratePowershellScriptOutput> {
  // Ensure drive letters are uppercase for consistency in the script
  const processedInput = {
    ...input,
    cacheDriveLetter: input.cacheDriveLetter.toUpperCase(),
    capacityDriveLetter: input.capacityDriveLetter.toUpperCase(),
  };
  return generatePowershellScriptFlow(processedInput);
}

const prompt = ai.definePrompt({
  name: 'generatePowershellScriptPrompt',
  input: {schema: GeneratePowershellScriptInputSchema},
  output: {schema: GeneratePowershellScriptOutputSchema},
  prompt: `You are an expert system administrator specializing in Windows Storage Spaces Direct deployments.

Generate a comprehensive PowerShell script based on the provided configuration options.
**Crucially, ensure all installations (like features via Install-WindowsFeature) use parameters like '-NoRestart' or equivalent to PREVENT AUTOMATIC REBOOTS during the script execution.**
The script should be well-formatted, include robust error handling (e.g., using try-catch blocks and checking command success), and provide informative output messages.

The script should perform the following steps in order:
1.  Install necessary Windows Features (like Failover-Clustering, Hyper-V, Data-Center-Bridging, Deduplication if enabled) on all specified storage nodes WITHOUT requiring a reboot during installation.
2.  Validate the cluster configuration using \`Test-Cluster\`.
3.  Create the cluster using \`New-Cluster\`.
4.  Enable Storage Spaces Direct using \`Enable-ClusterS2D\`.
5.  Configure storage tiers based on the provided media types and resiliency settings. Use \`New-StorageTier\` and potentially \`Set-StoragePool\` if needed.
6.  Create virtual disks (volumes) on the tiers, assigning the specified drive letters. Use \`New-Volume\`.
7.  If deduplication is enabled, enable it on the created volumes using \`Enable-DedupVolume\`.
8.  Include checks after major steps to ensure they completed successfully before proceeding. Use '$?' or check specific command output.
{{#if rebootAfterCompletion}}
9.  **At the very end of the script, ONLY IF ALL previous steps completed successfully, include a command to reboot all storage nodes.** Use \`Restart-Computer -ComputerName $node -Force\` within a loop or Invoke-Command block targeting all nodes. Add a confirmation message before the reboot command is executed.
{{else}}
9.  At the end of the script, add comments reminding the administrator to manually reboot the nodes if required for certain configurations to take effect. DO NOT include any reboot commands.
{{/if}}

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
Reboot After Successful Completion: {{{rebootAfterCompletion}}}

Generate ONLY the PowerShell script content. Do not include any introductory text, explanations, or markdown formatting outside the script block.
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
    // Basic cleanup: Remove potential markdown code block fences if the AI adds them
    const cleanedScript = output?.powershellScript
      .replace(/^```powershell\s*/i, '')
      .replace(/\s*```$/, '')
      .trim();

    return { powershellScript: cleanedScript || '' };
  }
);

