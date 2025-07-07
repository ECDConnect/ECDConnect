import { pointsConstants } from '@/constants/points';
import { BannerWrapper, Button, ScoreCard, Typography } from '@ecdlink/ui';
import { useSelector } from 'react-redux';
import { useHistory, useParams } from 'react-router';
import { ReactComponent as Balloons } from '@ecdlink/ui/src/assets/emoji/balloons.svg';
import { format } from 'date-fns';
import { useCallback, useState } from 'react';
import { getPractitionerByUserId } from '@/store/practitioner/practitioner.selectors';
import { practitionerForCoachSelectors } from '@/store/practitionerForCoach';
import { CoachPractitionerPointsMonthSummary } from './components/coach-practitioner-points-month-summary';

export type PractitionerPointsParams = {
  userId: string;
};

export const CoachPractitionerPoints: React.FC = () => {
  const history = useHistory();
  const currentMonth = new Date().getMonth();

  const { userId } = useParams<PractitionerPointsParams>();

  const practitioner = useSelector(getPractitionerByUserId(userId));

  const isPrincipal = practitioner?.isPrincipal;

  const [monthsLoaded, setMonthsLoaded] = useState<number[]>([currentMonth]);
  const [loadNextMonthDisabled, setLoadNextMonthDisabled] = useState<boolean>(
    currentMonth === 0
  );

  const pointsTotalForYear = useSelector(
    practitionerForCoachSelectors.getPointsTotalForYear(userId)
  );

  const pointsMax = isPrincipal
    ? pointsConstants.principalOrAdminYearlyMax
    : pointsConstants.practitionerYearlyMax;

  const percentageScore = (pointsTotalForYear / pointsMax) * 100;

  const loadNextMonth = useCallback(() => {
    const nextMonthToLoad = Math.min(...monthsLoaded) - 1;
    setMonthsLoaded([...monthsLoaded, nextMonthToLoad]);
    setLoadNextMonthDisabled(nextMonthToLoad === 0);
  }, [monthsLoaded, setMonthsLoaded, setLoadNextMonthDisabled]);

  return (
    <BannerWrapper
      size="medium"
      renderBorder={true}
      onBack={() => history.goBack()}
      title="Points"
      backgroundColour="white"
    >
      <div className="mt-5 flex-col justify-center p-4">
        <Typography
          type={'h1'}
          color="black"
          text={format(new Date(), 'MMM yyyy')}
        />
        <ScoreCard
          className="mt-5"
          mainText={`${pointsTotalForYear}`}
          secondaryText={`points earned so far in ${new Date().getFullYear()}`}
          currentPoints={pointsTotalForYear}
          maxPoints={pointsMax}
          barBgColour="uiLight"
          barColour={
            percentageScore < 60
              ? 'errorMain'
              : percentageScore < 80
              ? 'infoMain'
              : 'successMain'
          }
          bgColour="uiBg"
          textColour="black"
        />
        {pointsTotalForYear > 0 && (
          <>
            <Typography
              className="mt-10"
              type={'h1'}
              color="black"
              text={`What ${practitioner?.user?.firstName} earned points for:`}
            />
            {monthsLoaded.map((month) => {
              return (
                <CoachPractitionerPointsMonthSummary
                  userId={userId}
                  month={month}
                />
              );
            })}
          </>
        )}
      </div>
      {pointsTotalForYear > 0 && (
        <div className="flex-column mt-10 justify-end p-4">
          <Button
            size="normal"
            className="mb-4 w-full"
            type="outlined"
            color="primary"
            text="See more months"
            textColor="primary"
            icon="EyeIcon"
            disabled={loadNextMonthDisabled}
            onClick={loadNextMonth}
          />
        </div>
      )}
    </BannerWrapper>
  );
};
