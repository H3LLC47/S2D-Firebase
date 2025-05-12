import { TerminalSquare } from 'lucide-react';

export function Header() {
  return (
    <header className="bg-primary text-primary-foreground shadow-md">
      <div className="container mx-auto px-4 py-4 flex items-center">
        <TerminalSquare size={32} className="mr-3" />
        <h1 className="text-2xl font-bold">S2D Deploy</h1>
      </div>
    </header>
  );
}
