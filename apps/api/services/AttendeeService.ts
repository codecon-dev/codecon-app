import {
  type Attendee,
  type CompanySegment,
  type Event,
  type Position,
  type PositionLevel,
  database,
} from '@repo/database';
import type { AttendeeType } from '@repo/events/server';
import { sanitizeAttendee } from '@repo/events/server';
import { log } from '@repo/observability/log';

export const createAttendee = async (
  attendee: AttendeeType
): Promise<Attendee> => {
  const attendeeSanitized = sanitizeAttendee(attendee);

  let attendeeData = await database.attendee.findFirst({
    where: { email: attendeeSanitized.email },
  });

  if (attendeeData) {
    log.info('AttendeeService > Usuário já existe', {
      attendeeData,
    });

    return attendeeData;
  }

  const { companySegment, position, positionLevel } = attendeeSanitized;

  let companySegmentData: CompanySegment | null = null;
  let positionData: Position | null = null;
  let positionLevelData: PositionLevel | null = null;

  if (companySegment) {
    companySegmentData = await database.companySegment.findFirst({
      where: { name: companySegment },
    });

    if (!companySegmentData) {
      companySegmentData = await database.companySegment.create({
        data: { name: companySegment },
      });
    }
  }

  if (position) {
    positionData = await database.position.findFirst({
      where: { name: position },
    });

    if (!positionData) {
      positionData = await database.position.create({
        data: { name: position },
      });
    }
  }

  if (positionLevel) {
    positionLevelData = await database.positionLevel.findFirst({
      where: { name: positionLevel },
    });

    if (!positionLevelData) {
      positionLevelData = await database.positionLevel.create({
        data: { name: positionLevel },
      });
    }
  }

  attendeeData = await database.attendee.create({
    data: {
      ...attendeeSanitized,
      companySegment: companySegmentData
        ? { connect: { id: companySegmentData.id } }
        : undefined,
      position: positionData ? { connect: { id: positionData.id } } : undefined,
      positionLevel: positionLevelData
        ? { connect: { id: positionLevelData.id } }
        : undefined,
    },
  });

  log.info('AttendeeService > Novo usuário adicionado', {
    attendeeData,
  });

  return attendeeData;
};

export const addEventToAttendee = async (
  attendee: Attendee,
  event: Event
): Promise<void> => {
  await database.attendee.update({
    where: { id: attendee.id },
    data: {
      events: {
        connect: { id: event.id },
      },
    },
  });
};
