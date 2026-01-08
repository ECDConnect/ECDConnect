import {
  ActionModal,
  BannerWrapper,
  Button,
  Dialog,
  DialogPosition,
  ProfileAvatar,
  Typography,
} from '@ecdlink/ui';
import { useOnlineStatus } from '@/hooks/useOnlineStatus';
import { useCallback, useEffect, useState } from 'react';
import { ProgressReportingPeriodsNumber } from './progress-reporting-periods-number';
import { useHistory, useLocation } from 'react-router';
import { useAppDispatch } from '@/store';
import {
  classroomsActions,
  classroomsSelectors,
  classroomsThunkActions,
} from '@/store/classroom';
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
import { disableBackendNotification } from '@/store/notifications/notifications.actions';
import { EditLogo } from '@/pages/practitioner/practitioner-programme-information/edit-logo/edit-logo';

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
  const [showEditLogo, setShowEditLogo] = useState(false);

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
    const save = async () => {
      if (isOnline) {
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
      } else {
        appDispatch(
          await classroomsActions.addChildProgressReportPeriod({
            childProgressReportPeriods: reportingPeriods.map((x) => ({
              id: x.id,
              startDate: new Date(x.startDate).toISOString(),
              endDate: new Date(x.endDate).toISOString(),
            })),
          })
        );
      }

      const notificationsToRemove = notifications?.filter(
        (item) => item?.message?.reference === messageReference
      );

      if (notificationsToRemove && notificationsToRemove?.length > 0) {
        notificationsToRemove.map((notification) => {
          if (notification.message?.isFromBackend && isOnline) {
            appDispatch(
              disableBackendNotification({
                notificationId: notification.message.reference ?? '',
              })
            );
          }
          appDispatch(notificationActions.removeNotification(notification!));
        });
      }
    };
    save();
    showMessage({
      message: 'Reporting dates added!',
    });
  };

  const handleGoBack = () => {
    history.push(ROUTES.CLASSROOM.ROOT, {
      activeTabIndex: TabsItems.PROGRESS,
    });
  };

  const handleLogoUpdate = () => {
    setShowEditLogo(false);
    handleGoBack();
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
                !!classroom?.classroomImageUrl
                  ? confirmLogoDialog()
                  : confirmNewLogoDialog();
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

  const confirmLogoDialog = useCallback(() => {
    dialog({
      position: DialogPosition.Middle,
      render: (submit, cancel) => (
        <ActionModal
          className="bg-white"
          customIcon={
            <div className={'inline-flex w-full justify-center pt-8'}>
              <ProfileAvatar
                dataUrl={classroom?.classroomImageUrl || ''}
                size={'header'}
                onPressed={() => {}}
                hasConsent={true}
                isPreschoolImage={true}
                canChangeImage={false}
              />
            </div>
          }
          importantText={'Your preschool logo will appear on child reports'}
          detailText={`This logo will be shown on all reports for this reporting period. Make sure it’s correct.`}
          actionButtons={[
            {
              text: 'Yes, this logo is correct!',
              textColour: 'white',
              colour: 'quatenary',
              type: 'filled',
              onClick: () => {
                handleGoBack();
                submit();
              },
              leadingIcon: 'CheckCircleIcon',
            },
            {
              text: 'Change logo',
              textColour: 'quatenary',
              colour: 'quatenary',
              type: 'outlined',
              onClick: () => {
                setShowEditLogo(true);
                cancel();
              },
              leadingIcon: 'RefreshIcon',
            },
          ]}
        />
      ),
    });
  }, [dialog, reportingPeriods]);

  const confirmNewLogoDialog = useCallback(() => {
    dialog({
      position: DialogPosition.Middle,
      render: (submit, cancel) => (
        <ActionModal
          className="bg-white"
          customIcon={<RobotIcon />}
          importantText={'Would you like to add a preschool logo?'}
          detailText={`The logo you upload will be shown on all reports for this reporting period.`}
          actionButtons={[
            {
              text: 'Yes, I want to add a logo',
              textColour: 'white',
              colour: 'quatenary',
              type: 'filled',
              onClick: () => {
                setShowEditLogo(true);
                submit();
              },
              leadingIcon: 'CheckCircleIcon',
            },
            {
              text: 'No, I don’t want to add a logo',
              textColour: 'quatenary',
              colour: 'quatenary',
              type: 'outlined',
              onClick: () => {
                handleGoBack();
                cancel();
              },
              leadingIcon: 'XIcon',
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
      size="medium"
      renderBorder={true}
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
            if (currentStep === 2) {
              confirmDialog();
            } else {
              setCurrentStep(currentStep + 1);
            }
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
      <Dialog fullScreen visible={showEditLogo} position={DialogPosition.Full}>
        <EditLogo setShowEditLogo={handleLogoUpdate} />
      </Dialog>
    </BannerWrapper>
  );
};
