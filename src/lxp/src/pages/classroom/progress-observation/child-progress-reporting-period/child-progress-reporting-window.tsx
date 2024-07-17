import { BannerWrapper, Button } from '@ecdlink/ui';
import { useOnlineStatus } from '@/hooks/useOnlineStatus';
import { useEffect, useState } from 'react';
import { ChildProgressReportingPeriodsNumber } from './child-progress-reporting-window-number';
import { ChildProgressReportingPeriodsTimings } from './child-progress-reporting-window-timings';
import { useHistory } from 'react-router';
import { useAppDispatch } from '@/store';
import { classroomsSelectors, classroomsThunkActions } from '@/store/classroom';
import { useSelector } from 'react-redux';

export const ChildProgressReportingPeriods: React.FC = () => {
  const { isOnline } = useOnlineStatus();
  const appDispatch = useAppDispatch();
  const history = useHistory();

  const [currentStep, setCurrentStep] = useState<number>(1);
  const [numberOfReportingPeriods, setNumberOfReportingPeriods] = useState<
    number | undefined
  >();
  const [reportingPeriods, setReportingPeriods] = useState<
    { startDate: string; endDate: string }[]
  >([]);

  useEffect(() => {
    if (!numberOfReportingPeriods) {
      return;
    }

    if (reportingPeriods.length > numberOfReportingPeriods) {
      setReportingPeriods(reportingPeriods.slice(0, numberOfReportingPeriods));
    }

    if (reportingPeriods.length < numberOfReportingPeriods) {
      const copy = [...reportingPeriods];
      for (let i = reportingPeriods.length; i < numberOfReportingPeriods; i++) {
        copy.push({ startDate: '', endDate: '' });
      }
      setReportingPeriods(copy);
    }
  }, [numberOfReportingPeriods]);

  const isReportingPeriodsValid = () => {
    return reportingPeriods.some((x) => !x.startDate || !x.endDate);
  };

  const classroom = useSelector(classroomsSelectors.getClassroom);

  const onSubmit = () => {
    appDispatch(
      classroomsThunkActions.addChildProgressReportPeriods({
        classroomId: classroom!.id,
        childProgressReportPeriods: reportingPeriods.map((x) => ({
          startDate: new Date(x.startDate),
          endDate: new Date(x.endDate),
        })),
      })
    );
    history.goBack();
  };

  return (
    <BannerWrapper
      title={'Child progress reporting periods'}
      color={'primary'}
      size="small"
      onBack={() => history.goBack()}
      displayOffline={!isOnline}
    >
      <div className="flex h-full w-full flex-col overflow-y-auto p-4">
        {currentStep === 1 && (
          <ChildProgressReportingPeriodsNumber
            numberOfReportingPeriods={numberOfReportingPeriods}
            setNumberOfReportingPeriods={setNumberOfReportingPeriods}
          />
        )}
        {currentStep === 2 && (
          <ChildProgressReportingPeriodsTimings
            reportingPeriods={reportingPeriods}
            setReportingPeriods={setReportingPeriods}
          />
        )}
        <Button
          onClick={() => {
            currentStep === 2 ? onSubmit() : setCurrentStep(currentStep + 1);
          }}
          disabled={
            currentStep === 2
              ? isReportingPeriodsValid()
              : !numberOfReportingPeriods
          }
          className="mt-auto w-full"
          size="small"
          color="quatenary"
          textColor="white"
          type="filled"
          icon={currentStep === 2 ? 'SaveIcon' : 'ArrowCircleRightIcon'}
          text={currentStep === 2 ? 'Save' : 'Next'}
        />
      </div>
    </BannerWrapper>
  );
};
