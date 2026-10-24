import { useEffect, useState } from 'react';

export const POLLING_OPTIONS = [
  { label: '15 s', value: 15_000 },
  { label: '30 s', value: 30_000 },
  { label: '60 s', value: 60_000 },
  { label: 'Desligado', value: 0 },
];

const STORAGE_KEY = 'tse_polling_interval';

/** Estado do polling configurável (padrão 30 s). Pausa quando a aba está oculta e persiste no localStorage. */
export function usePolling(defaultInterval = 30_000) {
  const [interval, setIntervalMsState] = useState<number>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved !== null) {
        const parsed = Number(saved);
        if (!isNaN(parsed) && POLLING_OPTIONS.some((o) => o.value === parsed)) {
          return parsed;
        }
      }
    } catch {
      // Ignora erro de localStorage
    }
    return defaultInterval;
  });

  const setIntervalMs = (ms: number) => {
    setIntervalMsState(ms);
    try {
      localStorage.setItem(STORAGE_KEY, String(ms));
    } catch {
      // Ignora erro de localStorage
    }
  };

  const [visible, setVisible] = useState(() => !document.hidden);

  useEffect(() => {
    const onVis = () => setVisible(!document.hidden);
    document.addEventListener('visibilitychange', onVis);
    return () => document.removeEventListener('visibilitychange', onVis);
  }, []);

  return {
    interval,
    setIntervalMs,
    refetchInterval: interval > 0 && visible ? interval : (false as const),
  };
}
