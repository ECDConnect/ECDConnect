import ROUTES from '@/routes/routes';
import { PractitionerDto, useDialog } from '@ecdlink/core';
import { ActionModal, BannerWrapper, DialogPosition } from '@ecdlink/ui';
import { useHistory, useLocation } from 'react-router';
import { SmartSpaceCheck2 } from './components/smart-space-check-2';
import { useSelector } from 'react-redux';
import { traineeActions, traineeSelectors } from '@/store/trainee';
import { SectionQuestions } from '../../smart-space-checklist/components/programme-details/programme-details.types';
import { useState, useCallback } from 'react';
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
  CmsVisitDataInputModelInput,
} from '@ecdlink/graphql';
import { TraineeService } from '@/services/TraineeService';
import { authSelectors } from '@/store/auth';
import { userSelectors } from '@/store/user';
import { practitionerSelectors } from '@/store/practitioner';
import { coachSelectors } from '@/store/coach';

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
  const practitionerUserId = location?.state?.practitionerUserId;
  const practitioner =
    ((useSelector(
      practitionerSelectors.getPractitionerByUserId(practitionerUserId || '')
    ) || location?.state?.practitioner) as PractitionerDto) || practitionerUser;
  const programmeName = useSelector(
    traineeSelectors.getTraineeVisitDataProgrammeName
  );
  const timeline = useSelector(traineeSelectors.getTraineeOnboardTimeline);
  const [sectionQuestions, setSectionQuestions] =
    useState<SectionQuestions[]>();
  const [activeStep, setActiveStep] = useState(
    CoachSmartSpaceChecklistSteps.SMART_SPACE_CHECK
  );
  const coach = useSelector(coachSelectors.getCoach);
  const isCoach = coach?.user?.id === user?.id;

  const handleSetQuestions = useCallback(
    (value: SectionQuestions[] | undefined) => {
      setSectionQuestions((prevSections) => {
        const updatedQuestions = value?.flatMap((newObj) => {
          const { visitSection: newVisitSection, questions: newQuestions } =
            newObj;
          const oldSection = prevSections?.find(
            (oldObj) => oldObj.visitSection === newVisitSection
          );
          const questionsFromOldSection = oldSection?.questions || [];

          const filteredQuestions = newQuestions.filter(
            (newQuestion) =>
              !questionsFromOldSection.some(
                (oldQuestion) => oldQuestion.question === newQuestion.question
              )
          );

          const otherSections = prevSections?.filter(
            (item) => item.visitSection !== newVisitSection
          );

          const mergedQuestions = filteredQuestions.length
            ? [...questionsFromOldSection, ...newQuestions]
            : [...newQuestions];

          return [
            ...(otherSections?.length ? otherSections : []),
            {
              visitSection: newVisitSection,
              questions: mergedQuestions,
            },
          ];
        }, []);
        return updatedQuestions;
      });
    },
    []
  );

  const handleNextSection = () => {
    if (activeStep < 11) {
      setActiveStep(activeStep + 1);
      return;
    }

    setActiveStep(CoachSmartSpaceChecklistSteps.SMART_SPACE_CHECK);
  };

  const saveSmartSpaceCheckData = () => {
    if (!isCoach) {
      return;
    }
    appDispatch(traineeActions.saveCoachSmartSpaceCheckData(sectionQuestions));
  };

  const onSubmit = async () => {
    const coachVisitId = timeline?.sSCoachVisitId;
    const sections = sectionQuestions?.map((item) => ({
      ...item,
      questions: item.questions.map((question) => ({
        ...question,
        answer: String(question.answer),
      })),
    })) as InputMaybe<Array<InputMaybe<CmsVisitSectionInput>>>;

    const visitDateInput: CmsVisitDataInputModelInput = {
      traineeId: practitioner?.userId,
      visitId: coachVisitId,
      coachId: user?.id!,
      visitData: {
        visitName: 'Coach smartspace check',
        sections,
      },
    };

    await new TraineeService(userAuth?.auth_token!).addCoachVisitData(
      visitDateInput
    );

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
            setSectionQuestions={handleSetQuestions}
            handleNextSection={handleNextSection}
            saveSmartSpaceCheckData={saveSmartSpaceCheckData}
          />
        );
      case 3:
        return (
          <SmartSpaceCheck3
            practitioner={practitioner}
            programmeName={programmeName}
            setSectionQuestions={handleSetQuestions}
            handleNextSection={handleNextSection}
            saveSmartSpaceCheckData={saveSmartSpaceCheckData}
            onSubmit={onSubmit}
          />
        );
      case 4:
        return (
          <SmartSpaceCheck4
            practitioner={practitioner}
            programmeName={programmeName}
            setSectionQuestions={handleSetQuestions}
            handleNextSection={handleNextSection}
            saveSmartSpaceCheckData={saveSmartSpaceCheckData}
          />
        );
      case 5:
        return (
          <SmartSpaceCheck5
            practitioner={practitioner}
            programmeName={programmeName}
            setSectionQuestions={handleSetQuestions}
            handleNextSection={handleNextSection}
            saveSmartSpaceCheckData={saveSmartSpaceCheckData}
          />
        );
      case 6:
        return (
          <SmartSpaceCheck6
            practitioner={practitioner}
            programmeName={programmeName}
            setSectionQuestions={handleSetQuestions}
            handleNextSection={handleNextSection}
            saveSmartSpaceCheckData={saveSmartSpaceCheckData}
          />
        );
      case 7:
        return (
          <SmartSpaceCheck7
            practitioner={practitioner}
            programmeName={programmeName}
            setSectionQuestions={handleSetQuestions}
            handleNextSection={handleNextSection}
            saveSmartSpaceCheckData={saveSmartSpaceCheckData}
          />
        );
      case 8:
        return (
          <SmartSpaceCheck8
            practitioner={practitioner}
            programmeName={programmeName}
            setSectionQuestions={handleSetQuestions}
            handleNextSection={handleNextSection}
            saveSmartSpaceCheckData={saveSmartSpaceCheckData}
          />
        );
      case 9:
        return (
          <SmartSpaceCheck9
            practitioner={practitioner}
            programmeName={programmeName}
            setSectionQuestions={handleSetQuestions}
            handleNextSection={handleNextSection}
            saveSmartSpaceCheckData={saveSmartSpaceCheckData}
          />
        );
      case 10:
        return (
          <SmartSpaceCheck10
            practitioner={practitioner}
            programmeName={programmeName}
            setSectionQuestions={handleSetQuestions}
            handleNextSection={handleNextSection}
            saveSmartSpaceCheckData={saveSmartSpaceCheckData}
            onSubmit={onSubmit}
            setNotificationStep={setNotificationStep}
          />
        );
      default:
        return (
          <SmartSpaceCheck1
            saveSmartSpaceCheckData={saveSmartSpaceCheckData}
            practitioner={practitioner}
            programmeName={programmeName}
            setSectionQuestions={handleSetQuestions}
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
                traineeActions?.resetCoachSmartSpaceVisitData();
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
