'use client';

import type { S2DConfigFormData } from '@/lib/schemas/s2d-schema';
import { S2DConfigSchema } from '@/lib/schemas/s2d-schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

interface S2DConfigFormProps {
  onSubmit: (data: S2DConfigFormData) => Promise<void>;
  isLoading: boolean;
}

export function S2DConfigForm({ onSubmit, isLoading }: S2DConfigFormProps) {
  const form = useForm<S2DConfigFormData>({
    resolver: zodResolver(S2DConfigSchema),
    defaultValues: {
      virtualSwitchName: 'ExternalSwitch',
      storageNodes: 'S2DNode1,S2DNode2',
      clusterName: 'S2DCluster',
      storagePoolFriendlyName: 'S2DPool',
      storageTier1Name: 'Performance',
      storageTier1MediaType: 'SSD',
      storageTier1ResiliencySettingName: 'Mirror',
      storageTier2Name: 'Capacity',
      storageTier2MediaType: 'HDD',
      storageTier2ResiliencySettingName: 'Parity',
      enableDeduplication: false,
      cacheDriveLetter: 'C',
      capacityDriveLetter: 'D',
    },
  });

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle>Deployment Configuration</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="virtualSwitchName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Virtual Switch Name</FormLabel>
                    <FormControl>
                      <Input placeholder="ExternalSwitch" {...field} />
                    </FormControl>
                    <FormDescription>Name for the Hyper-V external virtual switch.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="storageNodes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Storage Nodes</FormLabel>
                    <FormControl>
                      <Input placeholder="S2DNode1,S2DNode2,S2DNode3" {...field} />
                    </FormControl>
                    <FormDescription>Comma-separated list of server names.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="clusterName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cluster Name</FormLabel>
                    <FormControl>
                      <Input placeholder="S2DCluster" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="storagePoolFriendlyName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Storage Pool Friendly Name</FormLabel>
                    <FormControl>
                      <Input placeholder="S2DPool" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <h3 className="text-lg font-semibold pt-4 border-t mt-6">Storage Tier 1</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <FormField
                control={form.control}
                name="storageTier1Name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="PerformanceTier" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="storageTier1MediaType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Media Type</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select media type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="SSD">SSD</SelectItem>
                        <SelectItem value="HDD">HDD</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="storageTier1ResiliencySettingName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Resiliency</FormLabel>
                    <FormControl>
                      <Input placeholder="Mirror" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <h3 className="text-lg font-semibold pt-4 border-t mt-6">Storage Tier 2</h3>
             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <FormField
                control={form.control}
                name="storageTier2Name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="CapacityTier" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="storageTier2MediaType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Media Type</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select media type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="SSD">SSD</SelectItem>
                        <SelectItem value="HDD">HDD</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="storageTier2ResiliencySettingName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Resiliency</FormLabel>
                    <FormControl>
                      <Input placeholder="Parity" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <h3 className="text-lg font-semibold pt-4 border-t mt-6">Other Settings</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="cacheDriveLetter"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cache Drive Letter</FormLabel>
                    <FormControl>
                      <Input placeholder="C" {...field} maxLength={1} />
                    </FormControl>
                    <FormDescription>Assign to Cache tier (e.g., C).</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="capacityDriveLetter"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Capacity Drive Letter</FormLabel>
                    <FormControl>
                      <Input placeholder="D" {...field} maxLength={1} />
                    </FormControl>
                    <FormDescription>Assign to Capacity tier (e.g., D).</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
             <FormField
                control={form.control}
                name="enableDeduplication"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 md:col-span-2">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Enable Data Deduplication</FormLabel>
                      <FormDescription>
                        Enable data deduplication on the storage tiers.
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />
            </div>

            <Button type="submit" className="w-full md:w-auto bg-secondary hover:bg-secondary/90" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                'Generate PowerShell Script'
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
