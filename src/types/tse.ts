export interface TSEConfigElection {
  id: string;
  cd: string;
  nm: string;
  tp: string;
}

export interface TSECandidateResult {
  seq: string; // Sequencial do candidato
  sqcand: string; // Número de registro
  n: string; // Número de urna (ex: "13", "22")
  nm: string; // Nome de registro
  nmu: string; // Nome na urna
  cc: string; // Sigla do partido / coligação
  nv: string; // Nome do vice / suplente
  e: 'S' | 'N'; // Eleito ('S' ou 'N')
  st: string; // Situação (ex: 'Eleito', '2º turno', 'Não eleito')
  vap: string; // Votos apurados (formato numérico string)
  pvap: string; // Percentual de votos apurados (ex: "50,15")
}

export interface TSEResultsResponse {
  ele: string; // Código da eleição
  cdabr: string; // Código de abrangência (ex: "br", "sp")
  hg: string; // Hora da geração dos dados
  dt: string; // Data da geração
  s: string; // Total de seções
  st: string; // Seções totalizadas/apuradas
  pst: string; // Percentual de seções totalizadas
  vnom: string; // Votos nominais
  vb: string; // Votos brancos
  pvb: string; // Percentual votos brancos
  vn: string; // Votos nulos
  pvn: string; // Percentual votos nulos
  a: string; // Abstenções
  pa: string; // Percentual de abstenções
  cand: TSECandidateResult[];
}

/** Opção de eleição disponível nos seletores. */
export interface ElectionOption {
  cycle: string; // ex: "ele2022"
  code: string; // código da eleição, ex: "544"
  label: string;
  cargos: number[]; // cargos disponíveis
}

export interface Cargo {
  code: number;
  label: string;
  /** "br" = apenas nacional; "uf" = apenas estados */
  scope: 'br' | 'uf';
}
