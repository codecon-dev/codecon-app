import { analytics } from '@repo/analytics/posthog/server';
import {
  type CompanySegment,
  type Position,
  type PositionLevel,
  database,
} from '@repo/database';
import type { AttendeeType } from '@repo/events/server';
import { sanitizeAttendee } from '@repo/events/server';

export const createAttendee = async (attendee: AttendeeType): Promise<void> => {
  const attendeeSanitized = sanitizeAttendee(attendee);

  const {
    ticketSystemUserId,
    firstName,
    lastName,
    displayName,
    gender,
    email,
    city,
    state,
    linkedin,
    github,
    company,
    companySegment,
    position,
    positionLevel,
  } = attendeeSanitized;

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

  await database.attendee.create({
    data: {
      ticketSystemUserId,
      firstName,
      lastName,
      displayName,
      gender,
      email,
      city,
      state,
      linkedin,
      github,
      company,
      companySegment: companySegmentData
        ? { connect: { id: companySegmentData.id } }
        : undefined,
      position: positionData ? { connect: { id: positionData.id } } : undefined,
      positionLevel: positionLevelData
        ? { connect: { id: positionLevelData.id } }
        : undefined,
    },
  });

  analytics.capture({
    event: 'User Created',
    distinctId: `${attendeeSanitized.ticketSystemUserId}`,
  });

  await analytics.shutdown();
};
