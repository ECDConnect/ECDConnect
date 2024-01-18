import { UserTypeEnum } from '@/models/auth/user/UserContext';
import { RootState } from '../types';
import { createSelector } from '@reduxjs/toolkit';
import { getLatestPqaOrReacreditationRatingByUserId as getLatestPqaOrReaccreditationRatingByUserId } from '../pqa/pqa.selectors';
import { getPractitionerByUserId } from '../practitioner/practitioner.selectors';
import { getClassroomGroupsForUser } from '../classroom/classroom.selectors';
import { getAttendanceReportsForUser } from '../attendance/attendance.selectors';
import { LeagueType } from '@/constants/club';
import { getChildProgressReportsStatusForUser } from '../practitionerForCoach/practitionerForCoach.selectors';
import { ActionItem } from '@/models/club/actionItem';
import { Contribution } from '@/models/club/contribution';

// Practitioner
export const getClubForPractitionerSelector = (state: RootState) =>
  state.clubs?.clubForPractitioner?.club;

export const getLeagueForPractitionerSelector = (state: RootState) =>
  state.clubs?.leagueForPractitioner;

export const getLastCaregiverReportBackDateForPractitioner = (
  state: RootState
) => state.clubs?.practitionerLastCaregiverReportBackDate;

// Coach
export const getAllClubsForCoachSelector = (state: RootState) =>
  Object.values(state.clubs.clubsForCoach).map((x) => x.club);

export const getLeaguesForCoachSelector = (state: RootState) =>
  state.clubs?.leaguesForCoach;

export const getLeagueForCoachSelector = (leagueId: string) =>
  createSelector(
    (state: RootState) => {
      return state.clubs.leaguesForCoach.find((x) => x.id === leagueId);
    },
    (club) => club
  );

// Both
export const getClubByIdSelector = (clubId: string) =>
  createSelector(
    (state: RootState) => {
      if (!clubId || clubId === '') {
        return undefined;
      }

      const user = state.user.user;

      const isCoach = user?.roles?.some((role) =>
        role.name.includes(UserTypeEnum.Coach)
      );

      if (isCoach) {
        return state?.clubs?.clubsForCoach?.[clubId]?.club;
      } else {
        return state?.clubs?.clubForPractitioner?.club;
      }
    },
    (club) => club
  );

export const getClubRankingPercentageSelector = (clubId: string) =>
  createSelector(getClubByIdSelector(clubId), (club) => {
    if (!club?.leagueRanking || !club?.league?.numberOfClubsInLeague) {
      return undefined;
    }

    const clubRankingPercentage =
      (club?.leagueRanking / club?.league?.numberOfClubsInLeague) * 100;

    return clubRankingPercentage;
  });

//TODO figure out how to set return type for these so we can include undefined
export const getCurrentClubLeaderByClubIdSelector = (clubId: string) =>
  createSelector(getClubByIdSelector(clubId), (club) => club?.clubLeader);

export const getNextClubLeaderByClubIdSelector = (clubId: string) =>
  createSelector(
    getClubByIdSelector(clubId),
    (club) => club?.incomingClubLeader
  );

export const getActivityMeetRegularDetailsSelector = (clubId: string) =>
  createSelector(
    (state: RootState) => {
      const user = state.user.user;

      const isCoach = user?.roles?.some((role) =>
        role.name.includes(UserTypeEnum.Coach)
      );

      if (isCoach) {
        return state.clubs.clubsForCoach[clubId].points?.meetRegularly?.data;
      } else {
        return state.clubs.clubForPractitioner?.points?.meetRegularly?.data;
      }
    },
    (meetRegularly) => meetRegularly
  );

export const getActivityBeCreativeDetailsSelector = (clubId: string) =>
  createSelector(
    (state: RootState) => {
      const user = state.user.user;

      const isCoach = user?.roles?.some((role) =>
        role.name.includes(UserTypeEnum.Coach)
      );

      if (isCoach) {
        return state.clubs.clubsForCoach[clubId].points?.beCreative;
      } else {
        return state.clubs.clubForPractitioner?.points?.beCreative;
      }
    },
    (beCreative) => beCreative
  );

export const getActivityHostFamilyDetailsSelector = (clubId: string) =>
  createSelector(
    (state: RootState) => {
      const user = state.user.user;

      const isCoach = user?.roles?.some((role) =>
        role.name.includes(UserTypeEnum.Coach)
      );

      if (isCoach) {
        return state.clubs.clubsForCoach[clubId].points?.hostFamily;
      } else {
        return state.clubs.clubForPractitioner?.points?.hostFamily;
      }
    },
    (hostFamily) => hostFamily
  );

export const getActivityChildProgressReportsSelector = (clubId: string) =>
  createSelector(
    (state: RootState) => {
      const user = state.user.user;

      const isCoach = user?.roles?.some((role) =>
        role.name.includes(UserTypeEnum.Coach)
      );

      if (isCoach) {
        return state.clubs.clubsForCoach[clubId].points?.childProgressDetails;
      } else {
        return state.clubs.clubForPractitioner?.points?.childProgressDetails;
      }
    },
    (childProgressReports) => childProgressReports
  );

