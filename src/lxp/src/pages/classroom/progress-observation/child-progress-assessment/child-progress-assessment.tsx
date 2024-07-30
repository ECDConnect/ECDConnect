import { ProgressTrackingSkillDto, useStepNavigation } from '@ecdlink/core';
import { BannerWrapper } from '@ecdlink/ui';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useHistory, useLocation } from 'react-router-dom';
import { ProgressTrackingLevels } from '@enums/ProgressTrackingLevels';
import { useChildProgressObservation } from '@hooks/useChildProgressObservations';
import { childrenSelectors } from '@store/children';
import { progressTrackingSelectors } from '@store/progress-tracking';
import { CategoryLevelForm } from './category-level-form/category-level-form';
import { ChildDevelopmentLevelForm } from './child-development-level-form/child-development-level-form';
import { ChildDevelopmentLevelFormModel } from '@schemas/classroom/child-progress-observations/child-development-level-form';
import { ChildLearningSupportForm } from './child-learning-support-form/child-learning-support-form';
import { ChildLearningSupportFormModel } from '@schemas/classroom/child-progress-observations/child-learning-support-form';
import { ChildUndevelopedSkillForm } from './child-undeveloped-skill-form/child-undeveloped-skill-form';
import {
  ChildProgressAssessmentRouteState,
  ChildProgressAssessmentSteps,
} from './child-progress-assessment.types';
import { CategoryLevelFormResult } from '@models/classroom/progress-observation/ChildProgressAssessment';
import { useOnlineStatus } from '@hooks/useOnlineStatus';
import { getCategoryFromCurrentReport } from '@utils/child/child-progress-report.utils';
import { contentReportSelectors } from '@store/content/report';
import { analyticsActions } from '@store/analytics';
import { useAppDispatch } from '@store';

