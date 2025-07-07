import { Colours, classNames } from '@ecdlink/ui';
import {
  averageScoreThreshold,
  goodScoreThreshold,
  badScoreThreshold,
} from '@models/classroom/attendance/ClassAttendance';

export const wrapper = 'bg-white rounded-lg shadow-sm justify-center';

export const resultsSection = 'flex flex-row justify-between items-center';

export const attendanceItemWrapper = (attendanceScore: number) => {
  const baseStyle = `flex flex-col py-4 w-full rounded-lg p-5 pr-8 mt-2 `;

  return classNames(baseStyle, getColor(attendanceScore));
};

export const icon = (attendanceScore: number) => {
  return `w-5 h-5 mr-1 text-${getColor(attendanceScore)}`;
};

export const getColor = (score: number): Colours => {
  if (score >= goodScoreThreshold) {
    return 'successMain';
  }

  if (score >= averageScoreThreshold) {
    return 'alertMain';
  }

  return 'errorMain';
};

export const getBgColor = (score: number) => {
  if (score >= goodScoreThreshold) {
    return 'bg-successBg';
  } else if (score >= averageScoreThreshold) {
    return 'bg-alertBg';
  } else if (score <= badScoreThreshold) {
    return 'bg-errorBg';
  }
};
