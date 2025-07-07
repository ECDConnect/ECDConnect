import {
  ActionModal,
  BannerWrapper,
  Button,
  DialogPosition,
  Typography,
} from '@ecdlink/ui';
import { useOnlineStatus } from '@/hooks/useOnlineStatus';
import { useCallback, useEffect, useState } from 'react';
import { ProgressReportingPeriodsNumber } from './progress-reporting-periods-number';
import { useHistory, useLocation } from 'react-router';
import { useAppDispatch } from '@/store';
import { classroomsSelectors, classroomsThunkActions } from '@/store/classroom';
import { useSelector } from 'react-redux';
import { useDialog, useSnackbar } from '@ecdlink/core';
import { ReactComponent as RobotIcon } from '@/assets/iconRobot.svg';
import { format } from 'date-fns';
import { ChildProgressReportPeriodDto } from '@/models/classroom/classroom.dto';
import { newGuid } from '@/utils/common/uuid.utils';
import { ProgressReportingPeriodsTimings } from './progress-reporting-periods-timings';
import ROUTES from '@/routes/routes';
import { TabsItems } from '../../class-dashboard/class-dashboard.types';
import { getAllNotifications } from '@/store/notifications/notifications.selectors';
import { notificationActions } from '@/store/notifications';

export type ProgressReportingPeriodsRouteState = {
  messageReference: string;
};

export const ProgressReportingPeriods: React.FC = () => {
  const { isOnline } = useOnlineStatus();
  const { showMessage } = useSnackbar();
  const appDispatch = useAppDispatch();
  const dialog = useDialog();
  const history = useHistory();
  const location = useLocation<ProgressReportingPeriodsRouteState>();
  const messageReference = location?.state?.messageReference;
  const notifications = useSelector(getAllNotifications);

  const lastYearsReportingPeriods = useSelector(
    classroomsSelectors.getPreviousYearsReportingPeriods()
  );

  const [currentStep, setCurrentStep] = useState<number>(1);
  const [numberOfReportingPeriods, setNumberOfReportingPeriods] = useState<
    number | undefined
  >(
    !!lastYearsReportingPeriods.length
      ? lastYearsReportingPeriods.length
      : undefined
  );

  // If we have dates from last year, map them and just update the year
  const [reportingPeriods, setReportingPeriods] = useState<
    ChildProgressReportPeriodDto[]
  >(
    lastYearsReportingPeriods.map((p) => {
      const startDate = new Date(p.startDate);
      const endDate = new Date(p.endDate);
      startDate.setFullYear(new Date().getFullYear());
      endDate.setFullYear(new Date().getFullYear());

      return {
        id: newGuid(),
        startDate: startDate.toString(),
        endDate: endDate.toString(),
      };
    })
  );

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
        copy.push({ id: newGuid(), startDate: '', endDate: '' });
      }
      setReportingPeriods(copy);
    }
  }, [numberOfReportingPeriods]);

  const isReportingPeriodsValid = () => {
    return reportingPeriods.some((x) => !x.startDate || !x.endDate);
  };

  const classroom = useSelector(classroomsSelectors.getClassroom);

  const onSubmit = () => {
    const save = async () =>
      appDispatch(
        await classroomsThunkActions.addChildProgressReportPeriods({
          classroomId: classroom!.id,
          childProgressReportPeriods: reportingPeriods.map((x) => ({
            id: x.id,
            startDate: new Date(x.startDate),
            endDate: new Date(x.endDate),
          })),
        })
      );

    const hasNotification = notifications?.find(
      (item) => item?.message?.reference === messageReference
    );

    if (hasNotification) {
      appDispatch(notificationActions.removeNotification(hasNotification!));
    }

    save();
    showMessage({
      message: 'Reporting dates added!',
    });
    handleGoBack();
  };

  const handleGoBack = () => {
    history.push(ROUTES.CLASSROOM.ROOT, {
      activeTabIndex: TabsItems.PROGRESS,
    });
  };

  const confirmDialog = useCallback(() => {
    dialog({
      position: DialogPosition.Middle,
      render: (submit, cancel) => (
        <ActionModal
          className="bg-white"
          customIcon={<RobotIcon />}
          importantText={'Confirm the dates below:'}
          customDetailText={
            <div className="mb-4">
              {reportingPeriods.map((p, i) => (
                <div key={`report-${i}`} className="flex flex-row items-start">
                  <Typography
                    type="body"
                    weight="bold"
                    color="primary"
                    text={`Report ${i + 1}: `}
                    className="mr-2"
                  />
                  <Typography
                    type="body"
                    color="textMid"
                    text={`${format(new Date(p.startDate), 'd MMM')} - ${format(
                      new Date(p.endDate),
                      'd MMM yyyy'
                    )}`}
                  />
                </div>
              ))}
            </div>
          }
          detailText={`You will not be able to change the dates for ${new Date().getFullYear()} once confirmed.`}
          actionButtons={[
            {
              text: 'Confirm',
              textColour: 'white',
              colour: 'quatenary',
              type: 'filled',
              onClick: () => {
                onSubmit();
                submit();
              },
              leadingIcon: 'CheckCircleIcon',
            },
            {
              text: 'Change dates',
              textColour: 'quatenary',
              colour: 'quatenary',
              type: 'outlined',
              onClick: () => {
                cancel();
              },
              leadingIcon: 'PencilIcon',
            },
          ]}
        />
      ),
    });
  }, [dialog, reportingPeriods]);

  return (
    <BannerWrapper
      title={'Child progress reporting periods'}
      color={'primary'}
      size="small"
      onBack={() => (currentStep === 1 ? handleGoBack() : setCurrentStep(1))}
      displayOffline={!isOnline}
    >
      <div className="flex h-full w-full flex-col overflow-y-auto p-4">
        {currentStep === 1 && (
          <ProgressReportingPeriodsNumber
            numberOfReportingPeriods={numberOfReportingPeriods}
            setNumberOfReportingPeriods={setNumberOfReportingPeriods}
          />
        )}
        {currentStep === 2 && (
          <ProgressReportingPeriodsTimings
            reportingPeriods={reportingPeriods}
            setReportingPeriods={setReportingPeriods}
          />
        )}
        <Button
          onClick={() => {
            currentStep === 2
              ? confirmDialog()
              : setCurrentStep(currentStep + 1);
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
