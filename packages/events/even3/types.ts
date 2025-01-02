type AttendeeType = {
  id: number;
  nome: string;
  email: string;
  nacionalidade: string;
  cpf: string;
  passaporte: string;
  nome_para_cracha: string;
  celular: string;
  telefone_fixo: string;
  formacao_academica: string;
  area_conhecimento: string;
  subarea_conhecimento: string;
  genero: string;
  instituicao: string;
  foto: string;
  data_nascimento: string;
  cargo_instituicao: string;
  endereco_rua: string;
  endereco_numero: string;
  endereco_bairro: string;
  endereco_cep: string;
  endereco_cidade: string;
  endereco_estado: string;
  endereco_pais: string;
  cultura: string;
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  personalizado: any[];
};

type RegistrationType = {
  id: string;
  codigo: string;
  titulo: string;
  data_inscricao: Date;
};

type EventType = {
  id: string;
  url: string;
  titulo: string;
  data: Date;
};

type WebhookEvent = {
  id: string;
  created: number;
  type: {
    id: number;
    name: string;
  };
  data: {
    pessoa: AttendeeType;
    inscricao: RegistrationType;
    evento: EventType;
  };
};

type State =
  | 'Acre'
  | 'Alagoas'
  | 'Amapá'
  | 'Amazonas'
  | 'Bahia'
  | 'Ceará'
  | 'Distrito Federal'
  | 'Espírito Santo'
  | 'Goiás'
  | 'Maranhão'
  | 'Mato Grosso'
  | 'Mato Grosso do Sul'
  | 'Minas Gerais'
  | 'Pará'
  | 'Paraíba'
  | 'Paraná'
  | 'Pernambuco'
  | 'Piauí'
  | 'Rio de Janeiro'
  | 'Rio Grande do Norte'
  | 'Rio Grande do Sul'
  | 'Rondônia'
  | 'Roraima'
  | 'Santa Catarina'
  | 'São Paulo'
  | 'Sergipe'
  | 'Tocantins';

type Gender = 'M' | 'F' | 'O';

type AttendeeSanitizedType = {
  ticketSystemUserId: number;
  firstName: string;
  lastName: string;
  displayName: string;
  gender: Gender;
  email: string;
  mobilePhone?: string;
  birthDate?: Date;
  city: string;
  state: State;
  linkedin?: string;
  github?: string;
  company?: string;
  companySegment?: string;
  position?: string;
  positionLevel?: string;
};

export type {
  AttendeeType,
  RegistrationType,
  EventType,
  WebhookEvent,
  AttendeeSanitizedType,
  State,
  Gender,
};
