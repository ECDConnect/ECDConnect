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
  practitionerUserId: string;
}

export const dateOptions: Intl.DateTimeFormatOptions = {
  year: 'numeric',
  month: 'short',
  day: 'numeric',
};

export const SmartSpaceDetails: React.FC<SmartSpaceLicenceReceivedProps> = ({
  setShowCoachVisit,
  setNotificationStep,
  practitionerUserId,
}) => {
  const { isOnline } = useOnlineStatus();
  const appDispatch = useAppDispatch();
  const timeline = useSelector(
    traineeSelectors.getTraineeOnboardTimeline(practitionerUserId)
  );
  const smartSpaceVisitId = timeline?.sSCoachVisitId;
  const coachSmartSpaceAnswers = useSelector(
    traineeSelectors.getCoachSmartSpaceVisitData(smartSpaceVisitId)
  );
  const visitData1Completed = useSelector(
    traineeSelectors.getCoachSmartSpaceSectionScore(
      smartSpaceVisitId,
      'SmartSpace check'
    )
  );
  const coachSmartSpaceVisit1DataNotAttendedStandards = useSelector(
    traineeSelectors.getCoachSmartSpaceSectionFailedQuestions(
      smartSpaceVisitId,
      'SmartSpace check'
    )
  );

  const coachSmartSpaceVisit1DataNotAttendedStandardsFormatted =
    coachSmartSpaceVisit1DataNotAttendedStandards?.map((item) => {
      return item.question;
    });

  const discussNextStepsItem = coachSmartSpaceAnswers?.visitData.find(
    (item) => item.visitSection === 'Discuss next steps'
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
      className="h-screen pb-16"
    >
      <div className="h-screen p-4">
        {timeline?.smartSpaceLicenseNotAwardedDate &&
        !timeline?.smartSpaceLicenseDate ? (
          <Typography
            className={'my-3'}
            color={'textDark'}
            type={'h2'}
            text={`Venue does not meet SmartSpace standards`}
          />
        ) : (
          <Typography
            className={'my-3'}
            color={'textDark'}
            type={'h2'}
            text={`SmartSpace certificate awarded`}
          />
        )}
        {(!timeline?.smartSpaceLicenseNotAwardedDate ||
          timeline?.smartSpaceLicenseDate) && (
          <Alert
            className="mt-4"
            variant="outlined"
            type="success"
            title={`Great job! Your venue meets all the SmartSpace requirements!`}
            customIcon={<Emoji3 className="h-auto w-16" />}
          />
        )}
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

        {timeline?.smartSpaceLicenseNotAwardedDate &&
          !timeline?.smartSpaceLicenseDate &&
          (Number(visitData1Completed) < 17 ||
            visitData1Completed === undefined) && (
            <>
              <Alert
                className={'mt-5 mb-3'}
                title={`Your venue does not meet the basic SmartSpace standards. You are still working on:`}
                list={
                  coachSmartSpaceVisit1DataNotAttendedStandardsFormatted || []
                }
                type={'warning'}
              />
              <Alert
                className="mt-4"
                variant="outlined"
                type="info"
                title={`If you have completed all of the next steps, reach out to your coach and request a visit.`}
              />
            </>
          )}
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
        {!timeline?.smartSpaceLicenseDate && (
          <div>
            <Button
              type="filled"
              color="primary"
              className="mt-4 mb-2 w-full"
              onClick={() =>
                setNotificationStep &&
                setNotificationStep('SmartSpace visit from coach')
              }
            >
              {renderIcon('ArrowCircleRightIcon', 'mr-2 text-white w-5')}
              <Typography
                type={'help'}
                text={'Request a visit from coach'}
                color={'white'}
              />
            </Button>
          </div>
        )}
      </div>
    </BannerWrapper>
  );
};
