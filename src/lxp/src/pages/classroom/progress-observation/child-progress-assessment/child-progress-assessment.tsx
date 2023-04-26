import {
  LocalStorageKeys,
  ProgressTrackingSkillDto,
  useStepNavigation,
} from '@ecdlink/core';
import { BannerWrapper, Dialog, DialogPosition } from '@ecdlink/ui';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useHistory, useLocation } from 'react-router-dom';
import { ProgressTrackingAlertLevelOnePrompt } from '../components/progress-tracking-prompts/progress-tracking-alert-level-one-prompt/progress-tracking-alert-level-one-prompt';
import { ProgressTrackingAlertLevelTwoPrompt } from '../components/progress-tracking-prompts/progress-tracking-alert-level-two-prompt/progress-tracking-alert-level-two-prompt';
import { ProgressTrackingInformationPrompt } from '../components/progress-tracking-prompts/progress-tracking-information-prompt/progress-tracking-information-prompt';
import { ProgressTrackingLevels } from '@enums/ProgressTrackingLevels';
import { useChildProgressObservation } from '@hooks/useChildProgressObservations';

import { childrenSelectors } from '@store/children';
import { progressTrackingSelectors } from '@store/progress-tracking';
import {
  getStorageItem,
  setStorageItem,
} from '@utils/common/local-storage.utils';
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
  const userHasTrackedBefore =
    getStorageItem(LocalStorageKeys.HasTrackedChildProgressBefore) || false;
  const currentChild = useSelector(childrenSelectors.getChildById(childId));
  const currentChildUser = useSelector(
    childrenSelectors.getChildUserById(currentChild?.userId)
  );
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
    getChildAchievedLevelPercentage,
    getUnseletedSkills,
    setCategoryAchievedLevel,
    completeCurrentCategoryTracking,
    setHelpingWithTask,
    setHelpingWithTaskText,
    isCompetentInLevel,
    clearHelpingWithTaskId,
  } = useChildProgressObservation(childId, report);

  const [firstTimeTrackingPromptVisible, setFirstTimeTrackingPromptVisible] =
    useState<boolean>(false);

  const [
    progressTrackingLevelOneAlertVisible,
    setProgressTrackingLevelOneAlertVisible,
  ] = useState<boolean>(false);

  const [
    progressTrackingLevelTwoAlertVisible,
    setProgressTrackingLevelTwoAlertVisible,
  ] = useState<boolean>(false);

  const [childDevelopmentLevelForm, setChildDevelopmentLevelForm] =
    useState<ChildDevelopmentLevelFormModel>();

  const [userObservedLevelOneWarning, setUserObservedLevelOneWarning] =
    useState<boolean>(false);

  const [userObservedLevelTwoWarning, setUserObservedLevelTwoWarning] =
    useState<boolean>(false);

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

  useEffect(() => {
    if (userHasTrackedBefore === false) {
      setFirstTimeTrackingPromptVisible(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const firstTimeTrackingPromptHandler = () => {
    setStorageItem(true, LocalStorageKeys.HasTrackedChildProgressBefore);
    setFirstTimeTrackingPromptVisible(false);
  };

  const saveChildDevelopmentLevelForm = (
    form: ChildDevelopmentLevelFormModel
  ) => {
    setCategoryAchievedLevel(form.levelId);

    const level1Percentage = getChildAchievedLevelPercentage(
      ProgressTrackingLevels.LevelOne
    );
    const level2Percentage = getChildAchievedLevelPercentage(
      ProgressTrackingLevels.LevelTwo
    );
    const level3Percentage = getChildAchievedLevelPercentage(
      ProgressTrackingLevels.LevelThree
    );

    if (
      level1Percentage < 100 ||
      level2Percentage < 100 ||
      level3Percentage < 100
    ) {
      goToStep(ChildProgressAssessmentSteps.assessmentStepFive);
    } else {
      clearHelpingWithTaskId();
      completeCurrentCategoryTracking();

      if (returnToOverview) {
        returnToReportOverview();
      } else {
        returnToReportDashboard();
      }
    }
  };

  const returnToReportOverview = () => {
    history.replace(
      `/child-progress-observation-report?step=${ChildProgressAssessmentSteps.assessmentStepFour}`,
      { childId: childId, reportingDate: reportingDate.toISOString() }
    );
  };

  const returnToReportDashboard = () => {
    history.replace('/child-progress-observation', {
      childId: childId,
      reportingDate: reportingDate.toISOString(),
    });
  };

  const saveChildLearningSupportForm = (
    form: ChildLearningSupportFormModel
  ) => {
    setHelpingWithTaskText(form.learningSupport || '');
    completeCurrentCategoryTracking();
    exitAssessment();
  };

  const setChildUndevelopedTask = (skill: ProgressTrackingSkillDto) => {
    setHelpingWithTask(skill);
    goToStep(ChildProgressAssessmentSteps.assessmentStepSix);
  };

  const validateLevelOneSelection = () => {
    if (userObservedLevelOneWarning) return;

    const childIsCompetentWithLevelOne = isCompetentInLevel(
      ProgressTrackingLevels.LevelOne
    );

    if (childIsCompetentWithLevelOne) return;

    setProgressTrackingLevelOneAlertVisible(true);
  };

  const validateLevelOneAndTwoSelection = () => {
    if (userObservedLevelTwoWarning) return;

    const childIsCompetentWithLevelOne = isCompetentInLevel(
      ProgressTrackingLevels.LevelOne
    );

    if (!childIsCompetentWithLevelOne) {
      setProgressTrackingLevelTwoAlertVisible(true);
      return;
    }

    const childIsCompetentWithLevelTwo = isCompetentInLevel(
      ProgressTrackingLevels.LevelTwo
    );

    if (!childIsCompetentWithLevelTwo) {
      setProgressTrackingLevelTwoAlertVisible(true);
    }
  };

  const exitAssessment = () => {
    if (returnToOverview) {
      returnToReportOverview();
      return;
    }

    returnToReportDashboard();
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
            optionSelected={validateLevelOneSelection}
            onSubmit={(result: CategoryLevelFormResult) => {
              submitLevelSkills(
                ProgressTrackingLevels.LevelTwo,
                result.selectedSkills,
                result.missedSkills
              );
              goToStep(ChildProgressAssessmentSteps.assessmentStepThree);
            }}
          />
        );
      case ChildProgressAssessmentSteps.assessmentStepThree:
        return (
          <CategoryLevelForm
            progressTrackingCategoryId={category?.id || 1}
            levelId={ProgressTrackingLevels.LevelThree}
            level={3}
            optionSelected={validateLevelOneAndTwoSelection}
            childId={currentChild?.id || ''}
            onSubmit={(result: CategoryLevelFormResult) => {
              const achievedLevelId = submitLevelSkills(
                ProgressTrackingLevels.LevelThree,
                result.selectedSkills,
                result.missedSkills
              );

              setChildDevelopmentLevelForm({ levelId: achievedLevelId });
              goToStep(ChildProgressAssessmentSteps.assessmentStepFour);
            }}
          />
        );
      case ChildProgressAssessmentSteps.assessmentStepFour:
        return (
          <ChildDevelopmentLevelForm
            childDevelopmentLevelForm={childDevelopmentLevelForm}
            childId={currentChild?.id || ''}
            childAchievedLevelId={getChildAchievedLevelId()}
            onSubmit={(form: ChildDevelopmentLevelFormModel) => {
              saveChildDevelopmentLevelForm(form);
            }}
          />
        );
      case ChildProgressAssessmentSteps.assessmentStepFive:
        return (
          <ChildUndevelopedSkillForm
            undevelopedSkills={getUnseletedSkills()}
            childId={currentChild?.id}
            onSubmit={(skill: ProgressTrackingSkillDto) => {
              setChildUndevelopedTask(skill);
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
            childId={currentChild?.id as string}
            helpingWithSkillId={
              currentCategoryDetails?.supportingTask?.taskId || 0
            }
            onSubmit={(form: ChildLearningSupportFormModel) => {
              saveChildLearningSupportForm(form);
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
            onSubmit={(result: CategoryLevelFormResult) => {
              submitLevelSkills(
                ProgressTrackingLevels.LevelOne,
                result.selectedSkills,
                result.missedSkills
              );
              goToStep(ChildProgressAssessmentSteps.assessmentStepTwo);
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
            exitAssessment();
          }
        }}
        renderOverflow
        backgroundColour={'uiBg'}
        onClose={exitAssessment}
        displayOffline={!isOnline}
      >
        {childProgressAssessmentSteps(activeStepKey)}
      </BannerWrapper>

      <Dialog
        visible={firstTimeTrackingPromptVisible}
        position={DialogPosition.Middle}
        className={'mx-4'}
      >
        <ProgressTrackingInformationPrompt
          childUser={currentChildUser}
          onClose={firstTimeTrackingPromptHandler}
        />
      </Dialog>

      <Dialog
        visible={progressTrackingLevelOneAlertVisible}
        position={DialogPosition.Middle}
        className={'mx-4'}
      >
        <ProgressTrackingAlertLevelOnePrompt
          childUser={currentChildUser}
          onProceed={() => {
            setProgressTrackingLevelOneAlertVisible(false);
            setUserObservedLevelOneWarning(true);
            goToStep(ChildProgressAssessmentSteps.assessmentStepOne);
          }}
          onClose={() => {
            setProgressTrackingLevelOneAlertVisible(false);
            setUserObservedLevelOneWarning(true);
          }}
        />
      </Dialog>

      <Dialog
        visible={progressTrackingLevelTwoAlertVisible}
        position={DialogPosition.Middle}
        className={'mx-4'}
      >
        <ProgressTrackingAlertLevelTwoPrompt
          childUser={currentChildUser}
          onProceed={() => {
            setProgressTrackingLevelTwoAlertVisible(false);
            setUserObservedLevelTwoWarning(true);
            goToStep(ChildProgressAssessmentSteps.assessmentStepTwo);
          }}
          onClose={() => {
            setProgressTrackingLevelTwoAlertVisible(false);
            setUserObservedLevelTwoWarning(true);
          }}
        />
      </Dialog>
    </>
  );
};
