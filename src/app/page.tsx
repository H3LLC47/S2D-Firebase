'use client';

import { useState } from 'react';
import { Header } from '@/components/layout/header';
import { S2DConfigForm } from '@/components/s2d/s2d-config-form';
import { S2DScriptDisplay } from '@/components/s2d/s2d-script-display';
import type { S2DConfigFormData } from '@/lib/schemas/s2d-schema';
import { handleGenerateScript } from '@/lib/actions/s2d-actions';
import { useToast } from '@/hooks/use-toast';
import { Separator } from '@/components/ui/separator';

export default function S2DDeployPage() {
  const [scriptContent, setScriptContent] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { toast } = useToast();

  const onSubmit = async (data: S2DConfigFormData) => {
    setIsLoading(true);
    setScriptContent(''); // Clear previous script

    const result = await handleGenerateScript(data);

    if (result.success && result.script) {
      setScriptContent(result.script);
      toast({
        title: 'Script Generated Successfully!',
        description: 'The PowerShell script is ready for review.',
      });
    } else {
      toast({
        title: 'Error Generating Script',
        description: result.error || 'An unknown error occurred.',
        variant: 'destructive',
      });
    }
    setIsLoading(false);
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="space-y-8">
          <S2DConfigForm onSubmit={onSubmit} isLoading={isLoading} />
          <Separator className="my-8" />
          <S2DScriptDisplay scriptContent={scriptContent} setScriptContent={setScriptContent} />
        </div>
      </main>
      <footer className="py-6 text-center text-sm text-muted-foreground border-t">
        S2D Deploy &copy; {new Date().getFullYear()}
      </footer>
    </div>
  );
}
