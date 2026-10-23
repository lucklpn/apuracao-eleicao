import { Line, LineChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import type { TSECandidateResult } from '../../types/tse';

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
  const data = history.map((h) => ({
    hora: new Date(h.at).toLocaleTimeString('pt-BR'),
    ...h.values,
  }));

  return (
    <div className="h-72 w-full">
      <ResponsiveContainer>
        <LineChart data={data} margin={{ top: 8, right: 16, bottom: 0, left: 0 }}>
          <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
          <XAxis dataKey="hora" tick={{ fontSize: 11 }} />
          <YAxis unit="%" domain={[0, 'auto']} tick={{ fontSize: 11 }} />
          <Tooltip formatter={(v: number) => `${v.toFixed(2).replace('.', ',')}%`} />
          <Legend />
          {names.map((n, i) => (
            <Line key={n} type="monotone" dataKey={n} stroke={COLORS[i % COLORS.length]} dot={false} strokeWidth={2} />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
