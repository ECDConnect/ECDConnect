import { Colours } from '@ecdlink/ui';
import { classNames } from '@ecdlink/ui';
import {
  averageScoreThreshold,
  goodScoreThreshold,
} from '@models/classroom/attendance/ClassAttendance';

export const wrapper = 'bg-white rounded-lg shadow-sm justify-center';

export const resultsSection = 'flex flex-row justify-between items-center';

export const attendanceItemWrapper = (
  attendanceScore: number,
  renderDivider: boolean
) => {
  const baseStyle = `flex flex-col py-4 w-full ${
    renderDivider ? 'border-t border-color-textLight' : ''
  }`;

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
