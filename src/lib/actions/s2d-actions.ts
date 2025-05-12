'use server';

import { generatePowershellScript, type GeneratePowershellScriptInput } from '@/ai/flows/generate-powershell-script';
import { S2DConfigSchema, type S2DConfigFormData } from '@/lib/schemas/s2d-schema';

interface ActionResult {
  success: boolean;
  script?: string;
  error?: string;
}

export async function handleGenerateScript(formData: S2DConfigFormData): Promise<ActionResult> {
  const validationResult = S2DConfigSchema.safeParse(formData);

  if (!validationResult.success) {
    return {
      success: false,
      error: validationResult.error.errors.map((e) => `${e.path.join('.')}: ${e.message}`).join('\n'),
    };
  }

  const input: GeneratePowershellScriptInput = {
    ...validationResult.data,
  };

  try {
    const result = await generatePowershellScript(input);
    if (result && result.powershellScript) {
      return { success: true, script: result.powershellScript };
    }
    return { success: false, error: 'Failed to generate script: Empty response from AI.' };
  } catch (error) {
    console.error('Error generating PowerShell script:', error);
    return { success: false, error: `Failed to generate script: ${error instanceof Error ? error.message : String(error)}` };
  }
}
