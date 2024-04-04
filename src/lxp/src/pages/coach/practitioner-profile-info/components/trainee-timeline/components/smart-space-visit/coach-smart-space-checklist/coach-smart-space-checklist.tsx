import ROUTES from '@/routes/routes';
import { PractitionerDto, useDialog } from '@ecdlink/core';
import { ActionModal, BannerWrapper, DialogPosition } from '@ecdlink/ui';
import { useHistory, useLocation } from 'react-router';
import { SmartSpaceCheck2 } from './components/smart-space-check-2';
import { useSelector } from 'react-redux';
import {
  traineeActions,
  traineeSelectors,
  traineeThunkActions,
} from '@/store/trainee';
import { useState } from 'react';
import { CoachSmartSpaceChecklistSteps } from './coach-smart-space-checklist.types';
import { SmartSpaceCheck1 } from './components/smart-space-check-1';
import { SmartSpaceCheck3 } from './components/smart-space-check-3';
import { useAppDispatch } from '@/store';
import { SmartSpaceCheck4 } from './components/smart-space-check-4';
import { SmartSpaceCheck5 } from './components/smart-space-check-5';
import { SmartSpaceCheck6 } from './components/smart-space-check-6';
import { SmartSpaceCheck7 } from './components/smart-space-check-7';
import { SmartSpaceCheck8 } from './components/smart-space-check-8';
import { SmartSpaceCheck9 } from './components/smart-space-check-9';
import { SmartSpaceCheck10 } from './components/smart-space-check-10';
import { authSelectors } from '@/store/auth';
import { userSelectors } from '@/store/user';
import { practitionerSelectors } from '@/store/practitioner';
import { coachSelectors } from '@/store/coach';
import {
  SmartSpaceVisit,
  SmartSpaceVisitData,
} from '@/store/trainee/trainee.types';
import { newGuid } from '@/utils/common/uuid.utils';

interface CoachSmartSpaceChecklistProps {
  practitioner: PractitionerDto | undefined;
  setNotificationStep: (item: string) => void;
}

export interface CoachSmartSpaceChecklistRouteState {
  practitioner?: PractitionerDto;
  practitionerUserId?: string;
}

export const CoachSmartSpaceChecklist: React.FC<
  CoachSmartSpaceChecklistProps
