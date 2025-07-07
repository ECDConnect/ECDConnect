import { PointsSummaryDto } from '@ecdlink/core';
import { PointsDetailsCard, Typography, renderIcon } from '@ecdlink/ui';
import { format } from 'date-fns';
import { ReactComponent as Badge } from '@ecdlink/ui/src/assets/badge/badge_neutral.svg';
import { ReactComponent as Star } from '../../../assets/star.svg';
import { ReactComponent as Trophy } from '../../../assets/trophy.svg';
import { ReactComponent as EmojiLightBulb } from '@ecdlink/ui/src/assets/emoji/emoji_lightbulb.svg';
import { useTenant } from '@/hooks/useTenant';
import { useSelector } from 'react-redux';
import { practitionerSelectors } from '@/store/practitioner';

export type PointsShareProps = {
  viewMode: 'Month' | 'Year';
  pointsSummaries: PointsSummaryDto[];
  pointsTotal?: string;
  userFullName: string;
  childCount: number;
  messageNr?: number;
};

export const PointsShare: React.FC<PointsShareProps> = ({
  viewMode,
  pointsSummaries,
  userFullName,
  childCount,
  pointsTotal,
  messageNr,
}) => {
  // Wait until the tests start
  // const pointsTotal = pointsSummaries?.reduce(
  //   (total, current) =>
  //     (total +=
  //       viewMode === 'Month' ? current?.pointsTotal : current?.pointsYTD),
  //   0
  // );
  const practitioner = useSelector(practitionerSelectors.getPractitioner);
  const tenant = useTenant();
  const appName = tenant?.tenant?.applicationName;

  return (
    <>
      <div className="bg-primary flex h-24 flex-col items-center">
        <Typography
          className="mt-6"
          type={'h1'}
          color="white"
          text={`${appName}`}
        />
      </div>
      <div className="bg-uiBg flex flex-col items-center">
        <Typography
          className="mt-6"
          type={'h1'}
          color="black"
          text={`${userFullName}'s ${appName} points`}
        />
        <Typography
          className="mb-3"
          type={'h3'}
          color="black"
          text={
            viewMode === 'Month'
              ? `1 to ${format(new Date(), 'dd MMM yyyy')}`
              : `Jan to ${format(new Date(), 'MMM yyyy')}`
          }
        />
      </div>
      <div className="mt-5 flex flex-col p-4">
        <div
          className={`bg-${
            messageNr === 1 || messageNr === 2 ? 'successMain' : 'quatenary'
          } h-115 mt-2 rounded-lg px-4 py-4 shadow-sm sm:px-6`}
        >
          <div className="flex flex-row items-center gap-3">
            {messageNr === 1 || messageNr === 2 ? (
              <Star className="mr-2 h-16 w-16" />
            ) : (
              <Trophy className="mr-2 h-16 w-16" />
            )}
            <div className="flex-column gap-3">
              <Typography
                type="h3"
                color="uiBg"
                text={
                  messageNr === 1
                    ? `Top ${
                        practitioner?.isPrincipal ? 'principal' : 'practitioner'
                      } on ${appName} for this period!`
                    : messageNr === 2
                    ? `One of the top ${
                        practitioner?.isPrincipal ? 'principal' : 'practitioner'
                      } for this period!`
                    : 'Well done!'
                }
              />
              <table>
                <tbody>
                  <tr className="mb-2">
                    <td>
                      {renderIcon('StarIcon', `h-6 w-6 text-uiBg mr-1.5 mt-1`)}
                    </td>
                    <td>
                      <Typography
                        type={'h3'}
                        text={`${pointsTotal} points`}
                        color={'uiBg'}
                      />
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
        {pointsSummaries?.map((pointsLibraryScore, idx) => {
          return (
            <div className="mt-5" key={idx}>
              <PointsDetailsCard
                pointsEarned={pointsLibraryScore.pointsTotal}
                activityCount={pointsLibraryScore.timesScored}
                title={pointsLibraryScore.activity || 'Unknown'}
                isShare
                size="large"
                textColour="textDark"
                badgeImage={
                  <Badge
                    className="absolute z-0 h-full w-full"
                    fill="var(--secondary)"
                  />
                }
              />
            </div>
          );
        })}
        <div className="mt-6 flex flex-1 flex-row">
          <EmojiLightBulb className="mr-2 h-16 w-16" />
          <Typography
            type={'h3'}
            color="black"
            text={`This ${
              viewMode === 'Month' ? 'month' : 'year'
            } you helped ${childCount} children grow & learn! You are setting them up for a bright future!`}
          />
        </div>
      </div>
    </>
  );
};
