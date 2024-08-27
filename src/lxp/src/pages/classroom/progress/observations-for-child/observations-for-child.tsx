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
    detailedObservations,
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

  const totalSkillsSteps = Math.ceil(
    (detailedObservations?.skillObservations?.length || 0) / 5
  );
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
          detailedObservations?.skillObservations?.findIndex(
            (x) => x.skillId === routeState.jumpToSkillId
          ) || 1 / 5
        )
      : 1
  );

  const negativeSkills =
    detailedObservations?.skillObservations.filter((x) => x.isNegative) || [];

  const skillsToChoose = negativeSkills.length < 4 ? negativeSkills.length : 4;

  const nextEnabled = useMemo<boolean>(() => {
    // For skills to work on, must choose correct number
    if (currentStep === totalSkillsSteps + 1) {
      return (
        (detailedObservations?.skillsToWorkOn.length ?? 0) === skillsToChoose
      );
    }

    // All details filled in for how to support
    if (currentStep === totalSkillsSteps + 2) {
      return detailedObservations!.skillsToWorkOn.every(
        (x) => x.howToSupport !== ''
      );
    }

    // For skills pages, all in that current page must be answered
    if (currentStep <= totalSkillsSteps) {
      return detailedObservations!.skillObservations
        .slice((currentStep - 1) * 5, currentStep * 5)
        .every((x) => !!x.value);
    }

    return false;
  }, [currentStep, detailedObservations]);

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
            doNotKnowPercentage={detailedObservations!.unknownPercentage}
            addSkillToWorkOn={addSkillToWorkOn}
            removeSkillToWorkOn={removeSkillToWorkOn}
            skillsToWorkOn={detailedObservations!.skillsToWorkOn}
            doNotKnowCount={detailedObservations!.unknownCount}
          />
        )}
        {currentStep === totalSkillsSteps + 2 && (
          <ObservationsForChildSupportLearning
            child={child!}
            howToSupport={detailedObservations?.howToSupport}
            currentAgeGroup={observationsAgeGroup!}
            skillsToWorkOn={detailedObservations!.skillsToWorkOn}
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
