import {
  CategoryTask,
  ChildProgressObservationCategory,
  ChildProgressObservationReport,
  ProgressTrackingCategoryDto,
  ProgressTrackingSkillDto,
  ChildProgressObservationStatus,
} from '@ecdlink/core';
import { useEffect, useState } from 'react';

import isAfter from 'date-fns/isAfter';
import { useAppDispatch } from '@store';
import { useSelector } from 'react-redux';
import { progressTrackingSelectors } from '@store/progress-tracking';
import {
  contentReportActions,
  contentReportSelectors,
  contentReportThunkActions,
} from '@store/content/report';
import { ProgressTrackingLevels } from '@enums/ProgressTrackingLevels';
import { ProgressSkillValues } from '@/enums/ProgressSkillValues';

export interface SeperatedCategoryResult {
  notStartedCategories: ProgressTrackingCategoryDto[];
  inProgressCategories: ProgressTrackingCategoryDto[];
  completedCategories: ProgressTrackingCategoryDto[];
}

export const useChildProgressObservation = (
  childId: string,
  report?: ChildProgressObservationReport
) => {
  const levelCompetencyThreshold = 60;
  const [currentReport, setCurrentReport] = useState<
    ChildProgressObservationReport | undefined
  >(report);
  const [previousReport, setPreviousReport] =
    useState<ChildProgressObservationReport>();
  const [currentCategory, setCurrentCategory] =
    useState<ChildProgressObservationCategory>();

  const childReports = useSelector(
    contentReportSelectors.getChildProgressObservationReports(childId)
  );
  const allCategories = useSelector(
    progressTrackingSelectors.getProgressTrackingCategories
  );
  const allSubCategories = useSelector(
    progressTrackingSelectors.getProgressTrackingSubCategories
  );
  const appDispatch = useAppDispatch();

  const allSkills = useSelector(
    progressTrackingSelectors.getProgressTrackingSkills
  );

  const allSummaries = useSelector(
    contentReportSelectors.getChildProgressReportSummaries(childId)
  );

  useEffect(() => {
    if (childReports && childReports.length > 0) {
      const latestReport = getLatestReport();
      setCurrentReport(latestReport);

      if (childReports.length > 1) {
        const sortedReports = childReports.sort(
          sortChildReportsByDateCreatedDesc
        );
        const prevReport = sortedReports[1];

        if (!prevReport) return;

        setPreviousReport(prevReport);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [childReports]);

  const setCurrentReportById = (reportId: string) => {
    const report = childReports.find((rep) => rep.id === reportId);

    if (!report) {
      throw new Error(
        'Could not find report to set. useChildProgressObservation hook'
      );
    }

    setCurrentReport(report);
  };

  const setCurrentCategoryById = (categoryId: number) => {
    if (!currentReport) {
      throw new Error('Current report is set, could not set current category');
    }

    const category = currentReport.categories.find(
      (cat) => cat.categoryId === categoryId
    );

    if (!category)
      throw new Error(
        `Could not find category by id ${categoryId}, could not set current category`
      );

    setCurrentCategory(category);
  };

  const setHelpingWithTask = (task?: ProgressTrackingSkillDto) => {
    if (!currentReport)
      throw new Error(
        'Current report is not set, could not set category helping task id'
      );
    if (!currentCategory)
      throw new Error(
        'Current category is not set, could not set category helping task id'
      );

    let supportingTask = { ...currentCategory.supportingTask };

    if (!supportingTask) {
      supportingTask = {
        ...task,
        todoText: '',
      };
    } else if (task === undefined) {
      supportingTask.taskId = undefined;
      supportingTask.taskDescription = undefined;
      supportingTask.todoText = '';
    } else {
      supportingTask.taskId = task.id;
      supportingTask.taskDescription = task.name || task.description;
      const skill = currentCategory.tasks.find((x) => x.skillId === task.id);
      if (
        currentCategory.supportingTask?.taskId !== task.id ||
        !skill ||
        skill.value !== task.value
      ) {
        supportingTask.todoText = '';
      }
    }

    appDispatch(
      contentReportActions.setCategorySupportTask({
        reportId: currentReport.id,
        categoryId: currentCategory.categoryId,
        supportingTask,
      })
    );
  };

  const clearHelpingWithTaskId = () => {
    if (!currentReport)
      throw new Error(
        'Current report is not set, could not clear category helping task id'
      );
    if (!currentCategory)
      throw new Error(
        'Current category is not set, could not clear category helping task id'
      );

    const currentCategoryCopy = { ...currentCategory };

    currentCategoryCopy.supportingTask = undefined;

    appDispatch(
      contentReportActions.setCategorySupportTask({
        reportId: currentReport.id,
        categoryId: currentCategory.categoryId,
        supportingTask: undefined,
      })
    );

    setCurrentCategory(currentCategoryCopy);
  };

  const setHelpingWithTaskText = (text: string) => {
    if (!currentReport)
      throw new Error(
        'Current report is not set, could not set category helping task id'
      );
    if (!currentCategory)
      throw new Error(
        'Current category is not set, could not set category helping task id'
      );

    const supportingTask = { ...currentCategory.supportingTask };

    if (!supportingTask) {
      return;
    }

    supportingTask.todoText = text;

    appDispatch(
      contentReportActions.setCategorySupportTask({
        reportId: currentReport.id,
        categoryId: currentCategory.categoryId,
        supportingTask,
      })
    );
  };

  const setCategoryAchievedLevel = (levelId: number) => {
    if (!currentReport)
      throw new Error(
        'Current report is not set, could not set category achieved level'
      );
    if (!currentCategory)
      throw new Error(
        'Current category is not set, could not set category achieved level'
      );

    const currentCategoryCopy = { ...currentCategory };

    currentCategoryCopy.achievedLevelId = levelId;

    appDispatch(
      contentReportActions.setCategoryAchievedLevelId({
        reportId: currentReport.id,
        categoryId: currentCategory.categoryId,
        levelId: levelId,
      })
    );
  };

  const setObservationNote = (note: string) => {
    if (!currentReport)
      throw new Error(
        'Current report is not set, could not update report observation note'
      );
    const currentReportCopy: ChildProgressObservationReport = JSON.parse(
      JSON.stringify(currentReport)
    );

    currentReportCopy.observationNote = note;

    appDispatch(
      contentReportActions.setReportObservationNote({
        reportId: currentReport.id,
        note: note,
      })
    );

    setCurrentReport(currentReportCopy);
  };

  const setChildEnjoys = (childEnjoys: string) => {
    if (!currentReport)
      throw new Error(
        'Current report is not set, could not update report observation note'
      );
    const currentReportCopy: ChildProgressObservationReport = JSON.parse(
      JSON.stringify(currentReport)
    );

    currentReportCopy.childEnjoys = childEnjoys;

    appDispatch(
      contentReportActions.setChildEnjoys({
        reportId: currentReport.id,
        childEnjoys,
      })
    );

    setCurrentReport(currentReportCopy);
  };

  const setChildProgressedWith = (childProgressedWith: string) => {
    if (!currentReport)
      throw new Error(
        'Current report is not set, could not update report observation note'
      );
    const currentReportCopy: ChildProgressObservationReport = JSON.parse(
      JSON.stringify(currentReport)
    );

    currentReportCopy.childProgressedWith = childProgressedWith;

    appDispatch(
      contentReportActions.setChildProgressedWith({
        reportId: currentReport.id,
        childProgressedWith,
      })
    );

    setCurrentReport(currentReportCopy);
  };

  const setHowCategiverCanHelpChild = (howCanCaregiverHelpChild: string) => {
    if (!currentReport)
      throw new Error(
        'Current report is not set, could not update report observation note'
      );
    const currentReportCopy: ChildProgressObservationReport = JSON.parse(
      JSON.stringify(currentReport)
    );

    currentReportCopy.howCanCaregiverHelpChild = howCanCaregiverHelpChild;

    appDispatch(
      contentReportActions.setHowCaregiverCanHelpChild({
        reportId: currentReport.id,
        howCanCaregiverHelpChild,
      })
    );

    setCurrentReport(currentReportCopy);
  };

  const setCategoryTrackingStatus = (
    status: ChildProgressObservationStatus
  ) => {
    if (!currentReport)
      throw new Error(
        'Current report is not set, could not complete current category'
      );
    if (!currentCategory)
      throw new Error(
        'Current category is not set, could not complete current category'
      );

    const currentCategoryCopy = { ...currentCategory };
    const currentReportCopy = JSON.parse(JSON.stringify(currentReport));

    currentCategoryCopy.status = status;

    const indexOfCurrentCategory = currentReportCopy?.categories.findIndex(
      (cat: any) => cat.categoryId === currentCategory.categoryId
    );

    currentReportCopy.categories.splice(
      indexOfCurrentCategory,
      0,
      currentCategoryCopy
    );

    appDispatch(
      contentReportActions.setCategoryStatus({
        reportId: currentReport.id,
        categoryId: currentCategory.categoryId,
        status,
      })
    );

    setCurrentReport(currentReportCopy);
  };

  const submitLevelSkills = (
    levelId: number,
    selectedSkills: ProgressTrackingSkillDto[],
    missedSkills: ProgressTrackingSkillDto[]
  ) => {
    if (!currentCategory)
      throw new Error(
        'Current category is not set, could not submit level skills'
      );

    const mappedLevelSkills: CategoryTask[] = selectedSkills.map((skill) => ({
      levelId,
      skillId: skill.id,
      description: skill.name || skill.description,
      value: skill.value,
    }));

    const mappedMissedSkills: CategoryTask[] = missedSkills.map((skill) => ({
      levelId,
      skillId: skill.id,
      description: skill.name || skill.description,
      value: skill.value,
    }));

    const currentCategoryCopy = { ...currentCategory };

    const otherLevelTasks = currentCategoryCopy.tasks.filter(
      (task) => task.levelId !== levelId
    );
    const otherMissedLevelsTasks = (currentCategory.missingTasks || []).filter(
      (task) => task.levelId !== levelId
    );

    currentCategoryCopy.tasks = [...mappedLevelSkills, ...otherLevelTasks];
    currentCategoryCopy.missingTasks = [
      ...mappedMissedSkills,
      ...otherMissedLevelsTasks,
    ];

    appDispatch(
      contentReportActions.setSkillsForCategory({
        reportId: currentReport?.id,
        categoryId: currentCategoryCopy.categoryId,
        levelId,
        tasks: currentCategoryCopy.tasks,
        missingTasks: currentCategoryCopy.missingTasks,
      })
    );

    setCurrentCategory(currentCategoryCopy);
    return getChildAchievedLevelId(currentCategoryCopy);
  };

  const completeCurrentCategoryTracking = () => {
    if (!currentReport)
      throw new Error(
        'Current report is not set, could not complete current category'
      );
    if (!currentCategory)
      throw new Error(
        'Current category is not set, could not complete current category'
      );

    setCategoryTrackingStatus(ChildProgressObservationStatus.Completed);
  };

  const startCurrentCategoryTracking = () => {
    if (!currentReport)
      throw new Error(
        'Current report is not set, could not complete current category'
      );
    if (!currentCategory)
      throw new Error(
        'Current category is not set, could not complete current category'
      );

    setCategoryTrackingStatus(ChildProgressObservationStatus.Started);
  };

  const getSkills = (): {
    yes: ProgressTrackingSkillDto[];
    tryingToDo: ProgressTrackingSkillDto[];
    notYet: ProgressTrackingSkillDto[];
    none: ProgressTrackingSkillDto[];
  } => {
    if (!currentReport || !currentCategory)
      return {
        yes: [],
        tryingToDo: [],
        notYet: [],
        none: [],
      };

    const category = allCategories.find(
      (x) => x.id === currentCategory.categoryId
    );
    const currentCategorySubCategoryIds =
      category?.subCategories.map((x) => x.id) ?? [];
    const subCategories = allSubCategories.filter((x) =>
      currentCategorySubCategoryIds.includes(x.id)
    );

    const subCategorySkills: ProgressTrackingSkillDto[] = [];
    subCategories?.forEach((x) => subCategorySkills.push(...x.skills));

    const subCategorySkillsIds = subCategorySkills?.map((x) => x.id);

    return {
      yes: allSkills.filter(
        (skill) =>
          subCategorySkillsIds.includes(skill.id) &&
          currentCategory.tasks.some(
            (x) => x.skillId === skill.id && x.value === ProgressSkillValues.Yes
          )
      ),
      tryingToDo: allSkills.filter(
        (skill) =>
          subCategorySkillsIds.includes(skill.id) &&
          currentCategory.tasks.some(
            (x) =>
              x.skillId === skill.id &&
              x.value === ProgressSkillValues.TryingToDo
          )
      ),
      notYet: allSkills.filter(
        (skill) =>
          subCategorySkillsIds.includes(skill.id) &&
          currentCategory.tasks.some(
            (x) =>
              x.skillId === skill.id && x.value === ProgressSkillValues.NotYet
          )
      ),
      none: allSkills.filter(
        (skill) =>
          subCategorySkillsIds.includes(skill.id) &&
          currentCategory.tasks.some((x) => x.skillId === skill.id && !x.value)
      ),
    };
  };

  const getSelectedSkillIdsForCategoryLevel = (levelId: number) => {
    if (!currentReport || !currentCategory) {
      return [];
    }
    const category = allCategories.find(
      (x) => x.id === currentCategory.categoryId
    );
    const currentCategorySubCategoryIds =
      category?.subCategories?.map((x) => x.id) ?? [];
    const subCategories = allSubCategories?.filter((x) =>
      currentCategorySubCategoryIds.includes(x.id)
    );

    const subCategorySkills: ProgressTrackingSkillDto[] = allSkills.filter(
      (skill) =>
        subCategories?.some((subCategory) =>
          subCategory?.skills?.some(
            (subCatSkill) => subCatSkill.id === skill.id
          )
        )
    );
    const selectedLevelSkillsForCategory = currentCategory?.tasks?.filter(
      (task) => task.levelId === levelId
    );

    const selectedSkills: ProgressTrackingSkillDto[] = [];
    selectedLevelSkillsForCategory?.forEach((selectedLevelSkill) => {
      const subCategorySkill = subCategorySkills?.find(
        (subCategorySkill) => subCategorySkill.id === selectedLevelSkill.skillId
      );
      if (subCategorySkill) {
        selectedSkills.push({
          ...subCategorySkill,
          value: selectedLevelSkill.value,
        });
      }
    });
    return selectedSkills;
  };

  const getChildAchievedLevelPercentage = (
    levelId: number,
    activeCategory:
      | ChildProgressObservationCategory
      | undefined = currentCategory
  ) => {
    if (!activeCategory) {
      return 0;
    }

    const category = allCategories.find(
      (x) => x.id === activeCategory.categoryId
    );
    const currentCategorySubCategoryIds =
      category?.subCategories.map((x) => x.id) ?? [];

    const subCategories = allSubCategories.filter((x) =>
      currentCategorySubCategoryIds.includes(x.id)
    );

    const subCategorySkills: ProgressTrackingSkillDto[] = [];
    subCategories?.forEach((x) => subCategorySkills.push(...x.skills));

    const subCategorySkillsIds = subCategorySkills?.map((x) => x.id);

    const totalLevelSkillCount = allSkills?.filter(
      (skill) =>
        skill.level &&
        skill.level.length > 0 &&
        skill.level[0]?.id === levelId &&
        subCategorySkillsIds?.includes(skill.id)
    ).length;
    const selectedSkillCount = activeCategory?.tasks?.filter(
      (x) => x.levelId === levelId && x.value === ProgressSkillValues.Yes
    ).length;

    return (selectedSkillCount / (totalLevelSkillCount || 1)) * 100;
  };

  const getChildAchievedLevelId = (
    activeCategory?: ChildProgressObservationCategory
  ) => {
    if (!activeCategory && currentCategory) {
      activeCategory = currentCategory;
    } else if (!activeCategory) {
      return ProgressTrackingLevels.LevelP;
    }

    const level1Percentage = getChildAchievedLevelPercentage(
      ProgressTrackingLevels.LevelOne,
      activeCategory
    );

    if (level1Percentage < levelCompetencyThreshold) {
      return ProgressTrackingLevels.LevelP;
    }

    const level2Percentage = getChildAchievedLevelPercentage(
      ProgressTrackingLevels.LevelTwo,
      activeCategory
    );

    if (level2Percentage < levelCompetencyThreshold) {
      return ProgressTrackingLevels.LevelOne;
    }

    const level3Percentage = getChildAchievedLevelPercentage(
      ProgressTrackingLevels.LevelThree,
      activeCategory
    );

    if (level3Percentage < levelCompetencyThreshold) {
      return ProgressTrackingLevels.LevelTwo;
    }

    if (level1Percentage === 100) {
      return ProgressTrackingLevels.LevelThree;
    }

    return ProgressTrackingLevels.LevelTwo;
  };

  const isAllSkillsYes = () => {
    const level1Percentage = getChildAchievedLevelPercentage(
      ProgressTrackingLevels.LevelOne
    );
    const level2Percentage = getChildAchievedLevelPercentage(
      ProgressTrackingLevels.LevelTwo
    );
    const level3Percentage = getChildAchievedLevelPercentage(
      ProgressTrackingLevels.LevelThree
    );
    return (
      level1Percentage === 100 &&
      level2Percentage === 100 &&
      level3Percentage === 100
    );
  };

  const getLatestReport = () => {
    if (!childReports)
      throw new Error('child reports are not set, could not get latest report');

    const latest = childReports.sort(sortChildReportsByDateCreatedDesc);

    return latest[0];
  };

  const getCompletedReports = () => {
    if (!childReports) return [];

    return childReports
      .filter(
        (report) =>
          allSummaries.some((sum) => sum.reportId === report.id) ||
          report.dateCompleted !== undefined
      )
      .sort(sortChildReportsByDateCreatedDesc);
  };

  const isCompetentInLevel = (levelId: number) => {
    const selectedPercentage = getChildAchievedLevelPercentage(levelId);

    if (selectedPercentage < levelCompetencyThreshold) {
      return false;
    }

    return true;
  };

  const getLevelSummaryText = (achievedLevelId: number, childName: string) => {
    switch (achievedLevelId) {
      case ProgressTrackingLevels.LevelP:
        return `According to your answers, ${childName} can’t easily do nearly all of the things in the moving on level yet.`;
      case ProgressTrackingLevels.LevelOne:
        return `According to your answers, ${childName} can do all or nearly all of the things in the moving on level.`;
      case ProgressTrackingLevels.LevelTwo:
        return `According to your answers, ${childName} can do all or nearly all of the things in the moving on and advancing further levels.`;
      case ProgressTrackingLevels.LevelThree:
        return `According to your answers, ${childName} can do all or nearly all of the things in the moving on, advancing further and towards grade R levels.`;
      default:
        return '';
    }
  };

  const getHelpingWithTask = () => {
    if (!currentCategory)
      throw new Error(
        'Current category is not set, could not set category helping task id'
      );

    return currentCategory.supportingTask?.taskId;
  };

  const getHelpingWithTaskText = () => {
    if (!currentCategory)
      throw new Error(
        'Current category is not set, could not set category helping task id'
      );

    return currentCategory.supportingTask?.todoText;
  };

  const saveReport = async (report: ChildProgressObservationReport) => {
    if (!report)
      throw new Error('Current report is not set, could not save report');

    await appDispatch(contentReportActions.saveReport(report));

    return report;
  };

  const completeReport = async (
    report: ChildProgressObservationReport,
    classroomGroupId: string
  ) => {
    if (!report)
      throw new Error('Current report is not set, could not complete report');

    const currentReportCopy: ChildProgressObservationReport = JSON.parse(
      JSON.stringify(report)
    );

    currentReportCopy.dateCompleted = new Date().toISOString();

    try {
      await appDispatch(
        contentReportThunkActions.saveUserContentChildProgressReport({
          ChildId: currentReportCopy.childId,
          ClassroomGroupId: classroomGroupId,
          Id: currentReportCopy.id,
          ReportDate: currentReportCopy.reportingDate,
          ReportContent: JSON.stringify(currentReportCopy),
          IsActive: true,
          DateCompleted: new Date(),
        })
      ).unwrap();
      // await appDispatch(
      //   contentReportThunkActions.getChildProgressReportSummary(50)
      // );
    } finally {
      appDispatch(contentReportActions.saveReport(currentReportCopy));
      setCurrentReport(currentReportCopy);
    }
  };

  const completeReportLocally = (
    report: ChildProgressObservationReport,
    classroomGroupId: string
  ) => {
    if (!report)
      throw new Error('Current report is not set, could not complete report');

    const currentReportCopy: ChildProgressObservationReport = JSON.parse(
      JSON.stringify(report)
    );

    currentReportCopy.dateCompleted = new Date().toISOString();

    appDispatch(contentReportActions.saveReport(currentReportCopy));
    appDispatch(
      contentReportActions.markReportForSyncing({
        reportId: currentReportCopy.id,
        classroomGroupId: classroomGroupId,
      })
    );
    setCurrentReport(currentReportCopy);
  };

  const saveReportLocally = (
    report: ChildProgressObservationReport,
    classroomGroupId: string
  ) => {
    if (!report)
      throw new Error('Current report is not set, could not complete report');

    const currentReportCopy: ChildProgressObservationReport = JSON.parse(
      JSON.stringify(report)
    );

    appDispatch(contentReportActions.saveReport(currentReportCopy));
    appDispatch(
      contentReportActions.markReportForSyncing({
        reportId: currentReportCopy.id,
        classroomGroupId: classroomGroupId,
      })
    );
    setCurrentReport(currentReportCopy);
  };

  const sortChildReportsByDateCreatedDesc = (
    reportA: ChildProgressObservationReport,
    reportB: ChildProgressObservationReport
  ) =>
    isAfter(new Date(reportA.reportingDate), new Date(reportB.reportingDate))
      ? -1
      : 1;

  return {
    getSkills,
    getChildAchievedLevelId,
    getLatestReport,
    getChildAchievedLevelPercentage,
    getSelectedSkillIdsForCategoryLevel,
    getLevelSummaryText,
    getCompletedReports,
    getHelpingWithTask,
    getHelpingWithTaskText,

    setCurrentReportById,
    setCurrentCategoryById,
    setHelpingWithTask,
    setHelpingWithTaskText,
    setCategoryAchievedLevel,
    setObservationNote,
    setChildEnjoys,
    setChildProgressedWith,
    setHowCategiverCanHelpChild,

    clearHelpingWithTaskId,
    submitLevelSkills,
    completeCurrentCategoryTracking,
    startCurrentCategoryTracking,
    currentReport,
    previousReport,
    currentCategory,
    isCompetentInLevel,
    saveReport,
    saveReportLocally,
    completeReport,
    completeReportLocally,
    isAllSkillsYes,
  };
};
