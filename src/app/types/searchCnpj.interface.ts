interface Atividade {
  code: string;
  text: string;
}

interface Socio {
  nome: string;
  qual: string;
}

interface Billing {
  free: boolean;
  database: boolean;
}

export interface SearchCNPJ {
  data: {

    abertura: string;
    atividadeComercial: Atividade[];
    atividades_secundarias: Atividade[];
    bairro: string;
    billing: Billing;
    capital_social: string;
    cep: string;
    cnpj: string;
    cnae: string,
    complemento: string;
    data_situacao: string;
    data_situacao_especial: string;
    efr: string;
    email: string;
    fantasia: string;
    logradouro: string;
    motivo_situacao: string;
    municipio: string;
    natureza_juridica: string;
    nome: string;
    numero: string;
    porte: string;
    qsa: Socio[];
    situation: string;
    situacao_especial: string;
    status: string;
    telefone: string;
    tipo: string;
    uf: string;
    ultima_atualizacao: string;
  }
}
