import { useId, type SelectHTMLAttributes } from 'react';
import { cn } from '../../utils/cn';

interface Props extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
}

/** Select nativo estilizado: acessível por padrão (teclado e leitores de tela). */
export function Select({ label, className, children, ...props }: Props) {
  const id = useId();
  return (
    <div className="flex min-w-[9rem] flex-1 flex-col gap-1">
      <label htmlFor={id} className="text-xs font-medium text-slate-600 dark:text-slate-300">
        {label}
      </label>
      <select
        id={id}
        className={cn(
          'rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100',
          className,
        )}
        {...props}
      >
        {children}
      </select>
    </div>
  );
}
