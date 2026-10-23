import { Loader2, RefreshCw, CheckCircle2, AlertTriangle } from 'lucide-react';
import { Button } from '../ui/Button';
import { Select } from '../ui/Select';
import { POLLING_OPTIONS } from '../../hooks/usePolling';

interface Props {
  isFetching: boolean;
  isError: boolean;
  dataUpdatedAt: number;
  interval: number;
  onIntervalChange: (ms: number) => void;
  onRefresh: () => void;
}

export function PollingIndicator({
  isFetching,
  isError,
  dataUpdatedAt,
  interval,
  onIntervalChange,
  onRefresh,
}: Props) {
  const time = dataUpdatedAt ? new Date(dataUpdatedAt).toLocaleTimeString('pt-BR') : '—';
  return (
    <div className="flex flex-wrap items-end gap-3" role="status" aria-live="polite">
      <div className="flex items-center gap-2 text-sm">
        {isFetching ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin text-blue-700 dark:text-blue-400" aria-hidden />
            <span>Sincronizando…</span>
          </>
        ) : isError ? (
          <>
            <AlertTriangle className="h-4 w-4 text-amber-700 dark:text-amber-400" aria-hidden />
            <span>Falha na última sincronização ({time})</span>
          </>
        ) : (
          <>
            <CheckCircle2 className="h-4 w-4 text-green-700 dark:text-green-400" aria-hidden />
            <span>Atualizado às {time}</span>
          </>
        )}
      </div>
      <Select
        label="Atualização automática"
        value={interval}
        onChange={(e) => onIntervalChange(Number(e.target.value))}
        className="py-1.5"
      >
        {POLLING_OPTIONS.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </Select>
      <Button onClick={onRefresh} disabled={isFetching}>
        <RefreshCw className={isFetching ? 'h-4 w-4 animate-spin' : 'h-4 w-4'} aria-hidden />
        Atualizar agora
      </Button>
    </div>
  );
}
