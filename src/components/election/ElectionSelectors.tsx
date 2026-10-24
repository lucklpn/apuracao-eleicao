import { Select } from '../ui/Select';
import { CARGOS, ELECTIONS, UFS } from '../../services/endpoints';
import type { ElectionContext } from '../../hooks/useElectionData';

interface Props {
  value: ElectionContext;
  onChange: (ctx: ElectionContext) => void;
}

const key = (cycle: string, code: string) => `${cycle}|${code}`;

export function ElectionSelectors({ value, onChange }: Props) {
  const election = ELECTIONS.find((e) => e.cycle === value.cycle && e.code === value.electionCode)!;
  const years = Array.from(new Set(ELECTIONS.map((e) => e.cycle)));
  const turnos = ELECTIONS.filter((e) => e.cycle === value.cycle);

  /** Ajusta cargo/UF para combinações válidas sempre que algo muda. */
  const normalize = (ctx: ElectionContext): ElectionContext => {
    const el = ELECTIONS.find((e) => e.cycle === ctx.cycle && e.code === ctx.electionCode)!;
    const cargo = el.cargos.includes(ctx.cargo) ? ctx.cargo : el.cargos[0];
    const scope = CARGOS[cargo].scope;
    const uf = scope === 'br' ? 'BR' : ctx.uf === 'BR' ? 'SP' : ctx.uf;
    return { ...ctx, cargo, uf };
  };

  const cargoScope = CARGOS[value.cargo].scope;

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
      <Select
        label="Ano / Ciclo"
        value={value.cycle}
        onChange={(e) => {
          const first = ELECTIONS.find((x) => x.cycle === e.target.value)!;
          onChange(normalize({ ...value, cycle: first.cycle, electionCode: first.code }));
        }}
      >
        {years.map((y) => (
          <option key={y} value={y}>
            {y.replace('ele', '')}
          </option>
        ))}
      </Select>
      <Select
        label="Turno / Eleição"
        value={key(election.cycle, election.code)}
        onChange={(e) => {
          const [cycle, code] = e.target.value.split('|');
          onChange(normalize({ ...value, cycle, electionCode: code }));
        }}
      >
        {turnos.map((t) => (
          <option key={t.code} value={key(t.cycle, t.code)}>
            {t.label}
          </option>
        ))}
      </Select>
      <Select
        label="Cargo"
        value={value.cargo}
        onChange={(e) => onChange(normalize({ ...value, cargo: Number(e.target.value) }))}
      >
        {election.cargos.map((c) => (
          <option key={c} value={c}>
            {CARGOS[c].label}
          </option>
        ))}
      </Select>
      <Select
        label="Unidade Federativa"
        value={value.uf}
        disabled={cargoScope === 'br'}
        onChange={(e) => onChange({ ...value, uf: e.target.value })}
      >
        {UFS.filter((u) => (cargoScope === 'br' ? u === 'BR' : u !== 'BR')).map((u) => (
          <option key={u} value={u}>
            {u === 'BR' ? 'Brasil' : u}
          </option>
        ))}
      </Select>
    </div>
  );
}
