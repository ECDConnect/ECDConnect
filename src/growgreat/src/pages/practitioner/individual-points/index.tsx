import { MaxIndividualPointsPerMonth } from '@/constants/Community';
import { useOnlineStatus } from '@/hooks/useOnlineStatus';
import ROUTES from '@/routes/routes';
import { getIndividualPointsUIDetails } from '@/utils/community/individual-points';
import {
  BannerWrapper,
  Button,
  PointsProgressCard,
  ScoreCard,
  Typography,
} from '@ecdlink/ui';
import { format } from 'date-fns';
import { useHistory } from 'react-router';
import { ComparativeMessage } from './components/comparative-message';
import { ReactComponent as Badge } from '@ecdlink/ui/src/assets/badge/badge_neutral.svg';
import { useMemo, useState } from 'react';
import Pregnant from '@/assets/pregnant.svg';
import Infant from '@/assets/infant.svg';
import { PointsMonthSummary } from './components/points-month-summary';

export const IndividualPoints = () => {
  const [isToShowPointsEarned, setIsToShowPointsEarned] = useState(false);

  const history = useHistory();

  const today = new Date();

  const { isOnline } = useOnlineStatus();

  // TODO: Get real individual points
  const currentIndividualPoints = 600;

  const individualPointsUIDetails = getIndividualPointsUIDetails(
    currentIndividualPoints
  );

  const pointsToEarn = useMemo((): {
    imageUrl?: string;
    icon?: string;
    description: string;
    currentPoints: number;
    maxPoints: number;
  }[] => {
    const childFolders = {
      imageUrl: Infant,
      description: 'Open 2 child folders',
      // TODO: add real points
      currentPoints: 80,
      maxPoints: 100,
    };
    const momFolders = {
      imageUrl: Pregnant,
      description: 'Open 2 pregnant mom folders',
      // TODO: add real points
      currentPoints: 2,
      maxPoints: 50,
    };
    const visits = {
      icon: 'HomeIcon',
      description: 'Complete 8 visits due this month',
      // TODO: add real points
      currentPoints: 180,
      maxPoints: 260,
    };
    const referrals = {
      icon: 'ClipboardListIcon',
      description: 'Make 2 referrals',
      // TODO: add real points
      currentPoints: 25,
      maxPoints: 40,
    };

    // TODO: Add conditions to check if the user has completed some task
    return [childFolders, momFolders, visits, referrals];
  }, []);

  const dummyMonths = [2, 3];

  return (
    <BannerWrapper
      displayHelp
      displayOffline={!isOnline}
      renderBorder
      size="small"
      title="Points"
      onBack={() =>
        isToShowPointsEarned
          ? setIsToShowPointsEarned(false)
          : history.push(ROUTES.DASHBOARD)
      }
      onHelp={() => {}}
      className="flex flex-col p-4 pt-6"
    >
      <Typography type="h2" text={format(today, 'MMMM yyyy')} />
      <ScoreCard
        className="my-4"
        mainText={'{Points}'}
        hint="points"
        currentPoints={currentIndividualPoints}
        maxPoints={MaxIndividualPointsPerMonth}
        barBgColour="uiLight"
        barColour={individualPointsUIDetails.mainColour}
        bgColour="uiBg"
        barSize="medium"
        textColour="black"
      />
      <ComparativeMessage />
      <Typography
        className="mt-6"
        type="h3"
        text={
          isToShowPointsEarned
            ? 'What you earned points for:'
            : `How you can earn more points in ${format(today, 'MMMM')}:`
        }
      />
      {!isToShowPointsEarned &&
        pointsToEarn.map((item, index) => (
          <PointsProgressCard
            key={'points_' + index}
            icon={item?.icon ?? ''}
            imageUrl={item?.imageUrl ?? ''}
            currentPoints={item.currentPoints}
            maxPoints={item.maxPoints}
            description={item.description}
            barColour="secondary"
            badgeImage={
              <Badge
                style={{
                  objectFit: 'cover',
                  width: '100%',
                  height: '100%',
                }}
                fill="var(--secondary)"
              />
            }
          />
        ))}
      {isToShowPointsEarned &&
        dummyMonths.map((item, index) => <PointsMonthSummary key={index} />)}
      {isToShowPointsEarned && (
        <Button
          className="mt-4"
          icon="EyeIcon"
          type="outlined"
          textColor="primary"
          color="primary"
          text="See more months"
          onClick={() => {}}
        />
      )}
      <div className={`mt-auto flex flex-col gap-4 pt-8`}>
        <Button
          icon="ShareIcon"
          type="filled"
          textColor="white"
          color="primary"
          text="Share"
          onClick={() => {}}
        />
        {!isToShowPointsEarned && (
          <Button
            icon="EyeIcon"
            type="outlined"
            textColor="primary"
            color="primary"
            text="See more"
            onClick={() => setIsToShowPointsEarned(true)}
          />
        )}
      </div>
    </BannerWrapper>
  );
};
