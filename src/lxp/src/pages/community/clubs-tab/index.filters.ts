import {
  LeagueType,
  MAX_PURPLE_CLUB_POINTS,
  MAX_RISING_STARS_POINTS,
  MIN_PURPLE_CLUB_POINTS,
  MIN_RISING_STARS_POINTS,
} from '@/constants/club';
import { DetailClubDto } from '@/models/club/club.dto';
import { Colours, SearchDropDownOption } from '@ecdlink/ui';
import { format, parseISO } from 'date-fns';

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
  clubs: DetailClubDto[],
  leagueType?: string
): DetailClubDto[] {
  if (!leagueType) {
    return clubs;
  }
  if (leagueType === LeagueType.Other) {
    return clubs.filter(
      (club) =>
        !club.league?.leagueTypeName.includes(LeagueType.Purple) &&
        !club.league?.leagueTypeName.includes(LeagueType.NewStars) &&
        !club.league?.leagueTypeName.includes(LeagueType.RisingStars)
    );
  }

  return clubs.filter((club) =>
    club.league?.leagueTypeName.includes(leagueType)
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

function sortByPointsEarnedThisYear(clubs: DetailClubDto[]) {
  return clubs.sort((a, b) => {
    // Ensure that a.league and a.league.leagueType are not null or undefined
    const leagueTypeA = a.league?.leagueTypeName ?? LeagueType.Other;
    const leagueTypeB = b.league?.leagueTypeName ?? LeagueType.Other;

    const pointsA = a.pointsTotal;
    const pointsB = b.pointsTotal;

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

// TODO - Need to implement this, the backend doesn't actually return these fields currently
function sortByMeetingAttendance(clubs: DetailClubDto[]) {
  return clubs;
  // return clubs.sort((a, b) => {
  //   // @ts-ignore: update graphql types
  //   const startsWithMissingA = a.meetingAttendanceText?.startsWith('Missing');
  //   // @ts-ignore: update graphql types
  //   const startsWithMissingB = b.meetingAttendanceText?.startsWith('Missing');
  //   // @ts-ignore: update graphql types
  //   const endsWithClubMeetingA = a.meetingAttendanceText?.endsWith(
  //     'club meeting register'
  //   );
  //   // @ts-ignore: update graphql types
  //   const endsWithClubMeetingB = b.meetingAttendanceText?.endsWith(
  //     'club meeting register'
  //   );

  //   if (startsWithMissingA && !startsWithMissingB) {
  //     return -1;
  //   }
  //   if (!startsWithMissingA && startsWithMissingB) {
  //     return 1;
  //   }

  //   if (startsWithMissingA === startsWithMissingB) {
  //     if (endsWithClubMeetingA && !endsWithClubMeetingB) {
  //       return -1;
  //     }
  //     if (!endsWithClubMeetingA && endsWithClubMeetingB) {
  //       return 1;
  //     }
  //   }
  //   // @ts-ignore: update graphql types
  //   const attendanceA = a.meetingAttendance || 0;
  //   // @ts-ignore: update graphql types
  //   const attendanceB = b.meetingAttendance || 0;

  //   return attendanceA - attendanceB;
  // });
}

export function sortClubBy(clubs: DetailClubDto[], sortBy: string) {
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
      return clubsCopy?.sort((a, b) =>
        (a.issuesTasks[0]?.secondaryTextColor || '').localeCompare(
          b.issuesTasks[0].secondaryTextColor || ''
        )
      );
    case SortBy.MEETING_ATTENDANCE:
      return sortByMeetingAttendance(clubs);
    default:
      return clubs;
  }
}
export const searchList = (list: DetailClubDto[], searchTerm: string) => {
  const lowerSearch = searchTerm.toLowerCase();
  return list.filter((item) => item.name.toLowerCase().includes(lowerSearch));
};

export function getScoreBarColor(
  totalClubPoints: number,
  greenPoints: number,
  amberPoints: number
) {
  let barColor: Colours = 'errorMain';

  if (totalClubPoints >= greenPoints) {
    barColor = 'successMain';
  } else if (totalClubPoints >= 1 && totalClubPoints <= amberPoints) {
    barColor = 'alertMain';
  }
  return barColor;
}

export function getPointsActivityDateDetails(date: string) {
  if (!date) return { monthName: '', formattedDate: '' };

  const parsedDate = parseISO(date.replace('Z', ''));
  const formattedDate = format(parsedDate, 'd MMMM yyyy');
  const monthName = format(parsedDate, 'MMMM');

  return {
    meetingId: parsedDate.toISOString().split('T')[0],
    monthName,
    formattedDate,
  };
}
