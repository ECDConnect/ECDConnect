import { AttendanceDto } from '@ecdlink/core';
import { attendanceActions, attendanceReducer } from './attendance';
import { getAttendance, trackAttendanceSync } from './attendance.actions';
import { AttendanceState } from './attendance.types';

const programmeId = '3f1a8c2e-6b4d-4e7a-9c21-0d5b6a7e8f90';
const childId = 'aa1a8c2e-6b4d-4e7a-9c21-0d5b6a7e8f90';
const otherChildId = 'bb1a8c2e-6b4d-4e7a-9c21-0d5b6a7e8f90';
const attendanceDate = '2026-10-06T00:00:00.000Z';

const empty = attendanceReducer(undefined, { type: '@@INIT' });

const track = (state: AttendanceState, attended: boolean) =>
  attendanceReducer(
    state,
    attendanceActions.trackAttendance({
      classroomProgrammeId: programmeId,
      programmeOwnerId: 'owner-1',
      attendanceDate,
      attendees: [{ userId: childId, attended }],
    })
  );

const fetched = (
  state: AttendanceState,
  rows: AttendanceDto[],
  overrideCache = false
) =>
  attendanceReducer(state, {
    type: getAttendance.fulfilled.type,
    payload: rows,
    meta: {
      arg: {
        startDate: new Date(2026, 8, 6),
        endDate: new Date(2026, 9, 6),
        overrideCache,
      },
    },
  });

const markedSynced = (state: AttendanceState) =>
  attendanceReducer(state, {
    type: trackAttendanceSync.fulfilled.type,
    payload: [
      {
        classroomProgrammeId: programmeId,
        programmeOwnerId: 'owner-1',
        attendanceDate,
        attendees: [{ userId: childId, attended: true }],
      },
    ],
    meta: { arg: {} },
  });

const childRow = (state: AttendanceState, userId = childId) =>
  state.attendance?.find((row) => row.userId === userId);

describe('attendance pull', () => {
  test('keeps a register that is still waiting to upload', () => {
    let state = track(empty, true);
    const storedDate = state.attendance?.[0].attendanceDate;

    state = fetched(state, [
      {
        classroomProgrammeId: programmeId,
        userId: childId,
        attendanceDate: storedDate,
        attended: false,
      },
    ]);

    expect(childRow(state)?.attended).toEqual(true);
    expect(state.attendanceTracked).toHaveLength(1);
    expect(state.attendanceTracked?.[0].synced).not.toEqual(true);
    expect(state.attendanceTracked?.[0].attendees?.[0].attended).toEqual(true);
  });

  test('replaces an uploaded register with the server edit', () => {
    let state = markedSynced(track(empty, true));
    const storedDate = state.attendance?.[0].attendanceDate;

    state = fetched(state, [
      {
        classroomProgrammeId: programmeId,
        userId: childId,
        attendanceDate: storedDate,
        attended: false,
      },
    ]);

    expect(childRow(state)?.attended).toEqual(false);
    expect(state.attendanceTracked).toHaveLength(1);
    expect(state.attendanceTracked?.[0].synced).toEqual(true);
    expect(state.attendanceTracked?.[0].attendees?.[0].attended).toEqual(true);
  });

  test('adds another day from the server without dropping the pending one', () => {
    let state = track(empty, true);
    const storedDate = state.attendance?.[0].attendanceDate;

    state = fetched(state, [
      {
        classroomProgrammeId: programmeId,
        userId: childId,
        attendanceDate: storedDate,
        attended: false,
      },
      {
        classroomProgrammeId: programmeId,
        userId: otherChildId,
        attendanceDate: '2026-10-07T00:00:00.000Z',
        attended: true,
      },
    ]);

    expect(childRow(state)?.attended).toEqual(true);
    expect(childRow(state, otherChildId)?.attended).toEqual(true);
    expect(state.attendance).toHaveLength(2);
  });

  test('a server pull does not queue the fetched register for upload', () => {
    const state = fetched(empty, [
      {
        classroomProgrammeId: programmeId,
        userId: childId,
        attendanceDate,
        attended: false,
      },
    ]);

    expect(childRow(state)?.attended).toEqual(false);
    expect(state.attendanceTracked).toBeUndefined();
  });
});
