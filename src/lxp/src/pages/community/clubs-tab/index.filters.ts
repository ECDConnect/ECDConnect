import {
  LeagueType,
  MAX_PURPLE_CLUB_POINTS,
  MAX_RISING_STARS_POINTS,
  MIN_PURPLE_CLUB_POINTS,
  MIN_RISING_STARS_POINTS,
} from '@/constants/club';
import { MergedCoachingClub } from '@/store/club/club.types';
import { Colours, SearchDropDownOption } from '@ecdlink/ui';

enum SortBy {
  PRIORITY = 'Priority',
  CLUB_NAME = 'Club name',
  MEETING_ATTENDANCE = 'Meeting attendance',
  POINTS_EARNED_THIS_YEAR = 'Points earned this year',
}

export const typeFilterOptions: SearchDropDownOption<string>[] = Object.values(
  LeagueType
).map((item) => ({
  id: item,
  label: item,
  value: item,
}));

export const sortByOptions: SearchDropDownOption<string>[] = [
  'Priority',
  'Club name',
  'Meeting attendance',
  'Points earned this year',
].map((item) => ({
  id: item,
  label: item,
  value: item,
}));

export function filterClubsByLeagueType(
  clubs: MergedCoachingClub[],
  leagueType?: string
): MergedCoachingClub[] {
  if (!leagueType) {
    return clubs;
  }
  if (leagueType === LeagueType.Other) {
    return clubs.filter(
      (club) =>
        !club.league?.leagueType?.name?.includes(LeagueType.Purple) &&
        !club.league?.leagueType?.name?.includes(LeagueType.NewStars) &&
        !club.league?.leagueType?.name?.includes(LeagueType.RisingStars)
    );
  }

  return clubs.filter((club) =>
    club.league?.leagueType?.name?.includes(leagueType)
  );
}

const assignRank = (points: number, leagueType: string): number => {
  if (points >= MIN_RISING_STARS_POINTS && points <= MAX_RISING_STARS_POINTS) {
    // Rule i: Rising/New Stars leagues
    // 1600 to 2000 points = green
    // Less than 1600 = amber
    // 0 points = red
    if (
      [LeagueType.RisingStars, LeagueType.NewStars].includes(
        leagueType as LeagueType
      )
    ) {
      if (points === 0) {
        return 2; // Red
      } else if (points >= 1600) {
        return 0; // Green
      } else {
        return 1; // Amber
      }
    } else {
      return 2; // Not in the specified leagues, neutral
    }
  } else if (
    points >= MIN_PURPLE_CLUB_POINTS &&
    points <= MAX_PURPLE_CLUB_POINTS
  ) {
    // Rule ii: Purple clubs
    // 1760 to 2200 points = green
    // Less than 1760 = amber
    // 0 points = red
    if (leagueType === LeagueType.Purple) {
      if (points === 0) {
        return 2; // Red
      } else if (points >= 1760) {
        return 0; // Green
      } else {
        return 1; // Amber
      }
    } else {
      return 2; // Not a purple club, neutral
    }
  } else {
    // Rule iii: Not participating in a league
    // NA - not in league (neutral)
    // Show points earned this year as secondary text for all clubs when this sort is on.
    return 2; // Default ranking for other cases
  }
};

function sortByPointsEarnedThisYear(clubs: MergedCoachingClub[]) {
  return clubs.sort((a, b) => {
    // Ensure that a.league and a.league.leagueType are not null or undefined
    const leagueTypeA = a.league?.leagueType?.name ?? LeagueType.Other;
    const leagueTypeB = b.league?.leagueType?.name ?? LeagueType.Other;

    const pointsA = a.totalClubPoints;
    const pointsB = b.totalClubPoints;

    // Sort based on points and league type
    const rankA = assignRank(pointsA, leagueTypeA);
    const rankB = assignRank(pointsB, leagueTypeB);

    // If clubs have different rankings, sort based on ranking
    if (rankA !== rankB) {
      return rankA - rankB;
    }

    // If both clubs have the same ranking, sort based on points
    return pointsA - pointsB;
  });
}

function sortByMeetingAttendance(clubs: MergedCoachingClub[]) {
  return clubs.sort((a, b) => {
    // @ts-ignore: update graphql types
    const startsWithMissingA = a.meetingAttendanceText?.startsWith('Missing');
    // @ts-ignore: update graphql types
    const startsWithMissingB = b.meetingAttendanceText?.startsWith('Missing');
    // @ts-ignore: update graphql types
    const endsWithClubMeetingA = a.meetingAttendanceText?.endsWith(
      'club meeting register'
    );
    // @ts-ignore: update graphql types
    const endsWithClubMeetingB = b.meetingAttendanceText?.endsWith(
      'club meeting register'
    );

    if (startsWithMissingA && !startsWithMissingB) {
      return -1;
    }
    if (!startsWithMissingA && startsWithMissingB) {
      return 1;
    }

    if (startsWithMissingA === startsWithMissingB) {
      if (endsWithClubMeetingA && !endsWithClubMeetingB) {
        return -1;
      }
      if (!endsWithClubMeetingA && endsWithClubMeetingB) {
        return 1;
      }
    }
    // @ts-ignore: update graphql types
    const attendanceA = a.meetingAttendance || 0;
    // @ts-ignore: update graphql types
    const attendanceB = b.meetingAttendance || 0;

    return attendanceA - attendanceB;
  });
}

export function sortClubBy(clubs: MergedCoachingClub[], sortBy: string) {
  const clubsCopy = [...clubs];

  if (!sortBy) return clubs;

  switch (sortBy) {
    case SortBy.CLUB_NAME:
      return clubsCopy?.sort((a, b) =>
        (a.name ?? '').localeCompare(b.name ?? '')
      );
    case SortBy.POINTS_EARNED_THIS_YEAR:
      return sortByPointsEarnedThisYear(clubsCopy);
    case SortBy.PRIORITY:
      return clubsCopy?.sort(
        (a, b) =>
          (a.secondaryTextPriority ?? 0) - (b.secondaryTextPriority ?? 0)
      );
    case SortBy.MEETING_ATTENDANCE:
      return sortByMeetingAttendance(clubs);
    default:
      return clubs;
  }
}
export const searchList = (list: MergedCoachingClub[], searchTerm: string) => {
  const lowerSearch = searchTerm.toLowerCase();
  return list.filter((item) => item?.name?.toLowerCase().includes(lowerSearch));
};

export function getScoreBarColor(totalClubPoints: number) {
  let barColor: Colours = 'errorMain';

  if (totalClubPoints >= 1500) {
    barColor = 'successMain'; // 1500+
  } else if (totalClubPoints >= 1 && totalClubPoints <= 1499) {
    barColor = 'alertMain'; // 1-1499
  }
  return barColor;
}
