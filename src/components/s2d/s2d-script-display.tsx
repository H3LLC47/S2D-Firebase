'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Copy, Download, FileText } from 'lucide-react';

interface S2DScriptDisplayProps {
  scriptContent: string;
  setScriptContent: (content: string) => void;
}

export function S2DScriptDisplay({ scriptContent, setScriptContent }: S2DScriptDisplayProps) {
  const { toast } = useToast();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleCopyToClipboard = async () => {
    if (!scriptContent) {
      toast({ title: 'Nothing to copy', description: 'Generate a script first.', variant: 'destructive' });
      return;
    }
    try {
      await navigator.clipboard.writeText(scriptContent);
      toast({ title: 'Copied to clipboard!', description: 'PowerShell script copied successfully.' });
    } catch (err) {
      toast({ title: 'Copy failed', description: 'Could not copy script to clipboard.', variant: 'destructive' });
      console.error('Failed to copy: ', err);
    }
  };

  const handleDownloadScript = () => {
    if (!scriptContent) {
      toast({ title: 'Nothing to download', description: 'Generate a script first.', variant: 'destructive' });
      return;
    }
    const blob = new Blob([scriptContent], { type: 'text/powershell;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'Deploy-S2D.ps1';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);
    toast({ title: 'Download started', description: 'Deploy-S2D.ps1 is downloading.' });
  };

  if (!isMounted) {
    // Avoid rendering textarea on server to prevent hydration mismatch if its value is dynamic
    return (
       <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center">
            <FileText className="mr-2" /> Generated PowerShell Script
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-96 border border-dashed rounded-md">
            <p className="text-muted-foreground">Loading script editor...</p>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card className="shadow-lg">
      <CardHeader>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
          <CardTitle className="flex items-center">
            <FileText className="mr-2" /> Generated PowerShell Script
          </CardTitle>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm" onClick={handleCopyToClipboard} disabled={!scriptContent}>
              <Copy className="mr-2 h-4 w-4" /> Copy
            </Button>
            <Button variant="outline" size="sm" onClick={handleDownloadScript} disabled={!scriptContent}>
              <Download className="mr-2 h-4 w-4" /> Download
            </Button>
          </div>
        </div>
        <CardDescription>Review and edit the generated script below. It will be executed on your target servers.</CardDescription>
      </CardHeader>
      <CardContent>
        {scriptContent ? (
          <Textarea
            value={scriptContent}
            onChange={(e) => setScriptContent(e.target.value)}
            placeholder="PowerShell script will appear here..."
            rows={20}
            className="font-mono text-sm bg-muted/20 p-4 rounded-md shadow-inner focus:ring-accent"
            aria-label="PowerShell Script Editor"
          />
        ) : (
          <div className="flex items-center justify-center h-96 border border-dashed rounded-md bg-muted/20">
            <p className="text-muted-foreground text-center">
              Fill out the configuration form and click "Generate Script"
              <br />
              The PowerShell script will appear here.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
