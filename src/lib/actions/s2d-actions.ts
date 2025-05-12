'use server';

import { generatePowershellScript, type GeneratePowershellScriptInput } from '@/ai/flows/generate-powershell-script';
import { S2DConfigSchema, type S2DConfigFormData } from '@/lib/schemas/s2d-schema';

interface ActionResult {
  success: boolean;
  script?: string;
  error?: string;
}

export async function handleGenerateScript(formData: S2DConfigFormData): Promise<ActionResult> {
  // Ensure drive letters are uppercase before validation/passing to AI
   const processedFormData = {
      ...formData,
      cacheDriveLetter: formData.cacheDriveLetter.toUpperCase(),
      capacityDriveLetter: formData.capacityDriveLetter.toUpperCase(),
    };

  const validationResult = S2DConfigSchema.safeParse(processedFormData);


  if (!validationResult.success) {
    console.error("Form validation failed:", validationResult.error.errors);
    return {
      success: false,
      error: validationResult.error.errors.map((e) => `${e.path.join('.')}: ${e.message}`).join('\n'),
    };
  }

  const input: GeneratePowershellScriptInput = {
    ...validationResult.data,
    // The rebootAfterCompletion field is already part of validationResult.data
  };

  try {
    console.log("Calling generatePowershellScript with input:", input);
    const result = await generatePowershellScript(input);
     console.log("Received result from generatePowershellScript:", result);
    if (result && result.powershellScript) {
      return { success: true, script: result.powershellScript };
    }
     console.error('Failed to generate script: Empty response from AI.');
    return { success: false, error: 'Failed to generate script: Empty response from AI.' };
  } catch (error) {
    console.error('Error generating PowerShell script:', error);
    return { success: false, error: `Failed to generate script: ${error instanceof Error ? error.message : String(error)}` };
  }
}
