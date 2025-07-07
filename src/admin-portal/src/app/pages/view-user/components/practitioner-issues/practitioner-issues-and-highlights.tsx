import { PractitionerStatsDto } from '@ecdlink/core';
import { Divider, Typography } from '@ecdlink/ui';
import { ExclamationCircleIcon, StarIcon } from '@heroicons/react/solid';

interface PractitionerIssuesAndHighlightsProps {
  summaryData: PractitionerStatsDto;
  isPractitioner: boolean;
}

export const PractitionerIssuesAndHighlights: React.FC<
  PractitionerIssuesAndHighlightsProps
> = ({ summaryData, isPractitioner }) => {
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
                  summaryData?.totalAttendanceRegistersNotCompleted !==
                    undefined &&
                  String(summaryData?.totalAttendanceRegistersNotCompleted)
                }
                color={'errorMain'}
              />
              <Typography
                type={'body'}
                text={'attendance registers not completed'}
                color={'textMid'}
              />
            </div>
            <div className="flex items-center gap-2">
              <Typography
                type={'h1'}
                hasMarkup
                fontSize="24"
                text={
                  summaryData?.totalProgressReportsNotCompleted !== undefined &&
                  String(summaryData?.totalProgressReportsNotCompleted)
                }
                color={'errorMain'}
              />
              <Typography
                type={'body'}
                text={'progress reports not completed'}
                color={'textMid'}
              />
            </div>
            {!isPractitioner && (
              <div className="flex items-center gap-2">
                <Typography
                  type={'h1'}
                  hasMarkup
                  fontSize="24"
                  text={
                    summaryData?.totalIncomeStatementsWithNoItems !==
                      undefined &&
                    String(summaryData?.totalIncomeStatementsWithNoItems)
                  }
                  color={'errorMain'}
                />
                <Typography
                  type={'body'}
                  text={'income statements with no income or expenses tracked'}
                  color={'textMid'}
                />
              </div>
            )}
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
                  summaryData?.totalAttendanceRegistersCompleted !==
                    undefined &&
                  String(summaryData?.totalAttendanceRegistersCompleted)
                }
                color={'successMain'}
              />
              <Typography
                type={'body'}
                text={'attendance registers completed'}
                color={'textMid'}
              />
            </div>
            <div className="flex items-center gap-2">
              <Typography
                type={'h1'}
                hasMarkup
                fontSize="24"
                text={
                  summaryData?.totalProgressReportsCompleted !== undefined &&
                  String(summaryData?.totalProgressReportsCompleted)
                }
                color={'successMain'}
              />
              <Typography
                type={'body'}
                text={'progress reports created'}
                color={'textMid'}
              />
            </div>
            {!isPractitioner && (
              <div className="flex items-center gap-2">
                <Typography
                  type={'h1'}
                  hasMarkup
                  fontSize="24"
                  text={
                    summaryData?.totalIncomeStatementsDownloaded !==
                      undefined &&
                    String(summaryData?.totalIncomeStatementsDownloaded)
                  }
                  color={'successMain'}
                />
                <Typography
                  type={'body'}
                  text={'income statements downloaded'}
                  color={'textMid'}
                />
              </div>
            )}
          </div>

          {/* End main area */}
        </div>
      </div>
    </div>
  );
};
