import { useOnlineStatus } from '@/hooks/useOnlineStatus';
import { coachSelectors } from '@/store/coach';
import {
  Alert,
  BannerWrapper,
  Button,
  Card,
  Typography,
  renderIcon,
} from '@ecdlink/ui';
import { useSelector } from 'react-redux';
import { ReactComponent as Emoji3 } from '@/assets/ECD_Connect_emoji3.svg';
import { useCallback, useEffect } from 'react';
import { useAppDispatch } from '@/store';
import { traineeSelectors, traineeThunkActions } from '@/store/trainee';
import { getStepDate } from '../timeline-steps';

interface SmartSpaceLicenceReceivedProps {
  setShowCoachVisit: (item: boolean) => void;
  setNotificationStep?: (item: string) => void;
}

export const dateOptions: Intl.DateTimeFormatOptions = {
  year: 'numeric',
  month: 'short',
  day: 'numeric',
};

export const SmartSpaceLicenceReceived: React.FC<
  SmartSpaceLicenceReceivedProps
> = ({ setShowCoachVisit, setNotificationStep }) => {
  const { isOnline } = useOnlineStatus();
  const appDispatch = useAppDispatch();
  const timeline = useSelector(traineeSelectors.getTraineeOnboardTimeline);
  const smartSpaceVisitId = timeline?.sSCoachVisitId;
  const coachSmartSpaceAnwers = useSelector(
    traineeSelectors?.getCoachSmartSpaceVisitData
  );

  const discussNextStepsItem = coachSmartSpaceAnwers?.find(
    (item) => item?.visitSection === 'Discuss next steps'
  );

  const fetchSmartSpaceVisitData = useCallback(async () => {
    await appDispatch(
      traineeThunkActions.getCoachSmartSpaceVisitData({
        visitId: smartSpaceVisitId,
      })
    );
  }, [appDispatch, smartSpaceVisitId]);

  useEffect(() => {
    fetchSmartSpaceVisitData();
  }, [fetchSmartSpaceVisitData]);

  return (
    <BannerWrapper
      showBackground={false}
      size="medium"
      renderBorder={true}
      title={'View SmartSpace details'}
      color={'primary'}
      onBack={() => {
        setNotificationStep && setNotificationStep('');
        setShowCoachVisit(false);
      }}
      displayOffline={!isOnline}
      renderOverflow={true}
      className="h-screen"
    >
      <div className="h-screen p-4">
        <Typography
          className={'my-3'}
          color={'textDark'}
          type={'h2'}
          text={`SmartSpace certificate awarded`}
        />
        <Alert
          className="mt-4"
          variant="outlined"
          type="success"
          title={`Great job! Your venue meets all the SmartSpace requirements!`}
          customIcon={<Emoji3 className="h-auto w-16" />}
        />
        <Card className="bg-uiBg mt-4 rounded-2xl p-4">
          <Typography
            type={'body'}
            weight="bold"
            text={`Next steps from SmartSpace visit`}
            color={'textDark'}
            className={'mt-3'}
          />
          <Typography
            type={'body'}
            text={`${getStepDate(timeline?.smartSpaceLicenseDate)}`}
            color={'textMid'}
            className={'mb-3 mt-1'}
          />
          <Typography
            type={'body'}
            text={`${discussNextStepsItem?.questionAnswer}`}
            color={'textMid'}
            className={'mb-3'}
          />
        </Card>
        <Button
          type="outlined"
          color="primary"
          className="mt-4 mb-2 w-full"
          onClick={() => {
            setNotificationStep &&
              setNotificationStep('Coach SmartSpace checklist');
          }}
        >
          {renderIcon('EyeIcon', 'mr-2 text-primary w-5')}
          <Typography type={'body'} text={'View detail'} color={'primary'} />
        </Button>
      </div>
    </BannerWrapper>
  );
};
