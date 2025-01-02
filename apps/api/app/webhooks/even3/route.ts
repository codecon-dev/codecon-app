import { addEventToAttendee, createAttendee } from '@/services/AttendeeService';
import { createEvent } from '@/services/EventService';
import { env } from '@repo/env';
import type { WebhookEvent } from '@repo/events/server';
import { log } from '@repo/observability/log';
import { headers } from 'next/headers';

export const POST = async (request: Request): Promise<Response> => {
  try {
    const headerPayload = await headers();
    const even3Token = headerPayload.get('x-token-even3');

    if (!even3Token || even3Token !== env.EVEN3_WEBHOOK_SECRET) {
      return new Response('Error occured -- Unauthorized', {
        status: 401,
      });
    }

    const payload = (await request.json()) as WebhookEvent;
    const {
      id,
      data: { pessoa, evento },
    } = payload;

    log.info('Webhook', { id, eventType: 'new.attendee', payload });

    const event = await createEvent(evento);
    const attendee = await createAttendee(pessoa);

    await addEventToAttendee(attendee, event);

    return new Response('User created', { status: 201 });
  } catch (error) {
    log.error('Webhook', { eventType: 'new.attendee', error });
    return new Response('Error occured', { status: 500 });
  }
};