> = ({ practitioner: practitionerUser, setNotificationStep }) => {
  const history = useHistory();
  const dialog = useDialog();
  const userAuth = useSelector(authSelectors.getAuthUser);
  const user = useSelector(userSelectors.getUser);
  const appDispatch = useAppDispatch();
  const location = useLocation<CoachSmartSpaceChecklistRouteState>();
  const practitionerUserId = location?.state?.practitionerUserId || '';
  const practitioner =
    ((useSelector(
      practitionerSelectors.getPractitionerByUserId(practitionerUserId)
    ) || location?.state?.practitioner) as PractitionerDto) || practitionerUser;

  const timeline = useSelector(
    traineeSelectors.getTraineeOnboardTimeline(practitioner.userId || '')
  );
  const coachSmartSpaceVisitId = timeline?.sSCoachVisitId;
  const traineeChecklistVisitId = timeline?.traineeVisits?.[0]?.id || '';
  const [visitData, setVisitData] = useState<SmartSpaceVisitData[]>([]);
  const [activeStep, setActiveStep] = useState(
    CoachSmartSpaceChecklistSteps.SMART_SPACE_CHECK
  );
  const programmeName = useSelector(
    traineeSelectors.getTraineeVisitDataProgrammeName(coachSmartSpaceVisitId)
  );
  const coach = useSelector(coachSelectors.getCoach);
  const isCoach = coach?.user?.id === user?.id;

  const saveSmartSpaceCheckData = (
    value: SmartSpaceVisitData[],
    visitSection: string
  ) => {
    if (!isCoach) {
      return;
    }

    const otherSectionData = visitData.filter(
      (item) => item.visitSection !== visitSection
    );

    const newVisitData = [...otherSectionData, ...value];
    setVisitData(newVisitData);

    const visit: SmartSpaceVisit = {
      traineeId: practitioner.userId!,
      visitId: coachSmartSpaceVisitId,
      coachId: user?.id!,
      visitData: newVisitData,
    };

    appDispatch(traineeActions.saveCoachSmartSpaceVisitData(visit));
  };

  const handleNextSection = () => {
    if (activeStep < 11) {
      setActiveStep(activeStep + 1);
      return;
    }

    setActiveStep(CoachSmartSpaceChecklistSteps.SMART_SPACE_CHECK);
  };

  const onSubmit = async () => {
    const syncId = newGuid();
    await appDispatch(
      traineeActions.setCoachSmartSpaceVisitSyncId({
        visitId: coachSmartSpaceVisitId,
        syncId,
      })
    );
    appDispatch(
      traineeThunkActions.submitCoachSmartSpaceVisitData(coachSmartSpaceVisitId)
    );
  };

  const handleBackButton = () => {
    if (activeStep === 1) {
      if (history.location.pathname === ROUTES.TRAINEE.TRAINEE_ONBOARDING) {
        setNotificationStep('');
      } else {
        history.push(ROUTES.COACH.PRACTITIONER_PROFILE_INFO, {
          practitionerId: practitioner?.userId,
        });
      }
    }
    setActiveStep(activeStep - 1);
  };

  const renderStep = (step: number) => {
    switch (step) {
      case 2:
        return (
          <SmartSpaceCheck2
            coachSmartSpaceVisitId={coachSmartSpaceVisitId}
            handleNextSection={handleNextSection}
            saveSmartSpaceCheckData={saveSmartSpaceCheckData}
          />
        );
      case 3:
        return (
          <SmartSpaceCheck3
            practitioner={practitioner}
            coachSmartSpaceVisitId={coachSmartSpaceVisitId}
            handleNextSection={handleNextSection}
            saveSmartSpaceCheckData={saveSmartSpaceCheckData}
            onSubmit={onSubmit}
            setNotificationStep={setNotificationStep}
          />
        );
      case 4:
        return (
          <SmartSpaceCheck4
            coachSmartSpaceVisitId={coachSmartSpaceVisitId}
            traineeChecklistVisitId={traineeChecklistVisitId}
            handleNextSection={handleNextSection}
            saveSmartSpaceCheckData={saveSmartSpaceCheckData}
          />
        );
      case 5:
        return (
          <SmartSpaceCheck5
            coachSmartSpaceVisitId={coachSmartSpaceVisitId}
            traineeChecklistVisitId={traineeChecklistVisitId}
            handleNextSection={handleNextSection}
            saveSmartSpaceCheckData={saveSmartSpaceCheckData}
          />
        );
      case 6:
        return (
          <SmartSpaceCheck6
            coachSmartSpaceVisitId={coachSmartSpaceVisitId}
            traineeChecklistVisitId={traineeChecklistVisitId}
            practitioner={practitioner}
            handleNextSection={handleNextSection}
            saveSmartSpaceCheckData={saveSmartSpaceCheckData}
          />
        );
      case 7:
        return (
          <SmartSpaceCheck7
            practitioner={practitioner}
            coachSmartSpaceVisitId={coachSmartSpaceVisitId}
            handleNextSection={handleNextSection}
            saveSmartSpaceCheckData={saveSmartSpaceCheckData}
          />
        );
      case 8:
        return (
          <SmartSpaceCheck8
            practitioner={practitioner}
            coachSmartSpaceVisitId={coachSmartSpaceVisitId}
            handleNextSection={handleNextSection}
            saveSmartSpaceCheckData={saveSmartSpaceCheckData}
          />
        );
      case 9:
        return (
          <SmartSpaceCheck9
            coachSmartSpaceVisitId={coachSmartSpaceVisitId}
            handleNextSection={handleNextSection}
            saveSmartSpaceCheckData={saveSmartSpaceCheckData}
          />
        );
      case 10:
        return (
          <SmartSpaceCheck10
            coachSmartSpaceVisitId={coachSmartSpaceVisitId}
            practitioner={practitioner}
            handleNextSection={handleNextSection}
            saveSmartSpaceCheckData={saveSmartSpaceCheckData}
            onSubmit={onSubmit}
            setNotificationStep={setNotificationStep}
          />
        );
      default:
        return (
          <SmartSpaceCheck1
            coachSmartSpaceVisitId={coachSmartSpaceVisitId}
            saveSmartSpaceCheckData={saveSmartSpaceCheckData}
            practitioner={practitioner}
            programmeName={programmeName}
            handleNextSection={handleNextSection}
          />
        );
    }
  };

  const onClose = () => {
    history?.push(ROUTES.COACH.PRACTITIONER_PROFILE_INFO, {
      practitionerId: practitioner?.userId,
    });
  };

  const exitPrompt = () => {
    dialog({
      position: DialogPosition.Middle,
      render: (onSubmit, onCancel) => (
        <ActionModal
          icon={'InformationCircleIcon'}
          iconColor="alertMain"
          iconBorderColor="alertBg"
          importantText={`Are you sure you want to exit now?`}
          detailText={'If you exit now you will lose your progress.'}
          actionButtons={[
            {
              text: 'Exit',
              textColour: 'white',
              colour: 'primary',
              type: 'filled',
              onClick: () => {
                onSubmit();
                onClose();
              },
              leadingIcon: 'ArrowLeftIcon',
            },
            {
              text: 'Continue editing',
              textColour: 'primary',
              colour: 'primary',
              type: 'outlined',
              onClick: () => onCancel(),
              leadingIcon: 'PencilIcon',
            },
          ]}
        />
      ),
    });
  };

  return (
    <BannerWrapper
      size="small"
      onBack={() => handleBackButton()}
      color="primary"
      className={'h-full'}
      title={`SmartSpace visit`}
      subTitle={`${activeStep} of 10`}
      onClose={() => {
        // If trainee, just exit, otherwise prompt
        if (history.location.pathname === ROUTES.TRAINEE.TRAINEE_ONBOARDING) {
          setNotificationStep('');
        } else {
          exitPrompt();
        }
      }}
    >
      <div>{renderStep(activeStep)}</div>
    </BannerWrapper>
  );
};