export const getActivityLeaveNoOneBehindDetailsSelector = (clubId: string) =>
  createSelector(
    (state: RootState) => {
      const user = state.user.user;

      const isCoach = user?.roles?.some((role) =>
        role.name.includes(UserTypeEnum.Coach)
      );

      if (isCoach) {
        return state.clubs.clubsForCoach[clubId].points?.leaveNoOneBehind;
      } else {
        return state.clubs.clubForPractitioner?.points?.leaveNoOneBehind;
      }
    },
    (leaveNoOneBehind) => leaveNoOneBehind
  );

export const getActivityChildAttendanceDetailsSelector = (clubId: string) =>
  createSelector(
    (state: RootState) => {
      const user = state.user.user;

      const isCoach = user?.roles?.some((role) =>
        role.name.includes(UserTypeEnum.Coach)
      );

      if (isCoach) {
        return state.clubs.clubsForCoach[clubId].points?.childAttendance;
      } else {
        return state.clubs.clubForPractitioner?.points?.childAttendance;
      }
    },
    (childAttendance) => childAttendance
  );

export const getClubActionItemsForPractitionerSelector = (
  userId: string,
  clubId: string
) =>
  createSelector(
    getPractitionerByUserId(userId),
    getActivityMeetRegularDetailsSelector(clubId),
    getActivityHostFamilyDetailsSelector(clubId),
    getNextClubLeaderByClubIdSelector(clubId),
    (
      practitioner,
      meetRegularlyPoints,
      hostFamilyDayPoints,
      nextClubLeader
    ) => {
      if (!practitioner || !practitioner.clubId) {
        return [];
      }

      let actionItems: ActionItem[] = [];

      // Meet regulary
      const meetings = meetRegularlyPoints?.pastMeetings;

      if (!!meetings && !!meetings.length) {
        const meetingsAttended =
          meetings?.filter(
            (meeting) =>
              !!meeting?.meetingParticipants?.find(
                (practitioner) => practitioner?.userId === userId
              )
          ).length || 0;

        const attendancePercentage = meetingsAttended / meetings.length;

        if (attendancePercentage <= 0.6) {
          actionItems.push({
            title: `Missed ${meetings.length - meetingsAttended} club meetings`,
            subTitle: `Contact ${practitioner.user?.firstName}`,
            type: 'MeetRegularly',
            details: {
              meetingsAttended: meetingsAttended,
              meetingsTotal: meetings.length,
            },
          });
        }
      }

      // family days
      if (!!hostFamilyDayPoints && !!hostFamilyDayPoints.terms) {
        const familyDaysHeld =
          hostFamilyDayPoints.terms?.filter(
            (term) =>
              !!term?.meetingParticipantsPractitionerIds &&
              !!term?.meetingParticipantsPractitionerIds.length
          ).length || 0;

        if (familyDaysHeld > 0) {
          const familyDaysAttendanded = hostFamilyDayPoints?.terms?.reduce(
            (count, term) =>
              term?.meetingParticipantsPractitionerIds?.some(
                (practitionerId) => practitionerId === practitioner?.id
              )
                ? (count += 1)
                : count,
            0
          );

          const attendancePercentage = familyDaysAttendanded / familyDaysHeld;

          if (attendancePercentage <= 0.6) {
            actionItems.push({
              title: `Missed ${
                familyDaysHeld - familyDaysAttendanded
              } club events`,
              subTitle: `Contact ${practitioner.user?.firstName}`,
              type: 'HostFamilyDays',
              details: {
                meetingsAttended: familyDaysAttendanded,
                meetingsTotal: familyDaysHeld,
              },
            });
          }
        }
      }

      // accepted club leader
      if (
        !!nextClubLeader &&
        nextClubLeader.userId === userId &&
        !nextClubLeader.dateAccepted
      ) {
        actionItems.push({
          title: `Has not accepted club leader agreement`,
          subTitle: `Contact ${practitioner.user?.firstName}`,
          type: 'AcceptLeaderRole',
          details: {
            dateAssigned: new Date(nextClubLeader.dateAssigned),
          },
        });
      }

      return actionItems;
    }
  );

