import { CoachStatsDto } from '@ecdlink/core';
import { Divider, Typography } from '@ecdlink/ui';
import { ExclamationCircleIcon, StarIcon } from '@heroicons/react/solid';

interface CoachesIssuesAndHighlightsProps {
  summaryData: CoachStatsDto;
}

export const CoachIssuesAndHighlights: React.FC<
  CoachesIssuesAndHighlightsProps
> = ({ summaryData }) => {
  return (
    <div className="mb-6 flex flex-col gap-6 lg:flex-row">
      <div className="border-l-errorMain  border-errorMain w-full rounded-2xl border-2  border-l-8 bg-white lg:w-1/2">
        <div className="h-full py-6 px-4 sm:px-6 lg:px-8">
          {/* Start main area*/}
          <div className="flex flex-row items-center gap-2">
            <ExclamationCircleIcon
              className="h-12 w-12"
              style={{
                color: '#ED1414',
              }}
            ></ExclamationCircleIcon>
            <Typography
              type={'h2'}
              hasMarkup
              fontSize="24"
              text={'Urgent issues'}
              color={'textMid'}
            />
          </div>
          <Divider dividerType="dashed" className="my-4" />
          <div className="flex flex-col justify-evenly pt-4 text-current">
            <div className="flex items-center gap-2">
              <Typography
                type={'h1'}
                hasMarkup
                fontSize="24"
                text={
                  (summaryData?.totalWithNoIncomeExpense !== undefined &&
                    String(summaryData?.totalWithNoIncomeExpense)) ||
                  '0'
                }
                color={'errorMain'}
              />
              <Typography
                type={'body'}
                text={'principals did not track income or expenses'}
                color={'textMid'}
              />
            </div>
            <div className="flex items-center gap-2">
              <Typography
                type={'h1'}
                hasMarkup
                fontSize="24"
                text={
                  (summaryData?.totalLessThan75AttendanceRegisters !==
                    undefined &&
                    String(summaryData?.totalLessThan75AttendanceRegisters)) ||
                  '0'
                }
                color={'errorMain'}
              />
              <Typography
                type={'body'}
                text={
                  'practitioners saved less than 75% of their attendance registers'
                }
                color={'textMid'}
              />
            </div>
            <div className="flex items-center gap-2">
              <Typography
                type={'h1'}
                hasMarkup
                fontSize="24"
                text={
                  (summaryData?.totalMoreThan75hAttendanceRegisters !==
                    undefined &&
                    String(summaryData?.totalMoreThan75hAttendanceRegisters)) ||
                  '0'
                }
                color={'errorMain'}
              />
              <Typography
                type={'body'}
                text={
                  'practitioners did not create progress reports for all children'
                }
                color={'textMid'}
              />
            </div>
          </div>
          {/* End main area */}
        </div>
      </div>
      <div className="border-l-successMain  border-successMain w-full rounded-2xl border-2  border-l-8 bg-white lg:w-1/2">
        <div className="h-full py-6 px-4 sm:px-6 lg:px-8">
          {/* Start main area*/}
          <div className="flex flex-row items-center gap-2">
            <StarIcon
              className="successMain h-12 w-12"
              style={{
                color: '#83BB26',
              }}
            ></StarIcon>
            <Typography
              type={'h2'}
              hasMarkup
              fontSize="24"
              text={'Highlights'}
              color={'textMid'}
            />
          </div>
          <Divider dividerType="dashed" className="my-4" />
          <div className="flex flex-col justify-evenly pt-4 text-current">
            <div className="flex items-center gap-2">
              <Typography
                type={'h1'}
                hasMarkup
                fontSize="24"
                text={
                  (summaryData?.totalWithIncomeExpense !== undefined &&
                    String(summaryData?.totalWithIncomeExpense)) ||
                  '0'
                }
                color={'successMain'}
              />
              <Typography
                type={'body'}
                text={'principals tracked income & expenses'}
                color={'textMid'}
              />
            </div>
            <div className="flex items-center gap-2">
              <Typography
                type={'h1'}
                hasMarkup
                fontSize="24"
                text={
                  (summaryData?.totalMoreThan75hAttendanceRegisters !==
                    undefined &&
                    String(summaryData?.totalMoreThan75hAttendanceRegisters)) ||
                  '0'
                }
                color={'successMain'}
              />
              <Typography
                type={'body'}
                text={'saved 75% or more attendance registers'}
                color={'textMid'}
              />
            </div>
            <div className="flex items-center gap-2">
              <Typography
                type={'h1'}
                hasMarkup
                fontSize="24"
                text={
                  (summaryData?.totalWithProgressReports !== undefined &&
                    String(summaryData?.totalWithProgressReports)) ||
                  '0'
                }
                color={'successMain'}
              />
              <Typography
                type={'body'}
                text={'practitioners created progress reports for all children'}
                color={'textMid'}
              />
            </div>
          </div>

          {/* End main area */}
        </div>
      </div>
    </div>
  );
};
