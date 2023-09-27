import { PointsDetailsCard } from '@/pages/dashboard/components/points-details-card/points-details-card';
import { PointsSummaryDto } from '@ecdlink/core';
import {
  BannerWrapper,
  CelebrationCard,
  Typography,
  renderIcon,
} from '@ecdlink/ui';
import { format } from 'date-fns';

import { ReactComponent as EmojiYellowSmile } from '@ecdlink/ui/src/assets/emoji/emoji_yellow_smileEyes.svg';
import { ReactComponent as EmojiLightBulb } from '@ecdlink/ui/src/assets/emoji/emoji_lightbulb.svg';

export type PointsShareProps = {
  viewMode: 'Month' | 'Year';
  pointsSummaries: PointsSummaryDto[];
  userFullName: string;
  childCount: number;
};

export const PointsShare: React.FC<PointsShareProps> = ({
  viewMode,
  pointsSummaries,
  userFullName,
  childCount,
}) => {
  const pointsTotal = pointsSummaries.reduce(
    (total, current) =>
      (total += viewMode === 'Month' ? current.pointsTotal : current.pointsYTD),
    0
  );

  return (
    <>
      <div className="bg-primary flex h-24 flex-col items-center">
        <Typography
          className="mt-6"
          type={'h1'}
          color="white"
          text={`SmartStart`}
        />
      </div>
      <div className="bg-uiBg flex flex-col items-center">
        <Typography
          className="mt-6"
          type={'h1'}
          color="black"
          text={`${userFullName}'s SmartStart points`}
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
          className={`bg-secondary h-115 mt-2 rounded-lg px-4 py-4 shadow-sm sm:px-6`}
        >
          <div className="flex flex-row gap-3">
            <EmojiYellowSmile className="mr-2 h-16 w-16" />
            <div className="flex-column gap-3">
              <Typography
                type="h3"
                color="uiBg"
                text={'High points earner!'}
                className="pt-2"
              />
              {/* <div className={'mt-2 flex flex-1 flex-row'}> */}
              <table>
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
              </table>
              {/* </div> */}
            </div>
          </div>
        </div>
        {/* TODO add club points based celebration messages once data is available */}
        {pointsSummaries.map((pointsLibraryScore) => {
          return (
            <PointsDetailsCard
              pointsEarned={pointsLibraryScore.pointsTotal}
              activityCount={12} // TODO - replace with actual value once available
              description={pointsLibraryScore.subActivity || 'Unknown'}
              isShare={true}
            />
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
