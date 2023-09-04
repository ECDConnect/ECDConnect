import ROUTES from '@/routes/routes';
import { PractitionerDto } from '@ecdlink/core';
import { BannerWrapper } from '@ecdlink/ui';
import { useHistory, useLocation } from 'react-router';
import { useSelector } from 'react-redux';
import { traineeActions, traineeSelectors } from '@/store/trainee';
import { SectionQuestions } from '../../smart-space-checklist/components/programme-details/programme-details.types';
import { useState } from 'react';
import { CoachSmartSpaceChecklistSteps } from './trainee-franchisor-agreement.types';
import { useAppDispatch } from '@/store';
import { CoachTraineeFranchisorAgreement1 } from './components/coach-franchisor-agreement';
import { TraineeService } from '@/services/TraineeService';
import { authSelectors } from '@/store/auth';
import {
  CmsVisitSectionInput,
  InputMaybe,
  SsChecklistVisitModelInput,
} from '@ecdlink/graphql';
import { userSelectors } from '@/store/user';

interface CoachSmartSpaceChecklistProps {
  practitioner: PractitionerDto | undefined;
}

export interface CoachSmartSpaceChecklistRouteState {
  practitioner: PractitionerDto;
}

export const CoachTraineeFranchisorAgreement: React.FC<
  CoachSmartSpaceChecklistProps
> = () => {
  const history = useHistory();
  const userAuth = useSelector(authSelectors.getAuthUser);
  const user = useSelector(userSelectors.getUser);
  const appDispatch = useAppDispatch();
  const location = useLocation<CoachSmartSpaceChecklistRouteState>();
  const practitioner = location.state.practitioner;
  const coachSmartSpaceVisit2DataNotAttendedStandards = useSelector(
    traineeSelectors.getCoachSmartSpaceVisit2DataNotAttendedStandards
  );

  const [sectionQuestions, setSectionQuestions] =
    useState<SectionQuestions[]>();
  const [activeStep, setActiveStep] = useState(
    CoachSmartSpaceChecklistSteps.SMART_SPACE_CHECK
  );

  const saveFranchisorAgreementData = () => {
    appDispatch(
      traineeActions.saveCoachFranchisorAgreementData(sectionQuestions)
    );

    history.push(ROUTES.COACH_SELF_ASSESSMENT, { practitioner: practitioner });
  };

  const handleBackButton = () => {
    if (activeStep === 1) {
      history.push(ROUTES.COACH.PRACTITIONER_PROFILE_INFO, {
        practitionerId: practitioner?.userId,
      });
    }
    setActiveStep(activeStep - 1);
  };

  const submitCoachFranchisorAgreement = async () => {
    const sections = sectionQuestions?.map((item, index) => ({
      ...item,
      questions: item.questions.map((question) => ({
        ...question,
        answer: String(question.answer),
      })),
    })) as InputMaybe<Array<InputMaybe<CmsVisitSectionInput>>>;

    const visitDateInput: SsChecklistVisitModelInput = {
      traineeId: practitioner?.userId,
      coachId: user?.id,
      attended: true,
      checklistData: {
        traineeId: practitioner?.userId,
        visitData: {
          visitName: 'Coach smartspace check',
          sections,
        },
      },
    };

    await new TraineeService(
      userAuth?.auth_token!
    ).AddCoachFranchiseeAgreementForTrainee(visitDateInput);
  };

  const renderStep = (step: number) => {
    switch (step) {
      default:
        return (
          <CoachTraineeFranchisorAgreement1
            saveFranchisorAgreementData={saveFranchisorAgreementData}
            practitioner={practitioner}
            setSectionQuestions={setSectionQuestions}
            submitCoachFranchisorAgreement={submitCoachFranchisorAgreement}
            coachSmartSpaceVisit2DataNotAttendedStandards={
              coachSmartSpaceVisit2DataNotAttendedStandards
            }
          />
        );
    }
  };

  return (
    <BannerWrapper
      size="small"
      onBack={() => handleBackButton()}
      color="primary"
      className={'h-full'}
      title={`Franchisee agreement`}
      subTitle={`${practitioner?.user?.fullName}`}
    >
      <div>{renderStep(activeStep)}</div>
    </BannerWrapper>
  );
};
