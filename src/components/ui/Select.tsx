import { useId, type SelectHTMLAttributes } from 'react';
import { cn } from '../../utils/cn';

interface Props extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
}

/** Select nativo estilizado: acessível por padrão (teclado e leitores de tela). */
export function Select({ label, className, children, ...props }: Props) {
  const id = useId();
  return (
    <div className="flex w-full min-w-0 flex-1 flex-col gap-1 sm:min-w-[8.5rem]">
      <label htmlFor={id} className="truncate text-xs font-medium text-slate-600 dark:text-slate-300">
        {label}
      </label>
      <select
        id={id}
        className={cn(
          'w-full max-w-full truncate rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100',
          className,
        )}
        {...props}
      >
        {children}
      </select>
    </div>
  );
}
