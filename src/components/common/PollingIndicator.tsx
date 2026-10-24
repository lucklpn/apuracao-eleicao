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
    <div className="flex flex-col gap-3 pt-1 sm:flex-row sm:items-end sm:justify-between" role="status" aria-live="polite">
      <div className="flex items-center gap-2 text-xs sm:text-sm">
        {isFetching ? (
          <>
            <Loader2 className="h-4 w-4 shrink-0 animate-spin text-blue-700 dark:text-blue-400" aria-hidden />
            <span className="truncate">Sincronizando…</span>
          </>
        ) : isError ? (
          <>
            <AlertTriangle className="h-4 w-4 shrink-0 text-amber-700 dark:text-amber-400" aria-hidden />
            <span className="truncate">Falha na última sincronização ({time})</span>
          </>
        ) : (
          <>
            <CheckCircle2 className="h-4 w-4 shrink-0 text-green-700 dark:text-green-400" aria-hidden />
            <span className="truncate">Atualizado às {time}</span>
          </>
        )}
      </div>

      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:gap-3">
        <div className="w-full sm:w-44">
          <Select
            label="Atualização automática"
            value={interval}
            onChange={(e) => onIntervalChange(Number(e.target.value))}
            className="py-1.5 text-xs sm:text-sm"
          >
            {POLLING_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </Select>
        </div>
        <Button onClick={onRefresh} disabled={isFetching} className="w-full sm:w-auto shrink-0 py-2">
          <RefreshCw className={isFetching ? 'h-4 w-4 animate-spin' : 'h-4 w-4'} aria-hidden />
          <span>Atualizar agora</span>
        </Button>
      </div>
    </div>
  );
}
