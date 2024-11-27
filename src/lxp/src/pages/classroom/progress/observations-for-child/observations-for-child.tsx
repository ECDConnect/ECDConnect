import { BannerWrapper, Button } from '@ecdlink/ui';
import React from 'react';
import { useHistory, useLocation } from 'react-router';
import { useMemo, useRef, useState } from 'react';
import { ObservationsForChildSkills } from './observations-for-child-skills';
import { useObserveProgressForChild } from '@/hooks/useObserveProgressForChild';
import { ObservationsForChildSkillsToWorkOn } from './observations-for-child-skills-to-work-on';
import ROUTES from '@/routes/routes';
import { ObservationsForChildSupportLearning } from './observations-for-child-support-learning';
import { useOnlineStatus } from '@/hooks/useOnlineStatus';
import ProgressWalkthroughWrapper from '../walkthrough/progress-walkthrough-wrapper';
import { useProgressWalkthrough } from '@/hooks/useProgressWalkthrough';
import { useAppContext } from '@/walkthrougContext';

export type ObservationsForChildState = {
  childId: string;
  step?: 'SkillsToWorkOn' | 'SupportLearning';
  jumpToSkillId?: number;
};

export const ObservationsForChild: React.FC = () => {
  const history = useHistory();
  const { isOnline } = useOnlineStatus();
  const {
    setState,
    state: { run: isWalkthrough, stepIndex },
  } = useAppContext();

  const wrapperRef = useRef<HTMLDivElement | null>(null);

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

  const {
    ageGroup,
    walkthroughObservations,
    walkthroughReplaceSkillText,
    walkthroughReport,
  } = useProgressWalkthrough();

  const report = isWalkthrough ? walkthroughReport : currentReport;
  const observations = isWalkthrough
    ? walkthroughObservations
    : currentObservations;

  const ageGroupRequiresSupportLearningSteps = true; // TODO - only for certain age groups

  const totalSkillsSteps = Math.ceil((observations.length || 0) / 5);
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
          observations.findIndex((x) => x.id === routeState.jumpToSkillId) /
            5 || 1 / 5
        )
      : 1
  );

  const negativeSkills =
    report?.skillObservations.filter(
      (x) =>
        x.value !== "Don't know" &&
        ((!x.isReverseScored && (x.isNegative || !x?.isPositive)) ||
          (x.isReverseScored && x.isNegative))
    ) || [];

  const skillsToChoose = negativeSkills.length < 4 ? negativeSkills.length : 4;

  const showNextButton = useMemo<boolean>(() => {
    if (currentStep === totalSkillsSteps + 1 && report) {
      return report?.unknownPercentage < 25;
    }
    return true;
  }, [currentStep, report, totalSkillsSteps]);

  const nextEnabled = useMemo<boolean>(() => {
    // For skills to work on, must choose correct number
    if (currentStep === totalSkillsSteps + 1) {
      return (
        report?.skillsToWorkOn.length === skillsToChoose &&
        report?.unknownPercentage < 25
      );
    }

    // All details filled in for how to support
    if (currentStep === totalSkillsSteps + 2) {
      return (
        (!!report!.skillsToWorkOn.length &&
          report!.skillsToWorkOn.every((x) => x.howToSupport !== '')) ||
        !!report!.howToSupport
      );
    }

    // For skills pages, all in that current page must be answered
    if (currentStep <= totalSkillsSteps) {
      return observations
        .slice((currentStep - 1) * 5, currentStep * 5)
        .every((x) => !!x.value);
    }

    return false;
  }, [currentStep, totalSkillsSteps, report, skillsToChoose, observations]);

  return (
    <BannerWrapper
      contentRef={wrapperRef}
      size={'small'}
      onBack={() =>
        currentStep === 1 ? history.goBack() : setCurrentStep(currentStep - 1)
      }
      title={`Report ${currentObservationPeriod?.reportNumber}`}
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
        <ProgressWalkthroughWrapper />
        {currentStep <= totalSkillsSteps && (
          <ObservationsForChildSkills
            ageGroup={isWalkthrough ? ageGroup : observationsAgeGroup!}
            childFirstName={isWalkthrough ? 'Temba' : child!.user!.firstName!}
            currentStep={currentStep}
            skills={
              isWalkthrough ? walkthroughObservations : currentObservations
            }
            replaceSkillText={
              isWalkthrough ? walkthroughReplaceSkillText : replaceSkillText
            }
            onSetSkillValue={
              isWalkthrough
                ? () => {
                    setState({ stepIndex: stepIndex + 1 });
                  }
                : addObservationForSkill
            }
          />
        )}
        {currentStep === totalSkillsSteps + 1 && (
          <ObservationsForChildSkillsToWorkOn
            negativeSkills={negativeSkills}
            skillsToChoose={skillsToChoose}
            child={child!}
            doNotKnowPercentage={report?.unknownPercentage || 0}
            addSkillToWorkOn={addSkillToWorkOn}
            removeSkillToWorkOn={removeSkillToWorkOn}
            skillsToWorkOn={report?.skillsToWorkOn || []}
            doNotKnowCount={report?.unknownCount || 0}
          />
        )}
        {currentStep === totalSkillsSteps + 2 && (
          <ObservationsForChildSupportLearning
            child={child!}
            howToSupport={report?.howToSupport}
            currentAgeGroup={observationsAgeGroup!}
            skillsToWorkOn={report?.skillsToWorkOn || []}
            updateHowToSupport={updateHowToSupport}
            updateSkillToWorkOn={updateSkillToWorkOn}
          />
        )}

        {showNextButton ? (
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
                if (wrapperRef.current) {
                  // SCroll div to top
                  wrapperRef.current.scrollTop = 0;
                }
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
        ) : (
          <div className="mt-auto mb-4 w-full"></div>
        )}

        <Button
          id="saveAndExitButton"
          onClick={() => {
            if (isWalkthrough) {
              setState({ stepIndex: 9 });
              history.replace(ROUTES.PROGRESS_REPORT_LIST, {
                childId: routeState.childId,
              });
            } else {
              if (isOnline && !isWalkthrough) {
                syncChildProgressReports();
              }
              history.replace(ROUTES.PROGRESS_OBSERVATIONS_LANDING, {
                childId: routeState.childId,
              });
            }
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
