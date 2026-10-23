import { useEffect, useState } from 'react';

export const POLLING_OPTIONS = [
  { label: '15 s', value: 15_000 },
  { label: '30 s', value: 30_000 },
  { label: '60 s', value: 60_000 },
  { label: 'Desligado', value: 0 },
];

/** Estado do polling configurável (padrão 30 s). Pausa quando a aba está oculta. */
export function usePolling(initial = 30_000) {
  const [interval, setIntervalMs] = useState(initial);
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
