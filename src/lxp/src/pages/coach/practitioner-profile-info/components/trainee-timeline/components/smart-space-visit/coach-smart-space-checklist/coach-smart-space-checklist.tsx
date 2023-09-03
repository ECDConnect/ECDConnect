import ROUTES from '@/routes/routes';
import { PractitionerDto, useDialog } from '@ecdlink/core';
import { ActionModal, BannerWrapper, DialogPosition } from '@ecdlink/ui';
import { useHistory, useLocation } from 'react-router';
import { SmartSpaceCheck2 } from './components/smart-space-check-2';
import { useSelector } from 'react-redux';
import { traineeActions, traineeSelectors } from '@/store/trainee';
import { SectionQuestions } from '../../smart-space-checklist/components/programme-details/programme-details.types';
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
import {
  CmsVisitSectionInput,
  InputMaybe,
  SsChecklistVisitModelInput,
  VisitModelInput,
} from '@ecdlink/graphql';
import { TraineeService } from '@/services/TraineeService';
import { authSelectors } from '@/store/auth';
import { userSelectors } from '@/store/user';
import { practitionerSelectors } from '@/store/practitioner';

interface CoachSmartSpaceChecklistProps {
  practitioner: PractitionerDto | undefined;
}

export interface CoachSmartSpaceChecklistRouteState {
  practitioner?: PractitionerDto;
  practitionerUserId?: string;
}

export const CoachSmartSpaceChecklist: React.FC<
  CoachSmartSpaceChecklistProps
> = () => {
  const history = useHistory();
  const dialog = useDialog();
  const userAuth = useSelector(authSelectors.getAuthUser);
  const user = useSelector(userSelectors.getUser);
  const appDispatch = useAppDispatch();
  const location = useLocation<CoachSmartSpaceChecklistRouteState>();
  const practitionerUserId = location.state.practitionerUserId;
  const practitioner = (useSelector(
    practitionerSelectors.getPractitionerByUserId(practitionerUserId || '')
  ) || location.state.practitioner) as PractitionerDto;
  const programmeName = useSelector(
    traineeSelectors.getTraineeVisitDataProgrammeName
  );
  const [sectionQuestions, setSectionQuestions] =
    useState<SectionQuestions[]>();
  const [activeStep, setActiveStep] = useState(
    CoachSmartSpaceChecklistSteps.SMART_SPACE_CHECK
  );

  const handleNextSection = () => {
    if (activeStep < 11) {
      setActiveStep(activeStep + 1);
      return;
    }

    setActiveStep(CoachSmartSpaceChecklistSteps.SMART_SPACE_CHECK);
  };

  const saveSmartSpaceCheckData = () => {
    appDispatch(traineeActions.saveCoachSmartSpaceCheckData(sectionQuestions));
  };

  const onSubmit = async () => {
    const sections = sectionQuestions?.map((item) => ({
      ...item,
      questions: item.questions.map((question) => ({
        ...question,
        answer: String(question.answer),
      })),
    })) as InputMaybe<Array<InputMaybe<CmsVisitSectionInput>>>;

    const visitDateInput: SsChecklistVisitModelInput = {
      traineeId: practitioner?.userId,
      coachId: user?.id!,
      plannedVisitDate: new Date(),
      attended: true,
      checklistData: {
        traineeId: practitioner?.userId,
        coachId: user?.id!,
        visitData: {
          visitName: 'SmartSpace Checklist',
          sections,
        },
      },
    };

    await new TraineeService(
      userAuth?.auth_token!
    ).addCoachVisitInviteForTrainee(visitDateInput);

    return;
  };

  const handleBackButton = () => {
    if (activeStep === 1) {
      history.push(ROUTES.COACH.PRACTITIONER_PROFILE_INFO, {
        practitionerId: practitioner?.userId,
      });
    }
    setActiveStep(activeStep - 1);
  };

  const renderStep = (step: number) => {
    switch (step) {
      case 2:
        return (
          <SmartSpaceCheck2
            practitioner={practitioner}
            programmeName={programmeName}
            setSectionQuestions={setSectionQuestions}
            handleNextSection={handleNextSection}
            saveSmartSpaceCheckData={saveSmartSpaceCheckData}
          />
        );
      case 3:
        return (
          <SmartSpaceCheck3
            practitioner={practitioner}
            programmeName={programmeName}
            setSectionQuestions={setSectionQuestions}
            handleNextSection={handleNextSection}
            saveSmartSpaceCheckData={saveSmartSpaceCheckData}
          />
        );
      case 4:
        return (
          <SmartSpaceCheck4
            practitioner={practitioner}
            programmeName={programmeName}
            setSectionQuestions={setSectionQuestions}
            handleNextSection={handleNextSection}
            saveSmartSpaceCheckData={saveSmartSpaceCheckData}
          />
        );
      case 5:
        return (
          <SmartSpaceCheck5
            practitioner={practitioner}
            programmeName={programmeName}
            setSectionQuestions={setSectionQuestions}
            handleNextSection={handleNextSection}
            saveSmartSpaceCheckData={saveSmartSpaceCheckData}
          />
        );
      case 6:
        return (
          <SmartSpaceCheck6
            practitioner={practitioner}
            programmeName={programmeName}
            setSectionQuestions={setSectionQuestions}
            handleNextSection={handleNextSection}
            saveSmartSpaceCheckData={saveSmartSpaceCheckData}
          />
        );
      case 7:
        return (
          <SmartSpaceCheck7
            practitioner={practitioner}
            programmeName={programmeName}
            setSectionQuestions={setSectionQuestions}
            handleNextSection={handleNextSection}
            saveSmartSpaceCheckData={saveSmartSpaceCheckData}
          />
        );
      case 8:
        return (
          <SmartSpaceCheck8
            practitioner={practitioner}
            programmeName={programmeName}
            setSectionQuestions={setSectionQuestions}
            handleNextSection={handleNextSection}
            saveSmartSpaceCheckData={saveSmartSpaceCheckData}
          />
        );
      case 9:
        return (
          <SmartSpaceCheck9
            practitioner={practitioner}
            programmeName={programmeName}
            setSectionQuestions={setSectionQuestions}
            handleNextSection={handleNextSection}
            saveSmartSpaceCheckData={saveSmartSpaceCheckData}
          />
        );
      case 10:
        return (
          <SmartSpaceCheck10
            practitioner={practitioner}
            programmeName={programmeName}
            setSectionQuestions={setSectionQuestions}
            handleNextSection={handleNextSection}
            saveSmartSpaceCheckData={saveSmartSpaceCheckData}
            onSubmit={onSubmit}
          />
        );
      default:
        return (
          <SmartSpaceCheck1
            saveSmartSpaceCheckData={saveSmartSpaceCheckData}
            practitioner={practitioner}
            programmeName={programmeName}
            setSectionQuestions={setSectionQuestions}
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
      onClose={() => exitPrompt()}
    >
      <div>{renderStep(activeStep)}</div>
    </BannerWrapper>
  );
};
