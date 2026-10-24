import { Line, LineChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import type { TSECandidateResult } from '../../types/tse';
import { useMemo } from 'react';

export interface Snapshot {
  at: number;
  pst: number;
  /** percentual por candidato (chave = nome de urna) */
  values: Record<string, number>;
}

const COLORS = ['#1d4ed8', '#dc2626', '#16a34a', '#d97706', '#7c3aed', '#0891b2'];

export default function HistoryChart({
  history,
  top,
}: {
  history: Snapshot[];
  top: TSECandidateResult[];
}) {
  const names = top.map((c) => c.nmu || c.nm);

  // Calcula dinamicamente o domínio do eixo Y com margem para evidenciar a oscilação
  const yDomain = useMemo<[number, number] | [number, string]>(() => {
    let min = Infinity;
    let max = -Infinity;

    history.forEach((h) => {
      names.forEach((name) => {
        const val = h.values[name];
        if (typeof val === 'number') {
          if (val < min) min = val;
          if (val > max) max = val;
        }
      });
    });

    if (min === Infinity || max === -Infinity) {
      return [0, 'auto'];
    }

    // Se houver pouca variação, adiciona margem superior e inferior para não ficar uma reta estática
    const span = max - min;
    const padding = Math.max(span * 0.25, 2); // pelo menos 2% de padding
    const lower = Math.max(0, Math.floor(min - padding));
    const upper = Math.min(100, Math.ceil(max + padding));

    return [lower, upper];
  }, [history, names]);

  const data = history.map((h) => ({
    hora: new Date(h.at).toLocaleTimeString('pt-BR'),
    secoes: `${h.pst.toFixed(1)}%`,
    ...h.values,
  }));

  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 8, right: 12, bottom: 4, left: -10 }}>
          <CartesianGrid strokeDasharray="3 3" opacity={0.25} />
          <XAxis dataKey="hora" tick={{ fontSize: 10 }} />
          <YAxis unit="%" domain={yDomain} tick={{ fontSize: 10 }} />
          <Tooltip
            formatter={(v: number) => `${v.toFixed(2).replace('.', ',')}%`}
            labelFormatter={(label, payload) => {
              const p = payload?.[0]?.payload?.secoes;
              return p ? `${label} (${p} apurado)` : label;
            }}
          />
          <Legend wrapperStyle={{ fontSize: 11 }} />
          {names.map((n, i) => (
            <Line
              key={n}
              type="monotone"
              dataKey={n}
              stroke={COLORS[i % COLORS.length]}
              dot={{ r: 2 }}
              activeDot={{ r: 4 }}
              strokeWidth={2}
              isAnimationActive={false}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
