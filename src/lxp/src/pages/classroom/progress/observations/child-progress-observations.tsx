import { BannerWrapper, Button } from '@ecdlink/ui';
import { useHistory, useLocation } from 'react-router';
import { useMemo, useState } from 'react';
import { ChildProgressObservationsSkills } from './child-progress-observations-skills';
import { useObserveProgressForChild } from '@/hooks/useObserveProgressForChild';
import { ChildProgressObservationsSkillsToWorkOn } from './child-progress-observations-skills-to-work-on';
import ROUTES from '@/routes/routes';
import { ChildProgressObservationsSupportLearning } from './child-progress-observations-support-learning';
import { useOnlineStatus } from '@/hooks/useOnlineStatus';

export type ProgressObservationsState = {
  childId: string;
  step?: 'SkillsToWorkOn' | 'SupportLearning';
  jumpToSkillId?: number;
};

export const ProgressObservations: React.FC = () => {
  const history = useHistory();
  const { isOnline } = useOnlineStatus();

  const { state: routeState } = useLocation<ProgressObservationsState>();

  const {
    child,
    currentReportingPeriod,
    currentAgeGroup,
    currentObservations,
    currentReport,
    replaceSkillText,
    addObservationForSkill,
    addSkillToWorkOn,
    removeSkillToWorkOn,
    updateHowToSupport,
    updateSkillToWorkOn,
    syncChildProgressReports,
  } = useObserveProgressForChild(routeState.childId);

  const ageGroupRequiresSupportLearningSteps = true; // TODO - only for certain age groups

  const totalSkillsSteps = Math.ceil(currentObservations.length / 5);
  const totalSteps =
    totalSkillsSteps + (ageGroupRequiresSupportLearningSteps ? 2 : 0);

  // Jump to the correct step if we are given a skill or step to edit
  const [currentStep, setCurrentStep] = useState<number>(
    routeState.step === 'SkillsToWorkOn'
      ? totalSkillsSteps + 1
      : routeState.step === 'SupportLearning'
      ? totalSkillsSteps + 2
      : !!routeState.jumpToSkillId
      ? Math.ceil(
          currentObservations.findIndex(
            (x) => x.id === routeState.jumpToSkillId
          ) / 5
        )
      : 1
  );

  const negativeSkills =
    currentReport?.skillObservations.filter((x) => x.isNegative) || [];
  const skillsToChoose = negativeSkills.length < 4 ? negativeSkills.length : 4;

  const nextEnabled = useMemo<boolean>(() => {
    // For skills to work on, must choose correct number
    if (currentStep === totalSkillsSteps + 1) {
      return (currentReport?.skillsToWorkOn.length ?? 0) === skillsToChoose;
    }

    // All details filled in for how to support
    if (currentStep === totalSkillsSteps + 2) {
      return currentReport!.skillsToWorkOn.every((x) => x.howToSupport !== '');
    }

    // For skills pages, all in that current page must be answered
    if (currentStep <= totalSkillsSteps) {
      return currentObservations
        .slice((currentStep - 1) * 5, currentStep * 5)
        .every((x) => !!x.value);
    }

    return false;
  }, [currentStep, currentReport]);

  return (
    <BannerWrapper
      size={'small'}
      onBack={() =>
        currentStep === 1 ? history.goBack() : setCurrentStep(currentStep - 1)
      }
      title={`Report ${currentReportingPeriod?.reportNumber}`} // TODO, is this the number for the child, or for the reporting window???
      subTitle={`Step ${currentStep} of ${totalSteps}`}
      renderOverflow
    >
      <div className="flex h-full w-full flex-col px-4 pt-4 pb-4">
        {currentStep <= totalSkillsSteps && (
          <ChildProgressObservationsSkills
            ageGroup={currentAgeGroup!}
            child={child!}
            currentStep={currentStep}
            skills={currentObservations}
            replaceSkillText={replaceSkillText}
            onSetSkillValue={addObservationForSkill}
          />
        )}
        {currentStep === totalSkillsSteps + 1 && (
          <ChildProgressObservationsSkillsToWorkOn
            negativeSkills={negativeSkills}
            skillsToChoose={skillsToChoose}
            child={child!}
            doNotKnowPercentage={currentReport!.unknownPercentage}
            addSkillToWorkOn={addSkillToWorkOn}
            removeSkillToWorkOn={removeSkillToWorkOn}
            skillsToWorkOn={currentReport!.skillsToWorkOn}
            doNotKnowCount={currentReport!.unknownCount}
          />
        )}
        {currentStep === totalSkillsSteps + 2 && (
          <ChildProgressObservationsSupportLearning
            child={child!}
            howToSupport={currentReport?.howToSupport}
            currentAgeGroup={currentAgeGroup!}
            skillsToWorkOn={currentReport!.skillsToWorkOn}
            updateHowToSupport={updateHowToSupport}
            updateSkillToWorkOn={updateSkillToWorkOn}
          />
        )}
        <Button
          onClick={() => {
            if (currentStep === totalSteps) {
              if (isOnline) {
                syncChildProgressReports();
              }
              history.replace(ROUTES.PROGRESS_OBSERVATIONS_LANDING, {
                childId: routeState.childId,
              });
            } else {
              setCurrentStep(currentStep + 1);
            }
          }}
          className="mt-auto mb-4 w-full"
          size="normal"
          color="quatenary"
          type="filled"
          icon={
            currentStep === totalSteps ? 'SaveIcon' : 'ArrowCircleRightIcon'
          }
          text={currentStep === totalSteps ? 'Save' : 'Next'}
          textColor="white"
          disabled={!nextEnabled}
        />
        <Button
          onClick={() => {
            if (isOnline) {
              syncChildProgressReports();
            }
            history.replace(ROUTES.PROGRESS_OBSERVATIONS_LANDING, {
              childId: routeState.childId,
            });
          }}
          className="mb-4 w-full"
          size="normal"
          color="quatenary"
          type="outlined"
          icon="XIcon"
          text="Save & exit"
          textColor="quatenary"
        />
      </div>
    </BannerWrapper>
  );
};
