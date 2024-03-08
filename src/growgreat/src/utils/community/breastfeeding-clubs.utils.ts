import { BreastFeedingClubDto, MetricsColorEnum } from '@ecdlink/core';

export interface MonthData {
  year: number;
  month: number;
  data: BreastFeedingClubDto[];
}

interface PointsDetails {
  points: number;
  colour: MetricsColorEnum;
  breastfeedingClubsLength: number;
}

function getMonthAndYearFromDate(dateString: string): {
  month: number;
  year: number;
} {
  const date = new Date(dateString);
  return { month: date.getMonth(), year: date.getFullYear() };
}

export function groupBreastfeedingClubByMonth(
  data: BreastFeedingClubDto[]
): MonthData[] {
  const groupedData: { [key: string]: MonthData } = {};

  data.forEach((item) => {
    const { month, year } = getMonthAndYearFromDate(item.meetingDate);
    const key = `${year}-${month}`;
    // If the month is already in the groupedData object, add the object to that month's data array
    if (groupedData.hasOwnProperty(key)) {
      groupedData[key].data.push(item);
    } else {
      // Otherwise, create a new object for the month and add the object to that month's data array
      groupedData[key] = {
        year: year,
        month: month,
        data: [item],
      };
    }
  });

  return (
    Object.values(groupedData)
      // Sort by month and year, most recent first
      .sort((a, b) => {
        const yearComparison = b.year - a.year;
        if (yearComparison !== 0) return yearComparison;
        return b.month - a.month;
      })
  );
}

export const getPointsDetails = (
  data: BreastFeedingClubDto[]
): PointsDetails => {
  const filteredBreastfeedingClubs = data?.filter((item) => {
    const clientsLength = item.clients.length;
    // minimum 4 and maximum 6 clients attending
    return clientsLength >= 4 && clientsLength <= 6;
  });

  const breastfeedingClubsLength = filteredBreastfeedingClubs?.length;

  if (breastfeedingClubsLength === 1) {
    return {
      points: 10,
      colour: MetricsColorEnum.Error,
      breastfeedingClubsLength,
    };
  }

  if (breastfeedingClubsLength === 2) {
    return {
      points: 20,
      colour: MetricsColorEnum.Warning,
      breastfeedingClubsLength,
    };
  }

  if (breastfeedingClubsLength === 3) {
    return {
      points: 50,
      colour: MetricsColorEnum.Warning,
      breastfeedingClubsLength,
    };
  }

  if (breastfeedingClubsLength >= 4) {
    return {
      points: 200,
      colour: MetricsColorEnum.Success,
      breastfeedingClubsLength,
    };
  }

  return {
    points: 0,
    colour: MetricsColorEnum.Error,
    breastfeedingClubsLength,
  };
};

export function createCurrentMonthBlankData(): MonthData {
  const today = new Date();
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();
  return { year: currentYear, month: currentMonth, data: [] };
}
