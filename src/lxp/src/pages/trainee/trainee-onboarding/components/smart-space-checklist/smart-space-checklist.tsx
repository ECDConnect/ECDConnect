import { useOnlineStatus } from '@/hooks/useOnlineStatus';
import { authSelectors } from '@/store/auth';
import {
  Alert,
  BannerWrapper,
  Button,
  Checkbox,
  Dialog,
  DialogPosition,
  LoadingSpinner,
  MenuListDataItem,
  StackedList,
  Typography,
} from '@ecdlink/ui';
import { format } from 'date-fns';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router';
import { ProgrammeDetails } from './components/programme-details/programme-details';
import {
  CmsQuestionInput,
  CmsVisitDataInputModelInput,
  CmsVisitSectionInput,
  InputMaybe,
  SsChecklistVisitModelInput,
} from '@ecdlink/graphql';
import { newGuid } from '@/utils/common/uuid.utils';
import {
  traineeActions,
  traineeSelectors,
  traineeThunkActions,
} from '@/store/trainee';
import { SectionQuestions } from './components/programme-details/programme-details.types';
import { TraineeService } from '@/services/TraineeService';
import { practitionerSelectors } from '@/store/practitioner';
import { SmartSpaceChecklisstStepsSteps } from './smart-space-checklist.types';
import { HealthSanitationSafety } from './components/health-sanitation-safety/health-sanitation-safety';
import { HealthStructureArea } from './components/safety-structure-area/health-strutcture-area.';
import { SpaceEmergencyPlanning } from './components/space-emergency-planning/space-emergency-planning';
import { useThunkFetchCall } from '@/hooks/useThunkFetchCall';
import { useAppDispatch } from '@/store';

interface SmartSpaceChecklistProps {
  setNotificationStep: any;
}

export const SmartSpaceChecklist: React.FC<SmartSpaceChecklistProps> = ({
  setNotificationStep,
}) => {
  const { isOnline } = useOnlineStatus();
  const appDispatch = useAppDispatch();
  const history = useHistory();
  const date = format(new Date(), 'EEEE, d LLLL');
  const userAuth = useSelector(authSelectors.getAuthUser);
  const [sectionQuestions, setSectionQuestions] =
    useState<SectionQuestions[]>();
  const [visitSection, setVisitSection] = useState('');
  const [showProgrammeDetails, setShowProgrammeDetails] = useState(false);
  const trainee = useSelector(traineeSelectors.getTrainee);
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

  const { isLoading } = useThunkFetchCall('trainee', 'getTraineeVisitData');

  useEffect(() => {
    const getVisitData = async () => {
      await appDispatch(
        traineeThunkActions.getTraineeVisitData({
          visitId: traineeCurrentVisit?.id,
        })
      );
    };

    getVisitData();
  }, []);

  const onSubmit = async () => {
    const sections = sectionQuestions?.map((item) => ({
      ...item,
      questions: item.questions.map((question) => ({
        ...question,
        answer: String(question.answer),
      })),
    })) as InputMaybe<Array<InputMaybe<CmsVisitSectionInput>>>;

    const visitDateInput: CmsVisitDataInputModelInput = {
      visitId: traineeCurrentVisit?.id,
      traineeId: practitioner?.userId,
      visitData: {
        visitName: 'SmartSpace Checklist',
        sections,
      },
    };

    // const visitDateInput: SsChecklistVisitModelInput = {
    //   // visitId:  '',
    //   traineeId: practitioner?.userId,
    //   attended: false,
    //   plannedVisitDate: new Date(),
    //   checklistData: {
    //     traineeId: practitioner?.userId,
    //     visitData: {
    //       visitName: 'SmartSpace Checklist',
    //       sections
    //     }
    //   }
    // };

    // await new TraineeService(userAuth?.auth_token!).addSSChecklistForTrainee(visitDateInput)

    setActiveStep(SmartSpaceChecklisstStepsSteps.INITIAL);

    await new TraineeService(userAuth?.auth_token!).addVisitData(
      visitDateInput
    );
  };

  const steps = (step: SmartSpaceChecklisstStepsSteps) => {
    switch (step) {
      case SmartSpaceChecklisstStepsSteps.PROGRAMME_DETAILS:
        return (
          <ProgrammeDetails
            setSectionQuestions={setSectionQuestions}
            setShowProgrammeDetails={setShowProgrammeDetails}
            setVisitSection={setVisitSection}
            onSubmit={onSubmit}
            setActiveStep={setActiveStep}
          />
        );

      case SmartSpaceChecklisstStepsSteps.HEALTH_SANITATION_SAFETY:
        return (
          <HealthSanitationSafety
            setSectionQuestions={setSectionQuestions}
            setShowProgrammeDetails={setShowProgrammeDetails}
            setVisitSection={setVisitSection}
            onSubmit={onSubmit}
            setActiveStep={setActiveStep}
          />
        );
      case SmartSpaceChecklisstStepsSteps.SAFETY_STRUCTURE_AREA:
        return (
          <HealthStructureArea
            setSectionQuestions={setSectionQuestions}
            setShowProgrammeDetails={setShowProgrammeDetails}
            setVisitSection={setVisitSection}
            onSubmit={onSubmit}
            setActiveStep={setActiveStep}
          />
        );
      case SmartSpaceChecklisstStepsSteps.SPACE_EMERGENCY_PLANNING:
        return (
          <SpaceEmergencyPlanning
            setSectionQuestions={setSectionQuestions}
            setShowProgrammeDetails={setShowProgrammeDetails}
            setVisitSection={setVisitSection}
            onSubmit={onSubmit}
            setActiveStep={setActiveStep}
          />
        );
      default:
        return null;
    }
  };

  const notificationItems: MenuListDataItem[] = [];

  const notificationItemsLaterStage: MenuListDataItem[] = [];

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
  }

  return activeStep !== SmartSpaceChecklisstStepsSteps.INITIAL ? (
    <div className="h-screen">{steps(activeStep)}</div>
  ) : isLoading ? (
    <LoadingSpinner size="big" spinnerColor="white" backgroundColor="uiMid" />
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
          <Alert
            className={'mt-5 mb-3'}
            title="Use this list to check if your venue meets the SmartStart standards."
            list={[
              'As you prepare your venue, you can track your progress here.',
            ]}
            type={'info'}
          />
          <Typography
            className={'my-3'}
            color={'textDark'}
            type={'h2'}
            text={'SmartSpace checklist'}
          />
          <StackedList
            isFullHeight={false}
            className={'flex flex-col gap-2'}
            listItems={notificationItems}
            type={'MenuList'}
          />
          <Typography
            className={'my-3'}
            color={'textDark'}
            type={'h2'}
            text={'You can complete these steps at a later stage'}
          />
          <StackedList
            isFullHeight={false}
            className={'flex flex-col gap-2'}
            listItems={notificationItemsLaterStage}
            type={'MenuList'}
          />
        </div>
      </div>
    </BannerWrapper>
  );
};
