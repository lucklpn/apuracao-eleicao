import { Moon, Sun, Vote } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Button } from '../ui/Button';

export function Header() {
  const [dark, setDark] = useState(() => document.documentElement.classList.contains('dark'));

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark);
    try {
      localStorage.setItem('theme', dark ? 'dark' : 'light');
    } catch {
      /* ignore */
    }
  }, [dark]);

  return (
    <header className="border-b border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3">
        <div className="flex items-center gap-2">
          <Vote className="h-6 w-6 text-blue-700 dark:text-blue-400" aria-hidden />
          <div>
            <h1 className="text-lg font-bold leading-tight">Apuração de Votos</h1>
            <p className="text-xs text-slate-600 dark:text-slate-300">Dados abertos do TSE</p>
          </div>
        </div>
        <Button
          onClick={() => setDark((d) => !d)}
          aria-label={dark ? 'Ativar modo claro' : 'Ativar modo escuro'}
        >
          {dark ? <Sun className="h-4 w-4" aria-hidden /> : <Moon className="h-4 w-4" aria-hidden />}
        </Button>
      </div>
    </header>
  );
}
