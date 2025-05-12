import { z } from 'zod';

export const S2DConfigSchema = z.object({
  virtualSwitchName: z.string().min(1, 'Virtual switch name is required.'),
  storageNodes: z.string().min(1, 'Storage nodes are required.').describe('Comma-separated list of server names.'),
  clusterName: z.string().min(1, 'Cluster name is required.'),
  storagePoolFriendlyName: z.string().min(1, 'Storage pool friendly name is required.'),
  storageTier1Name: z.string().min(1, 'Storage tier 1 name is required.'),
  storageTier1MediaType: z.enum(['SSD', 'HDD'], { message: 'Invalid media type for tier 1.' }),
  storageTier1ResiliencySettingName: z.string().min(1, 'Resiliency setting for tier 1 is required.'),
  storageTier2Name: z.string().min(1, 'Storage tier 2 name is required.'),
  storageTier2MediaType: z.enum(['SSD', 'HDD'], { message: 'Invalid media type for tier 2.' }),
  storageTier2ResiliencySettingName: z.string().min(1, 'Resiliency setting for tier 2 is required.'),
  enableDeduplication: z.boolean().default(false),
  cacheDriveLetter: z.string()
    .length(1, 'Cache drive letter must be a single character.')
    .regex(/^[A-Z]$/i, 'Cache drive letter must be an uppercase letter (A-Z).') // Allow lowercase input but AI prompt assumes uppercase
    .describe('Single uppercase drive letter (e.g., C)'),
  capacityDriveLetter: z.string()
    .length(1, 'Capacity drive letter must be a single character.')
    .regex(/^[A-Z]$/i, 'Capacity drive letter must be an uppercase letter (A-Z).') // Allow lowercase input but AI prompt assumes uppercase
    .describe('Single uppercase drive letter (e.g., D)'),
  rebootAfterCompletion: z.boolean().default(false).describe('Whether to reboot nodes after successful script completion.'),
});

export type S2DConfigFormData = z.infer<typeof S2DConfigSchema>;