// TODO: Should this be split into separate selectors?
export const getClubContributionsForPractitionerSelector = (
  userId: string,
  clubId: string
) =>
  createSelector(
    getPractitionerByUserId(userId),
    getClubByIdSelector(clubId),
    getClassroomGroupsForUser(userId),
    getActivityMeetRegularDetailsSelector(clubId),
    getAttendanceReportsForUser(userId),
    getActivityHostFamilyDetailsSelector(clubId),
    getLatestPqaOrReaccreditationRatingByUserId(userId),
    getChildProgressReportsStatusForUser(userId),
    (
      practitioner,
      club,
      userClassroomGroups,
      meetRegularlyPoints,
      attendanceReports,
      hostFamilyDayPoints,
      currentRating,
      progressReportsStatus
    ) => {
      if (!practitioner || !club) {
        return [];
      }

      let contributions: Contribution[] = [];

      // Meet regulary
      const meetings = meetRegularlyPoints?.pastMeetings;

      if (!!meetings && !!meetings.length) {
        const meetingsAttended =
          meetings?.filter(
            (meeting) =>
              !!meeting?.meetingParticipants?.find(
                (practitioner) => practitioner?.userId === userId
              )
          ).length || 0;

        const attendancePercentage = meetingsAttended / meetings.length;

        contributions.push({
          title: 'Meet Regularly',
          subTitle: `Attended ${meetingsAttended} of ${meetings.length} club meetings`,
          positiveStatus: attendancePercentage > 0.6 ? true : false,
        });
      } else {
        contributions.push({
          title: 'Meet Regularly',
          subTitle: `No meetings submitted for ${club.name} club yet`,
          positiveStatus: false,
        });
      }

      // Capture child attendance - only for purple leagues
      if (!!club.league && club.league.leagueTypeName === LeagueType.Purple) {
        if (!!userClassroomGroups.length) {
          if (!!attendanceReports) {
            const attendance = attendanceReports.reduce(
              (sums, report) => {
                return {
                  totalMonths: sums.totalMonths + 1,
                  fullAttendanceMonths:
                    report.percentageAttendance === 100
                      ? sums.fullAttendanceMonths + 1
                      : sums.fullAttendanceMonths,
                };
              },
              { totalMonths: 0, fullAttendanceMonths: 0 }
            );

            contributions.push({
              title: 'Capture child attendance',
              subTitle: `Submitted all attendance registers for ${attendance.fullAttendanceMonths} of ${attendance.totalMonths} months`,
              positiveStatus:
                attendance.fullAttendanceMonths / attendance.totalMonths >=
                0.75,
            });
          }
        } else {
          contributions.push({
            title: 'Capture child attendance',
            subTitle: `Not assigned to a class`,
            positiveStatus: false,
          });
        }
      }

      // family days
      const familyDaysHeld =
        hostFamilyDayPoints?.terms?.filter(
          (term) =>
            !!term?.meetingParticipantsPractitionerIds &&
            !!term?.meetingParticipantsPractitionerIds.length
        ).length || 0;

      if (familyDaysHeld > 0) {
        const familyDaysAttendanded =
          hostFamilyDayPoints?.terms?.reduce(
            (count, term) =>
              term?.meetingParticipantsPractitionerIds?.some(
                (practitionerId) => practitionerId === practitioner?.id
              )
                ? (count += 1)
                : count,
            0
          ) || 0;

        const attendancePercentage = familyDaysAttendanded / familyDaysHeld;

        contributions.push({
          title: 'Host family days',
          subTitle: `Attended ${familyDaysAttendanded} of ${familyDaysHeld} family day events`,
          positiveStatus: attendancePercentage >= 0.6,
        });
      } else {
        contributions.push({
          title: 'Host family days',
          subTitle: `No events held yet`,
          positiveStatus: false,
        });
      }

      // Complete child progress - after June for purple leagues only
      if (
        new Date().getMonth() >= 6 &&
        !!club.league &&
        club.league.leagueTypeName === LeagueType.Purple
      ) {
        if (!practitioner.attendedChildProgress) {
          contributions.push({
            title: 'Complete child progress reports',
            subTitle: `${practitioner.user?.firstName} has not completed the child progress training yet`,
            positiveStatus: false,
          });
        } else {
          if (
            !!progressReportsStatus &&
            progressReportsStatus.numberOfChildren > 0
          ) {
            const percentageCompleted =
              (progressReportsStatus.completedReports /
                progressReportsStatus.numberOfChildren) *
              100;
            contributions.push({
              title: 'Complete child progress reports',
              subTitle: `Completed ${percentageCompleted}% of child progress reports`,
              positiveStatus: percentageCompleted >= 100,
            });
          }
        }
      }

      // Leave no one behind
      if (!!currentRating) {
        const ratingText =
          currentRating.overallRatingColor === 'Success'
            ? 'a green'
            : currentRating.overallRatingColor === 'Warning'
            ? 'an orange'
            : 'a red';
        contributions.push({
          title: 'Leave no one behind',
          subTitle: `${practitioner.user?.firstName} has ${ratingText} PQA`, // TODO need to figure out how to tell if PQA or reaccreditation
          positiveStatus: currentRating.overallRatingColor === 'Success',
        });
      } else {
        contributions.push({
          title: 'Leave no one behind',
          subTitle: `${practitioner.user?.firstName} does not have a PQA rating or re-accreditation rating yet`,
          positiveStatus: false,
        });
      }

      return contributions;
    }
  );