export const ChildProgressAssessment: React.FC = () => {
  const { isOnline } = useOnlineStatus();
  const history = useHistory();
  const appDispatch = useAppDispatch();
  const location = useLocation<ChildProgressAssessmentRouteState>();
  const routeStep = location.state.step;
  const childId = location.state.childId;
  const returnToOverview = location.state.returnToOverview;
  const progressTrackingCategoryId = location.state.progressTrackingCategoryId;
  const firstObservation = location.state.firstObservation;
  const currentChild = useSelector(childrenSelectors.getChildById(childId));
  const category = useSelector(
    progressTrackingSelectors.getProgressTrackingCategoryById(
      location.state.progressTrackingCategoryId
    )
  );

  useEffect(() => {
    if (!isOnline) {
      appDispatch(
        analyticsActions.createViewTracking({
          pageView: window.location.pathname,
          title: 'Progress Observation Report',
        })
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOnline]);

  const reportingDate = location.state.reportingDate
    ? new Date(location.state.reportingDate)
    : new Date();

  const report = useSelector(
    contentReportSelectors.getChildProgressObservationReportByReportingPeriod(
      reportingDate,
      childId
    )
  );

  const {
    currentReport,
    setCurrentCategoryById,
    submitLevelSkills,
    getChildAchievedLevelId,
    getSkills,
    getHelpingWithTask,
    getHelpingWithTaskText,
    setCategoryAchievedLevel,
    completeCurrentCategoryTracking,
    setHelpingWithTask,
    setHelpingWithTaskText,
    clearHelpingWithTaskId,
    isAllSkillsYes,
  } = useChildProgressObservation(childId, report);

  const [childDevelopmentLevelForm, setChildDevelopmentLevelForm] =
    useState<ChildDevelopmentLevelFormModel>();

  const { goToStep, canGoBack, goBackOneStep, activeStepKey } =
    useStepNavigation(
      routeStep || ChildProgressAssessmentSteps.assessmentStepOne
    );

  useEffect(() => {
    if (currentReport) {
      setCurrentCategoryById(progressTrackingCategoryId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentReport]);

  const saveChildDevelopmentLevelForm = (
    form: ChildDevelopmentLevelFormModel,
    exit: boolean
  ) => {
    setCategoryAchievedLevel(form.levelId);
    if (exit) {
      exitAssessment(true);
    } else {
      goToStep(ChildProgressAssessmentSteps.assessmentStepFive);
    }
  };

  const returnToReportOverview = () => {
    history.replace(
      `/child-progress-observation-report?step=${ChildProgressAssessmentSteps.assessmentStepFour}`,
      {
        childId: childId,
        reportingDate: reportingDate.toISOString(),
        firstObservation,
      }
    );
  };

  const returnToReportDashboard = (nextCategory: boolean) => {
    history.replace('/child-progress-observation', {
      childId: childId,
      reportingDate: reportingDate.toISOString(),
      firstObservation,
      nextCategory,
    });
  };

  const exitAssessment = (save: boolean) => {
    // if (save &&!!report) {
    //   saveReportLocally(report, currentChildLearner?.classroomGroupId || '');
    // }
    if (returnToOverview) {
      returnToReportOverview();
      return;
    }

    returnToReportDashboard(false);
  };

  const saveChildLearningSupportForm = (
    form: ChildLearningSupportFormModel,
    exit: boolean
  ) => {
    setHelpingWithTaskText(form.learningSupport || '');
    if (exit) {
      exitAssessment(true);
    } else {
      completeCurrentCategoryTracking();
      if (returnToOverview) {
        returnToReportOverview();
      } else {
        returnToReportDashboard(true);
      }
    }
  };

  const childProgressAssessmentSteps = (step: ChildProgressAssessmentSteps) => {
    switch (step) {
      case ChildProgressAssessmentSteps.assessmentStepTwo:
        return (
          <CategoryLevelForm
            progressTrackingCategoryId={category?.id || 1}
            levelId={ProgressTrackingLevels.LevelTwo}
            level={2}
            childId={currentChild?.id || ''}
            optionSelected={() => {}}
            onSubmit={(result: CategoryLevelFormResult, exit: boolean) => {
              submitLevelSkills(
                ProgressTrackingLevels.LevelTwo,
                result.selectedSkills,
                result.missedSkills
              );
              if (exit) {
                exitAssessment(true);
              } else {
                goToStep(ChildProgressAssessmentSteps.assessmentStepThree);
              }
            }}
          />
        );
      case ChildProgressAssessmentSteps.assessmentStepThree:
        return (
          <CategoryLevelForm
            progressTrackingCategoryId={category?.id || 1}
            levelId={ProgressTrackingLevels.LevelThree}
            level={3}
            optionSelected={() => {}}
            childId={currentChild?.id || ''}
            onSubmit={(result: CategoryLevelFormResult, exit: boolean) => {
              const achievedLevelId = submitLevelSkills(
                ProgressTrackingLevels.LevelThree,
                result.selectedSkills,
                result.missedSkills
              );
              if (exit) {
                exitAssessment(true);
              } else {
                setChildDevelopmentLevelForm({ levelId: achievedLevelId });
                goToStep(ChildProgressAssessmentSteps.assessmentStepFour);
              }
            }}
          />
        );
      case ChildProgressAssessmentSteps.assessmentStepFour:
        return (
          <ChildDevelopmentLevelForm
            childDevelopmentLevelForm={childDevelopmentLevelForm}
            childId={currentChild?.id || ''}
            childAchievedLevelId={getChildAchievedLevelId()}
            onSubmit={(form: ChildDevelopmentLevelFormModel, exit: boolean) => {
              saveChildDevelopmentLevelForm(form, exit);
            }}
          />
        );
      case ChildProgressAssessmentSteps.assessmentStepFive:
        return (
          <ChildUndevelopedSkillForm
            skills={getSkills()}
            allSkillsYes={isAllSkillsYes()}
            supportSkillId={getHelpingWithTask()}
            childId={currentChild?.id}
            onSubmit={(
              skill: ProgressTrackingSkillDto | undefined,
              skipStepSix: boolean,
              exit: boolean
            ) => {
              if (skill) {
                setHelpingWithTask(skill);
              } else {
                setHelpingWithTask(undefined);
              }
              if (exit) {
                exitAssessment(true);
              } else {
                if (!skipStepSix) {
                  goToStep(ChildProgressAssessmentSteps.assessmentStepSix);
                } else {
                  clearHelpingWithTaskId();
                  completeCurrentCategoryTracking();
                  if (returnToOverview) {
                    returnToReportOverview();
                  } else {
                    returnToReportDashboard(true);
                  }
                }
              }
            }}
          />
        );
      case ChildProgressAssessmentSteps.assessmentStepSix: {
        const currentCategoryDetails = getCategoryFromCurrentReport(
          progressTrackingCategoryId,
          currentReport
        );
        return (
          <ChildLearningSupportForm
            childLearningSupportForm={{
              learningSupport: getHelpingWithTaskText(),
            }}
            childId={currentChild?.id as string}
            helpingWithSkillId={
              currentCategoryDetails?.supportingTask?.taskId || 0
            }
            onSubmit={(form: ChildLearningSupportFormModel, exit: boolean) => {
              saveChildLearningSupportForm(form, exit);
            }}
          />
        );
      }
      case ChildProgressAssessmentSteps.assessmentStepOne:
      default:
        return (
          <CategoryLevelForm
            progressTrackingCategoryId={category?.id || 1}
            levelId={ProgressTrackingLevels.LevelOne}
            level={1}
            childId={currentChild?.id || ''}
            onSubmit={(result: CategoryLevelFormResult, exit: boolean) => {
              submitLevelSkills(
                ProgressTrackingLevels.LevelOne,
                result.selectedSkills,
                result.missedSkills
              );
              if (exit) {
                exitAssessment(true);
              } else {
                goToStep(ChildProgressAssessmentSteps.assessmentStepTwo);
              }
            }}
          />
        );
    }
  };

  return (
    <>
      <BannerWrapper
        size={'normal'}
        renderBorder={true}
        title={category?.name}
        subTitle={`step ${activeStepKey} of 6`}
        onBack={() => {
          if (canGoBack()) goBackOneStep();
          else {
            exitAssessment(false);
          }
        }}
        renderOverflow
        backgroundColour={'white'}
        onClose={() => exitAssessment(false)}
        displayOffline={!isOnline}
      >
        {childProgressAssessmentSteps(activeStepKey)}
      </BannerWrapper>
    </>
  );
};
