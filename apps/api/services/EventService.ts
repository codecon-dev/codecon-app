import { database } from '@repo/database';
import { env } from '@repo/env';
import { type EventType, sanitizeEvent } from '@repo/events/server';
import { log } from '@repo/observability/log';

export const createEvent = async (event: EventType) => {
  let eventData = await database.event.findUnique({
    where: { ticketSystemId: event.id },
  });

  if (eventData) {
    log.info('EventService > Evento já existe', {
      eventData,
    });

    return eventData;
  }

  const eventWithMoreData = await getMoreEventData(event);
  const eventSanitized = sanitizeEvent(eventWithMoreData);

  eventData = await database.event.create({
    data: eventSanitized,
  });

  log.info('EventService > Novo evento adicionado', {
    eventData,
  });

  return eventData;
};

const getMoreEventData = async (event: EventType) => {
  const options = {
    method: 'GET',
    headers: {
      'Authorization-App': env.EVEN3_AUTHORIZATION_APP,
      'Authorization-Token': env.EVEN3_TOKEN,
    },
  };

  const response = await fetch(
    'https://www.even3.com.br/api/v1/customclient/events',
    options
  )
    .then((response) => response.json())
    .catch((err) => console.error(err));

  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  const eventData = response.data.find((data: any) => data.id === event.id);

  return eventData;
};
