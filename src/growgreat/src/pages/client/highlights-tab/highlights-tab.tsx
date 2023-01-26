import { useCallback, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { useWindowSize } from '@reach/window-size';

import { userSelectors } from '@/store/user';
import { getWeekDate } from '@ecdlink/core';
import {
  Alert,
  Button,
  Divider,
  renderIcon,
  RoundIcon,
  Typography,
} from '@ecdlink/ui';
import { SuccessCard } from '@/components/success-card/success-card';
import { ReactComponent as CelebrateIcon } from '@/assets/celebrateIcon.svg';
import { ReactComponent as ClipboardIcon } from '@/assets/clipboardIcon.svg';
import { useHistory } from 'react-router';
import ROUTES from '@/routes/routes';

interface CardProps {
  value: number;
  label: string;
  icon: string;
  points?: number;
}

const HEADER_HEIGHT = 122;

const MOCK_DATA: CardProps[] = [
  {
    value: 10,
    label: 'Families visited',
    icon: 'HomeIcon',
  },
  {
    value: 2,
    label: 'Children growth monitored',
    icon: 'ChartBarIcon',
    points: 200,
  },
  {
    value: 3,
    label: 'New clients',
    icon: 'UserAddIcon',
    points: 500,
  },
];

export const HighlightsTab = () => {
  const [showSuccessCard, setShowSuccessCard] = useState(true); // TODO: add integration
  const [isHighlights] = useState(false); // TODO: add integration

  const history = useHistory();

  const { height } = useWindowSize();

  const startDate = `${getWeekDate('monday').getDate()} ${getWeekDate(
    'monday'
  ).toLocaleString('default', { month: 'long' })}`;
  const endDate = `${getWeekDate('friday').getDate()} ${getWeekDate(
    'friday'
  ).toLocaleString('default', { month: 'long' })}`;

  const user = useSelector(userSelectors.getUser);

  const onCloseSuccessCard = useCallback(() => {
    setShowSuccessCard(false);
  }, []);

  const navigate = useCallback(
    (location) => () => {
      history.push(location);
    },
    [history]
  );

  const Card = useCallback(
    ({ value, label, icon, points }: CardProps) => (
      <div className="bg-uiBg mb-4 flex items-center gap-3 rounded-2xl p-4">
        <RoundIcon icon={icon} iconColor="white" backgroundColor="tertiary" />
        <Typography
          type="body"
          weight="bold"
          lineHeight="snug"
          color="textDark"
          className="text-3xl"
          text={String(value)}
        />
        <Typography
          type="h4"
          weight="bold"
          lineHeight="snug"
          color="textMid"
          text={label}
          className="w-screen"
        />
        {!!points && (
          <div className="relative mr-1 flex h-12 w-12 items-center justify-center bg-transparent text-center">
            <span className="bg-secondary absolute top-3 h-5 w-6 rounded-xl"></span>
            {renderIcon('BadgeCheckIcon', 'text-secondary absolute h-12 w-12')}
            <Typography
              type="body"
              weight="bold"
              lineHeight="snug"
              color="white"
              className="absolute pt-1"
              text={String(points)}
            />
          </div>
        )}
      </div>
    ),
    []
  );

  const renderContent = useMemo(() => {
    if (isHighlights) {
      return (
        <>
          <Divider className="pb-4" dividerType="dashed" />
          {showSuccessCard && (
            <SuccessCard
              className="my-4"
              customIcon={<CelebrateIcon className="h-14	w-14" />}
              text={`Great job ${user?.firstName || ''}!`}
              color="successMain"
              onClose={onCloseSuccessCard}
            />
          )}
          {MOCK_DATA.map((item) => (
            <Card
              key={item.value}
              value={item.value}
              label={item.label}
              icon={item.icon}
              points={item.points}
            />
          ))}
        </>
      );
    }

    return (
      <div className="flex flex-col items-center justify-center">
        <Alert
          type={'info'}
          className="mt-4 flex w-full items-center justify-center"
          title={`Keep going ${user?.firstName || ''}!`}
          list={[
            'You didn’t earn any points on CHW Connect last week',
            'Register new clients and do home visits to earn points!',
          ]}
        />
        <ClipboardIcon className="mb-4 mt-7" />
        <Typography
          type="h3"
          weight="bold"
          lineHeight="snug"
          align="center"
          className="mx-9"
          text="Start visiting & registering clients to see your highlights!"
        />
      </div>
    );
  }, [
    Card,
    isHighlights,
    onCloseSuccessCard,
    showSuccessCard,
    user?.firstName,
  ]);

  return (
    <div
      className="flex flex-col p-4"
      style={{ height: height - HEADER_HEIGHT }}
    >
      <Typography
        type="h2"
        weight="bold"
        lineHeight="snug"
        text="This week’s highlights"
      />
      <Typography
        type="h4"
        weight="bold"
        lineHeight="snug"
        color="textMid"
        className="mb-6"
        text={`${startDate} to ${endDate}`}
      />
      {renderContent}
      <div className="flex h-full flex-col justify-end">
        <Button
          text="See upcoming visits"
          icon="CalendarIcon"
          type="filled"
          color="primary"
          textColor="white"
          className="mt-4 w-full"
          iconPosition="start"
          onClick={navigate(ROUTES.CLIENTS.HIGHLIGHTS_TAB.UPCOMING_VISIT)}
        />
        {isHighlights && (
          <Button
            text="See points summary"
            icon="StarIcon"
            type="outlined"
            color="primary"
            textColor="primary"
            className="mt-4 w-full"
            iconPosition="start"
            onClick={navigate(ROUTES.CLIENTS.HIGHLIGHTS_TAB.POINTS_SUMMARY)}
          />
        )}
      </div>
    </div>
  );
};
