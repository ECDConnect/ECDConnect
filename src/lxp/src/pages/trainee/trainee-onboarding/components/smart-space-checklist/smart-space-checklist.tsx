import { useOnlineStatus } from '@/hooks/useOnlineStatus';
import { authSelectors } from '@/store/auth';
import {
  Alert,
  BannerWrapper,
  Button,
  Dialog,
  DialogPosition,
  LoadingSpinner,
  MenuListDataItem,
  StackedList,
  Typography,
  renderIcon,
} from '@ecdlink/ui';
import { format } from 'date-fns';
import { useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router';
import { ProgrammeDetails } from './components/programme-details/programme-details';
import {
  CmsVisitDataInputModelInput,
  CmsVisitSectionInput,
  InputMaybe,
  SsChecklistVisitModelInput,
} from '@ecdlink/graphql';
import { traineeSelectors, traineeThunkActions } from '@/store/trainee';
import { SectionQuestions } from './components/programme-details/programme-details.types';
import { TraineeService } from '@/services/TraineeService';
import { practitionerSelectors } from '@/store/practitioner';
import { SmartSpaceChecklisstStepsSteps } from './smart-space-checklist.types';
import { HealthSanitationSafety } from './components/health-sanitation-safety/health-sanitation-safety';
import { HealthStructureArea } from './components/safety-structure-area/health-strutcture-area.';
import { SpaceEmergencyPlanning } from './components/space-emergency-planning/space-emergency-planning';
import { useThunkFetchCall } from '@/hooks/useThunkFetchCall';
import { useAppDispatch } from '@/store';
import ROUTES from '@/routes/routes';
import PositiveBonusEmoticon from '../../../../../assets/positive-bonus-emoticon.png';
import { CoachVisitInfo } from '../trainee-onboarding-dashboard/components/coach-visit-info';

interface SmartSpaceChecklistProps {
  setNotificationStep: any;
  isSmartChecklist?: any;
}

export const SmartSpaceChecklist: React.FC<SmartSpaceChecklistProps> = ({
  setNotificationStep,
  isSmartChecklist,
}) => {
  const { isOnline } = useOnlineStatus();
  const appDispatch = useAppDispatch();
  const history = useHistory();
  const date = format(new Date(), 'EEEE, d LLLL');
  const userAuth = useSelector(authSelectors.getAuthUser);
  const [sectionQuestions, setSectionQuestions] =
    useState<SectionQuestions[]>();
  const [visitSection, setVisitSection] = useState('');
  const practitioner = useSelector(practitionerSelectors.getPractitioner);
  const [activeStep, setActiveStep] = useState(
    SmartSpaceChecklisstStepsSteps.INITIAL
  );
  const traineeTimeline = useSelector(
    traineeSelectors.getTraineeOnboardTimeline
  );
  const traineeVisitData = useSelector(traineeSelectors.getTraineeVisitData);
  const traineeVisits = traineeTimeline?.traineeVisits;
  const traineeCurrentVisit = traineeVisits?.[0];
  const [isShowCompletedForms, setIsShowCompletedForms] = useState(false);
  const [showCoachVisit, setSHowCoachVisit] = useState(false);

  const { isLoading } = useThunkFetchCall('trainee', 'getTraineeVisitData');

  const completedItems = (visitSectionName: string) => {
    const completedItems = traineeVisitData
      ?.filter((item) => item?.visitSection === visitSectionName)
      .filter(
        (item) =>
          item?.questionAnswer === 'true' ||
          item?.questionAnswer !== '' ||
          item?.questionAnswer === undefined
      );
    return completedItems?.length;
  };

  useEffect(() => {
    if (activeStep) {
      const getTraineeTimeline = async () => {
        await appDispatch(
          traineeThunkActions.getTraineeTimeline({
            userId: practitioner?.userId ? practitioner?.userId : '',
          })
        );
      };

      const getVisitData = async () => {
        await appDispatch(
          traineeThunkActions.getTraineeVisitData({
            visitId: traineeCurrentVisit?.id,
          })
        );
      };

      getTraineeTimeline();
      getVisitData();
    }
  }, [activeStep, appDispatch, practitioner?.userId, traineeCurrentVisit?.id]);

  const onSubmit = async () => {
    const sections = sectionQuestions?.map((item) => ({
      ...item,
      questions: item.questions.map((question) => ({
        ...question,
        answer: String(question.answer),
      })),
    })) as InputMaybe<Array<InputMaybe<CmsVisitSectionInput>>>;
    if (traineeCurrentVisit) {
      const visitDateInput: CmsVisitDataInputModelInput = {
        visitId: traineeCurrentVisit?.id,
        traineeId: practitioner?.userId,
        visitData: {
          visitName: 'SmartSpace Checklist',
          sections,
        },
      };
      await new TraineeService(userAuth?.auth_token!).addVisitData(
        visitDateInput
      );

      setActiveStep(SmartSpaceChecklisstStepsSteps.INITIAL);
      return;
    } else {
      const visitDateInput: SsChecklistVisitModelInput = {
        traineeId: practitioner?.userId,
        attended: false,
        plannedVisitDate: new Date(),
        checklistData: {
          traineeId: practitioner?.userId,
          visitData: {
            visitName: 'SmartSpace Checklist',
            sections,
          },
        },
      };

      await new TraineeService(userAuth?.auth_token!).addSSChecklistForTrainee(
        visitDateInput
      );

      setActiveStep(SmartSpaceChecklisstStepsSteps.INITIAL);
    }
  };

  const onSubmitAndContinue = async () => {
    const sections = sectionQuestions?.map((item) => ({
      ...item,
      questions: item.questions.map((question) => ({
        ...question,
        answer: String(question.answer),
      })),
    })) as InputMaybe<Array<InputMaybe<CmsVisitSectionInput>>>;
    if (traineeCurrentVisit) {
      const visitDateInput: CmsVisitDataInputModelInput = {
        visitId: traineeCurrentVisit?.id,
        traineeId: practitioner?.userId,
        visitData: {
          visitName: 'SmartSpace Checklist',
          sections,
        },
      };

      await new TraineeService(userAuth?.auth_token!).addVisitData(
        visitDateInput
      );

      if (activeStep < 5) {
        setActiveStep(activeStep + 1);
        return;
      }

      setActiveStep(SmartSpaceChecklisstStepsSteps.INITIAL);
      return;
    } else {
      const visitDateInput: SsChecklistVisitModelInput = {
        traineeId: practitioner?.userId,
        attended: false,
        plannedVisitDate: new Date(),
        checklistData: {
          traineeId: practitioner?.userId,
          visitData: {
            visitName: 'SmartSpace Checklist',
            sections,
          },
        },
      };

      await new TraineeService(userAuth?.auth_token!).addSSChecklistForTrainee(
        visitDateInput
      );

      if (activeStep < 5) {
        setActiveStep(activeStep + 1);
        return;
      }
      setActiveStep(SmartSpaceChecklisstStepsSteps.INITIAL);
    }
  };

  const steps = (step: SmartSpaceChecklisstStepsSteps) => {
    switch (step) {
      case SmartSpaceChecklisstStepsSteps.PROGRAMME_DETAILS:
        return (
          <ProgrammeDetails
            setSectionQuestions={setSectionQuestions}
            setVisitSection={setVisitSection}
            onSubmit={onSubmit}
            onSubmitAndContinue={onSubmitAndContinue}
            setActiveStep={setActiveStep}
          />
        );

      case SmartSpaceChecklisstStepsSteps.HEALTH_SANITATION_SAFETY:
        return (
          <HealthSanitationSafety
            setSectionQuestions={setSectionQuestions}
            setVisitSection={setVisitSection}
            onSubmit={onSubmit}
            onSubmitAndContinue={onSubmitAndContinue}
            setActiveStep={setActiveStep}
          />
        );
      case SmartSpaceChecklisstStepsSteps.SAFETY_STRUCTURE_AREA:
        return (
          <HealthStructureArea
            setSectionQuestions={setSectionQuestions}
            setVisitSection={setVisitSection}
            onSubmit={onSubmit}
            onSubmitAndContinue={onSubmitAndContinue}
            setActiveStep={setActiveStep}
          />
        );
      case SmartSpaceChecklisstStepsSteps.SPACE_EMERGENCY_PLANNING:
        return (
          <SpaceEmergencyPlanning
            setSectionQuestions={setSectionQuestions}
            setVisitSection={setVisitSection}
            onSubmit={onSubmit}
            onSubmitAndContinue={onSubmitAndContinue}
            setActiveStep={setActiveStep}
          />
        );
      default:
        return null;
    }
  };

  const notificationItems: MenuListDataItem[] = [];

  const notificationItemsLaterStage: MenuListDataItem[] = [];

  const notificationsCompleted: MenuListDataItem[] = [];

  if (
    !traineeVisitData?.some((item) => item.visitSection === 'Programme details')
  ) {
    notificationItems.push({
      showIcon: true,
      menuIcon: 'DocumentTextIcon',
      menuIconClassName: 'border-0',
      iconColor: 'white',
      title: 'Programme details',
      titleStyle: 'text-textDark semibold',
      subTitle: '0 of 6 completed',
      subTitleStyle: 'text-textMid',
      iconBackgroundColor: 'tertiary',
      backgroundColor: 'uiBg',
      onActionClick: () =>
        setActiveStep(SmartSpaceChecklisstStepsSteps.PROGRAMME_DETAILS),
    });
  } else {
    const completedSectionItems = completedItems('Programme details');
    notificationsCompleted.push({
      showIcon: true,
      menuIcon: 'DocumentTextIcon',
      menuIconClassName: 'border-0',
      iconColor: 'white',
      title: 'Programme details',
      titleStyle: 'text-textDark semibold',
      subTitle: `${
        completedSectionItems && completedSectionItems > 6
          ? 6
          : completedSectionItems
      } of 6 completed`,
      subTitleStyle: 'text-successMain',
      iconBackgroundColor: 'successMain',
      backgroundColor: 'successBg',
      onActionClick: () =>
        setActiveStep(SmartSpaceChecklisstStepsSteps.PROGRAMME_DETAILS),
    });
  }

  if (
    !traineeVisitData?.some(
      (item) => item.visitSection === 'Health, sanitation & safety'
    )
  ) {
    notificationItems.push({
      showIcon: true,
      menuIcon: 'PlusCircleIcon',
      menuIconClassName: 'border-0',
      iconColor: 'white',
      title: 'Health, sanitation & safety',
      titleStyle: 'text-textDark semibold',
      subTitle: '0 of 6 completed',
      subTitleStyle: 'text-textMid',
      iconBackgroundColor: 'tertiary',
      backgroundColor: 'uiBg',
      onActionClick: () =>
        setActiveStep(SmartSpaceChecklisstStepsSteps.HEALTH_SANITATION_SAFETY),
    });
  } else {
    const completedSectionItems = completedItems('Health, sanitation & safety');
    notificationsCompleted.push({
      showIcon: true,
      menuIcon: 'PlusCircleIcon',
      menuIconClassName: 'border-0',
      iconColor: 'white',
      title: 'Health, sanitation & safety',
      titleStyle: 'text-textDark semibold',
      subTitle: `${completedSectionItems} of 7 completed`,
      subTitleStyle: 'text-successMain',
      iconBackgroundColor: 'successMain',
      backgroundColor: 'successBg',
      onActionClick: () =>
        setActiveStep(SmartSpaceChecklisstStepsSteps.HEALTH_SANITATION_SAFETY),
    });
  }

  if (
    !traineeVisitData?.some(
      (item) => item.visitSection === 'Safety - structure, space & area'
    )
  ) {
    notificationItems.push({
      showIcon: true,
      menuIcon: 'ShieldCheckIcon',
      menuIconClassName: 'border-0',
      iconColor: 'white',
      title: 'Safety - structure & area',
      titleStyle: 'text-textDark semibold',
      subTitle: '0 of 10 completed',
      subTitleStyle: 'text-textMid',
      iconBackgroundColor: 'tertiary',
      backgroundColor: 'uiBg',
      onActionClick: () =>
        setActiveStep(SmartSpaceChecklisstStepsSteps.SAFETY_STRUCTURE_AREA),
    });
  } else {
    const completedSectionItems = completedItems(
      'Safety - structure, space & area'
    );
    notificationsCompleted.push({
      showIcon: true,
      menuIcon: 'ShieldCheckIcon',
      menuIconClassName: 'border-0',
      iconColor: 'white',
      title: 'Safety - structure & area',
      titleStyle: 'text-textDark semibold',
      subTitle: `${completedSectionItems} of 10 completed`,
      subTitleStyle: 'text-successMain',
      iconBackgroundColor: 'successMain',
      backgroundColor: 'successBg',
      onActionClick: () =>
        setActiveStep(SmartSpaceChecklisstStepsSteps.SAFETY_STRUCTURE_AREA),
    });
  }

  if (
    !traineeVisitData?.some(
      (item) => item.visitSection === 'Space & emergency planning'
    )
  ) {
    notificationItemsLaterStage.push({
      showIcon: true,
      menuIcon: 'ShieldExclamationIcon',
      menuIconClassName: 'border-0',
      iconColor: 'white',
      title: 'Space & emergency planning',
      titleStyle: 'text-textDark semibold',
      subTitle: '0 of 4 completed',
      subTitleStyle: 'text-textMid',
      iconBackgroundColor: 'tertiary',
      backgroundColor: 'uiBg',
      onActionClick: () =>
        setActiveStep(SmartSpaceChecklisstStepsSteps.SPACE_EMERGENCY_PLANNING),
    });
  } else {
    const completedSectionItems = completedItems('Space & emergency planning');
    notificationsCompleted.push({
      showIcon: true,
      menuIcon: 'ShieldExclamationIcon',
      menuIconClassName: 'border-0',
      iconColor: 'white',
      title: 'Space & emergency planning',
      titleStyle: 'text-textDark semibold',
      subTitle: `${completedSectionItems} of 4 completed`,
      subTitleStyle: 'text-successMain',
      iconBackgroundColor: 'successMain',
      backgroundColor: 'successBg',
      onActionClick: () =>
        setActiveStep(SmartSpaceChecklisstStepsSteps.SPACE_EMERGENCY_PLANNING),
    });
  }

  const allStepsComplete = useMemo(
    () =>
      traineeCurrentVisit?.id &&
      notificationItems?.length === 0 &&
      notificationItemsLaterStage?.length === 0 &&
      !isSmartChecklist,
    [
      isSmartChecklist,
      notificationItems?.length,
      notificationItemsLaterStage?.length,
      traineeCurrentVisit?.id,
    ]
  );

  const allStepsCompleteFromDashboard = useMemo(
    () =>
      traineeCurrentVisit?.id &&
      notificationItems?.length === 0 &&
      notificationItemsLaterStage?.length === 0 &&
      isSmartChecklist,
    [
      isSmartChecklist,
      notificationItems?.length,
      notificationItemsLaterStage?.length,
      traineeCurrentVisit?.id,
    ]
  );

  useEffect(() => {
    if (allStepsComplete) {
      history.push(ROUTES?.TRAINEE?.TRAINEE_ONBOARDING);
      setNotificationStep('');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allStepsComplete]);

  return activeStep !== SmartSpaceChecklisstStepsSteps.INITIAL ? (
    <div className="h-screen">{steps(activeStep)}</div>
  ) : isLoading ? (
    <div className="absolute bottom-auto left-auto h-screen w-full">
      <LoadingSpinner
        size="big"
        spinnerColor="white"
        backgroundColor="uiMid"
        className="mt-40"
      />
      <div className="flex justify-center">
        {' '}
        <Typography
          className={'my-3'}
          color={'textDark'}
          type={'h2'}
          text={'Loading...'}
        />
      </div>
    </div>
  ) : (
    <BannerWrapper
      showBackground={false}
      size="medium"
      renderBorder={true}
      title={'Business'}
      subTitle={date}
      color={'primary'}
      onBack={history.goBack}
      displayOffline={!isOnline}
      renderOverflow={true}
    >
      <div className="flex flex-col justify-around p-4">
        <div>
          <Typography
            className={'my-3'}
            color={'textDark'}
            type={'h2'}
            text={'SmartSpace checklist'}
          />
          {!allStepsCompleteFromDashboard && (
            <>
              <Alert
                className={'mt-5 mb-3'}
                title="Use this list to check if your venue meets the SmartStart standards."
                list={[
                  'As you prepare your venue, you can track your progress here.',
                ]}
                type={'info'}
              />
              <Typography
                className={'my-4'}
                color={'textDark'}
                type={'h2'}
                text={'Complete these steps before your SmartSpace check'}
              />
            </>
          )}
          {allStepsCompleteFromDashboard && (
            <>
              <div className="bg-successMain grid grid-cols-1 justify-center gap-4 rounded-2xl p-4">
                <div className="flex">
                  <div className="flex justify-center">
                    <img
                      src={PositiveBonusEmoticon}
                      alt="developing well"
                      className="mt-3 ml-2 mr-2 h-12 w-16"
                    />
                  </div>
                  <div className="ml-3">
                    <div className="flex justify-center">
                      <Typography
                        type="h3"
                        weight="bold"
                        color={'white'}
                        text={`Well done! You have completed all the required SmartSpace steps. `}
                        fontSize="18"
                        className="pt-2"
                      />
                    </div>
                    <div className="mt-1 flex justify-center">
                      <Typography
                        type="body"
                        color={'white'}
                        text={`Your coach has been asked to schedule the SmartSpace check!`}
                        fontSize="14"
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div>
                <Button
                  type="filled"
                  color="primary"
                  className="mt-4 mb-2 w-full"
                  onClick={() => setSHowCoachVisit(true)}
                >
                  {renderIcon('ArrowCircleRightIcon', 'mr-2 text-white w-5')}
                  <Typography
                    type={'help'}
                    text={'Request a visit from coach'}
                    color={'white'}
                  />
                </Button>
              </div>
            </>
          )}
          <StackedList
            isFullHeight={false}
            className={'flex flex-col gap-2'}
            listItems={notificationItems}
            type={'MenuList'}
          />
          {!allStepsCompleteFromDashboard && (
            <Typography
              className={'my-3'}
              color={'textDark'}
              type={'h2'}
              text={'You can complete these steps at a later stage'}
            />
          )}
          <StackedList
            isFullHeight={false}
            className={'flex flex-col gap-2'}
            listItems={notificationItemsLaterStage}
            type={'MenuList'}
          />
          {notificationsCompleted?.length > 0 && (
            <div>
              <Button
                type="outlined"
                color="primary"
                className="mt-2 mb-4 w-full"
                icon={isShowCompletedForms ? 'EyeOffIcon' : 'EyeIcon'}
                text={
                  isShowCompletedForms
                    ? 'Hide completed activities'
                    : 'See completed activities'
                }
                textColor="primary"
                onClick={() => {
                  setIsShowCompletedForms((prevState) => !prevState);
                }}
              />
            </div>
          )}
          {isShowCompletedForms && (
            <StackedList
              isFullHeight={false}
              className={'flex flex-col gap-2'}
              listItems={notificationsCompleted}
              type={'MenuList'}
            />
          )}
        </div>
      </div>
      <Dialog
        fullScreen={false}
        visible={showCoachVisit}
        position={DialogPosition.Full}
        stretch={true}
      >
        <CoachVisitInfo setSHowCoachVisit={setSHowCoachVisit} />
      </Dialog>
    </BannerWrapper>
  );
};
