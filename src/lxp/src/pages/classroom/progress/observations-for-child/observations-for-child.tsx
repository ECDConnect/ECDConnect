import { BannerWrapper, Button } from '@ecdlink/ui';
import { useHistory, useLocation } from 'react-router';
import { useEffect, useMemo, useRef, useState } from 'react';
import { ObservationsForChildSkills } from './observations-for-child-skills';
import { useObserveProgressForChild } from '@/hooks/useObserveProgressForChild';
import { ObservationsForChildSkillsToWorkOn } from './observations-for-child-skills-to-work-on';
import ROUTES from '@/routes/routes';
import { ObservationsForChildSupportLearning } from './observations-for-child-support-learning';
import { useOnlineStatus } from '@/hooks/useOnlineStatus';

export type ObservationsForChildState = {
  childId: string;
  step?: 'SkillsToWorkOn' | 'SupportLearning';
  jumpToSkillId?: number;
};

export const ObservationsForChild: React.FC = () => {
  const history = useHistory();
  const { isOnline } = useOnlineStatus();

  const { state: routeState } = useLocation<ObservationsForChildState>();

  const {
    child,
    currentObservationPeriod,
    observationsAgeGroup,
    currentReport,
    currentObservations,
    replaceSkillText,
    addObservationForSkill,
    addSkillToWorkOn,
    removeSkillToWorkOn,
    updateHowToSupport,
    updateSkillToWorkOn,
    syncChildProgressReports,
  } = useObserveProgressForChild(routeState.childId);

  const ageGroupRequiresSupportLearningSteps = true; // TODO - only for certain age groups

  const totalSkillsSteps = Math.ceil((currentObservations.length || 0) / 5);
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
          ) || 1 / 5
        )
      : 1
  );

  const negativeSkills =
    currentReport?.skillObservations.filter((x) => x.isNegative) || [];

  const skillsToChoose = negativeSkills.length < 4 ? negativeSkills.length : 4;

  const nextEnabled = useMemo<boolean>(() => {
    // For skills to work on, must choose correct number
    if (currentStep === totalSkillsSteps + 1) {
      return currentReport!.skillsToWorkOn.length === skillsToChoose;
    }

    // All details filled in for how to support
    if (currentStep === totalSkillsSteps + 2) {
      return currentReport!.skillsToWorkOn.every((x) => x.howToSupport !== '');
    }

    // For skills pages, all in that current page must be answered
    if (currentStep <= totalSkillsSteps) {
      return (currentReport?.skillObservations || [])
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
      title={`Report ${currentObservationPeriod?.reportNumber}`} // TODO, is this the number for the child, or for the reporting window???
      subTitle={`Step ${currentStep} of ${totalSteps}`}
      renderOverflow
      onClose={() => {
        if (isOnline) {
          syncChildProgressReports();
        }
        history.replace(ROUTES.PROGRESS_OBSERVATIONS_LANDING, {
          childId: routeState.childId,
        });
      }}
    >
      <div className="flex h-full w-full flex-col px-4 pt-4 pb-4">
        {currentStep <= totalSkillsSteps && (
          <ObservationsForChildSkills
            ageGroup={observationsAgeGroup!}
            child={child!}
            currentStep={currentStep}
            skills={currentObservations}
            replaceSkillText={replaceSkillText}
            onSetSkillValue={addObservationForSkill}
          />
        )}
        {currentStep === totalSkillsSteps + 1 && (
          <ObservationsForChildSkillsToWorkOn
            negativeSkills={negativeSkills}
            skillsToChoose={skillsToChoose}
            child={child!}
            doNotKnowPercentage={currentReport?.unknownPercentage || 0}
            addSkillToWorkOn={addSkillToWorkOn}
            removeSkillToWorkOn={removeSkillToWorkOn}
            skillsToWorkOn={currentReport?.skillsToWorkOn || []}
            doNotKnowCount={currentReport?.unknownCount || 0}
          />
        )}
        {currentStep === totalSkillsSteps + 2 && (
          <ObservationsForChildSupportLearning
            child={child!}
            howToSupport={currentReport?.howToSupport}
            currentAgeGroup={observationsAgeGroup!}
            skillsToWorkOn={currentReport?.skillsToWorkOn || []}
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
