import 'server-only';

import type {
  AttendeeSanitizedType,
  AttendeeType,
  Gender,
  State,
} from './even3/types';

export const sanitizeAttendee = (
  attendee: AttendeeType
): AttendeeSanitizedType => {
  const fullName = attendee.nome;
  const fullNameSplit = fullName.split(' ');

  const firstName: string = fullNameSplit[0];
  const lastName: string = fullNameSplit.at(-1) || '';
  let linkedin: string | undefined;
  let github: string | undefined;
  let company: string | undefined;
  let companySegment: string | undefined;
  let position: string | undefined;
  let positionLevel: string | undefined;

  for (const field of attendee.personalizado) {
    switch (field.titulo) {
      case 'Linkedin ou Github':
        if (field.resposta.includes('linkedin.com')) {
          linkedin = field.resposta;
        } else if (field.resposta.includes('github.com')) {
          github = field.resposta;
        }
        break;
      case 'Empresa (opcional)':
        company = field.resposta;
        break;
      case 'Segmento de atuação (opcional)':
        companySegment = field.resposta;
        break;
      case 'Seu cargo (opcional)':
        position = field.resposta;
        break;
      case 'Nível de experiência (opcional)':
        positionLevel = field.resposta;
        break;
      default:
        break;
    }
  }

  return {
    ticketSystemUserId: attendee.id,
    firstName,
    lastName,
    displayName: attendee.nome_para_cracha,
    gender: attendee.genero as Gender,
    email: attendee.email,
    city: attendee.endereco_cidade,
    state: attendee.endereco_estado as State,
    linkedin,
    github,
    company,
    companySegment,
    position,
    positionLevel,
  };
};

export * from './even3/types';
