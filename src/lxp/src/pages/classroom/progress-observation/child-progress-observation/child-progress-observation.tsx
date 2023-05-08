import {
  ProgressTrackingCategoryDto,
  ChildProgressObservationStatus,
  ChildProgressObservationReport,
  capitalizeFirstLetter,
} from '@ecdlink/core';
import {
  Alert,
  BannerWrapper,
  Button,
  Dialog,
  DialogPosition,
  Divider,
  ListItem,
  Typography,
  classNames,
  renderIcon,
} from '@ecdlink/ui';
import { useSelector } from 'react-redux';
import { useHistory, useLocation } from 'react-router';
import { ChildProgressNoteCard } from '../components/child-progress-note-card/child-progress-note-card';
import { ProgressTrackingLevels } from '@enums/ProgressTrackingLevels';
import { useChildProgressObservation } from '@hooks/useChildProgressObservations';

import { getProgressTrackingCategories } from '@store/progress-tracking/progress-tracking.selectors';
import {
  getReportingPeriod,
  isMatchingReportingPeriods,
} from '@utils/child/child-profile-utils';
import { newGuid } from '@utils/common/uuid.utils';

import * as styles from './child-progress-observation.styles';
import { ChildProgressObservationPageState } from './child-progress-observation.types';
import { ChildProgressAssessmentSteps } from '../child-progress-assessment/child-progress-assessment.types';
import ObservationCategoryCard from '../components/observation-category-card/observation-category-card';
import { childrenSelectors } from '@store/children';
import { userSelectors } from '@store/user';
import { useOnlineStatus } from '@hooks/useOnlineStatus';
import { classroomsSelectors } from '@store/classroom';
import {
  getCategoryFromCurrentReport,
  isChildInitialRegistrationPeriod,
  seperateCategoriesByStatus,
} from '@utils/child/child-progress-report.utils';
import { contentReportSelectors } from '@store/content/report';
import { useEffect, useState } from 'react';
import ProgressTrackingTutorial from '../components/progress-tracking-tutorial/progress-tracking-tutorial';
import { useStaticData } from '@hooks/useStaticData';
import { FileTypeEnum } from '@ecdlink/graphql';
import { documentSelectors } from '@store/document';
import { useAppDispatch } from '@store';
import { analyticsActions } from '@store/analytics';
import ROUTES from '@routes/routes';
import { childRegistrationConstants } from '@/constants/Child';
import { DateFormats } from '@/constants/Dates';
import { addDays } from 'date-fns';

export const ChildProgressObservationPage: React.FC = () => {
  const history = useHistory();
  const appDispatch = useAppDispatch();
  const { isOnline } = useOnlineStatus();
  const { state: routeState } =
    useLocation<ChildProgressObservationPageState>();
  const { getDocumentTypeIdByEnum } = useStaticData();
  const typeId = getDocumentTypeIdByEnum(FileTypeEnum.ProfileImage);
  const [hideCompletedSection, setHideCompletedSection] =
    useState<boolean>(false);

  const reportingDate = routeState.reportingDate
    ? new Date(routeState.reportingDate)
    : new Date();
  const reportingPeriod = getReportingPeriod(reportingDate);

  const child = useSelector(childrenSelectors.getChildById(routeState.childId));
  const childUser = useSelector(
    childrenSelectors.getChildUserById(child?.userId)
  );

  const classroom = useSelector(classroomsSelectors.getClassroom);
  const [tutorialActive, setTutorialActive] = useState<boolean>(false);
  const practitionerUser = useSelector(userSelectors.getUser);
  const profilePicture = useSelector(
    documentSelectors.getDocumentByTypeId(practitionerUser?.id, typeId)
  );
  const categories: ProgressTrackingCategoryDto[] = useSelector(
    getProgressTrackingCategories
  );
  const summaries = useSelector(
    contentReportSelectors.getChildProgressReportSummaries()
  );

  const reportSummaries = useSelector(
    contentReportSelectors.getChildLatestCompletedReports(routeState.childId)
  );
  const [latestCompletedSummary] = reportSummaries;

  const report = useSelector(
    contentReportSelectors.getChildProgressObservationReportByReportingPeriod(
      reportingDate,
      routeState.childId
    )
  );

  const childInsertedDate =
    child && child.insertedDate ? new Date(child.insertedDate) : new Date();

  const requiresInitialReport = !child
    ? false
    : !latestCompletedSummary && isChildInitialRegistrationPeriod(child);

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

  const { saveReport } = useChildProgressObservation(
    routeState.childId,
    report
  );

  const reportNote = report?.observationNote;

  const { notStartedCategories, inProgressCategories, completedCategories } =
    seperateCategoriesByStatus(categories, report);

  const isComplete = completedCategories.length === categories.length;

  const reportSummary = summaries.find(
    (summary) =>
      summary.childId === routeState.childId &&
      isMatchingReportingPeriods(new Date(summary.reportDate), reportingDate)
  );

  const isReturningUser =
    completedCategories.length > 0 || inProgressCategories.length > 0;

  const onCategoryNavigation = async (
    categoryId: number,
    status: ChildProgressObservationStatus
  ) => {
    if (!categoryId) return;

    if (!report) {
      await persistReport();
    }

    if (status === ChildProgressObservationStatus.NotStarted)
      history.push(ROUTES.PROGRESS_TRACKING_CATEGORY, {
        childId: child?.id,
        progressTrackingCategoryId: categoryId,
        reportingDate: reportingDate.toISOString(),
      });
    else {
      history.push(ROUTES.CHILD_PROGRESS_ASSESSMENT, {
        step: ChildProgressAssessmentSteps.assessmentStepOne,
        childId: routeState.childId,
        progressTrackingCategoryId: categoryId,
        reportingDate: reportingDate.toISOString(),
      });
    }
  };

  const persistReport = async (): Promise<ChildProgressObservationReport> => {
    let newReport: ChildProgressObservationReport | undefined = report;

    if (!newReport) {
      newReport = {
        categories: categories.map((cat) => ({
          categoryId: cat.id,
          achievedLevelId: 0,
          status: ChildProgressObservationStatus.NotStarted,
          tasks: [],
          missingTasks: [],
        })),
        reportingDate: reportingDate.toISOString(),
        achievedLevelId: 0,
        childId: child?.id as string,
        dateCreated: new Date().toISOString(),
        id: newGuid(),
        reportingPeriod: reportingPeriod.monthName,
        childFirstname: childUser?.firstName || '',
        childSurname: childUser?.surname || '',
        classroomName: classroom?.name || '',
        practitionerFirstname: practitionerUser?.firstName || '',
        practitionerSurname: practitionerUser?.surname || '',
        practitionerPhotoUrl: profilePicture?.file,
      };
    }

    return await saveReport(newReport);
  };

  const updateReportObservationNote = async () => {
    if (!report) {
      await persistReport();
    }

    history.push(ROUTES.CHILD_PROGRESS_OBSERVATION_NOTE, {
      childId: routeState.childId,
    });
  };

  const finalizeReport = () => {
    history.push(ROUTES.CHILD_PROGRESS_OBSERVATION_REPORT, {
      childId: routeState.childId,
      reportingDate,
    });
  };

  return (
    <>
      <BannerWrapper
        size={'small'}
        onBack={() => {
          if (practitionerUser?.roles?.some((role) => role.name === 'Coach')) {
            history.push(ROUTES.COACH.CHILD_PROFILE, {
              childId: routeState.childId,
            });
          } else {
            history.push(ROUTES.CHILD_PROFILE, { childId: routeState.childId });
          }
        }}
        title={
          requiresInitialReport
            ? 'First observations'
            : `${reportingPeriod.monthName} progress observations`
        }
        subTitle={`${childUser?.firstName} ${childUser?.surname}`}
        data-testId={'child-progress-observation-banner-wrapper'}
        renderOverflow
        displayOffline={!isOnline}
        displayHelp={true}
        onHelp={() => setTutorialActive(true)}
      >
        <div
          data-testid={'child-progress-observation-content'}
          className={styles.wrapper}
        >
          <div className={styles.contentWrapper}>
            <Typography
              text={
                requiresInitialReport
                  ? 'First progress observations'
                  : `${reportingPeriod.monthName} progress observations`
              }
              type={'body'}
              weight={'bold'}
            />
            <Typography
              text={
                requiresInitialReport
                  ? `Observe ${
                      childUser?.firstName
                    } and track progress by ${addDays(
                      childInsertedDate,
                      childRegistrationConstants.firstProgressReportPeriod
                    ).toLocaleString('en-za', DateFormats.dayFullMonthYear)}`
                  : reportingPeriod.monthName === 'June'
                  ? `January to June ${reportingPeriod.year}`
                  : `July to December ${reportingPeriod.year}`
              }
              type={'body'}
              lineHeight="snug"
            />
          </div>
          {isComplete && !reportSummary && (
            <ListItem
              key={'create-report'}
              backgroundColor={'white'}
              withPaddingX={true}
              withPaddingY={true}
              iconName={'PresentationChartLineIcon'}
              iconBackgroundColor={'primary'}
              iconColor="white"
              showIcon={true}
              title={`Create ${reportingPeriod.monthName} caregiver report`}
              subTitle={`Report due <b>30 ${reportingPeriod.monthName} ${reportingPeriod.year}</>`}
              showChevronIcon
              onButtonClick={finalizeReport}
            />
          )}
          {notStartedCategories &&
            notStartedCategories.length > 0 &&
            notStartedCategories.map((cat: ProgressTrackingCategoryDto) => {
              return (
                <ListItem
                  className="ml-2 mr-2 mt-1"
                  backgroundColor={'uiBg'}
                  withPaddingX={true}
                  withPaddingY={true}
                  key={`not-started-${cat.id}`}
                  iconImageSrc={cat.imageUrl}
                  iconImageBackgroundColor={cat.color}
                  showIcon={cat.imageUrl ? true : false}
                  title={
                    cat.name
                      ? capitalizeFirstLetter(cat.name.toLowerCase())
                      : ''
                  }
                  titleTypographyType="h4"
                  subTitle={
                    cat.subTitle
                      ? capitalizeFirstLetter(cat.subTitle.toLowerCase())
                      : ''
                  }
                  showChevronIcon
                  showDivider
                  dividerColor={'white'}
                  dividerType={'solid'}
                  onButtonClick={() => {
                    onCategoryNavigation(
                      cat.id,
                      ChildProgressObservationStatus.NotStarted
                    );
                  }}
                />
              );
            })}
          {isReturningUser && inProgressCategories.length > 0 && (
            <>
              <Typography
                text={'Started'}
                color={'textDark'}
                lineHeight={'snug'}
                type={'body'}
                className={'ml-4 mt-2 mb-2'}
              />
              {inProgressCategories.map((cat: ProgressTrackingCategoryDto) => {
                return (
                  <ListItem
                    className="ml-2 mr-2 mt-1"
                    backgroundColor={'uiBg'}
                    withPaddingX={true}
                    withPaddingY={true}
                    key={`started-${cat.id}`}
                    iconImageSrc={cat.imageUrl}
                    iconImageBackgroundColor={cat.color}
                    showIcon={true}
                    title={capitalizeFirstLetter(cat.name.toLowerCase())}
                    titleTypographyType="h4"
                    subTitle={capitalizeFirstLetter(cat.subTitle.toLowerCase())}
                    showChevronIcon
                    showDivider
                    dividerColor={'white'}
                    dividerType={'solid'}
                    onButtonClick={() => {
                      onCategoryNavigation(
                        cat.id,
                        ChildProgressObservationStatus.Started
                      );
                    }}
                  />
                );
              })}
            </>
          )}
          <div>
            <Divider dividerType={'dashed'} className="m-2" />
          </div>
          {!reportNote && (
            <ListItem
              key="notes"
              titleColor="textDark"
              subTitleColor="textDark"
              backgroundColor={'transparent'}
              withPaddingX={true}
              withPaddingY={true}
              iconBackgroundColor={'secondary'}
              title={'Your notes'}
              subTitle={'Write a note or observation'}
              showButton={true}
              buttonType={'filled'}
              buttonColor={'primary'}
              buttonIcon="PlusIcon"
              buttonText="Add"
              buttonTextColor="white"
              onButtonClick={updateReportObservationNote}
            />
          )}
          {reportNote && (
            <ChildProgressNoteCard
              note={reportNote}
              onEdit={updateReportObservationNote}
              className={'m-4'}
            />
          )}
          {isReturningUser && completedCategories.length > 0 && (
            <div className="mr-2 ml-2 mt-3">
              <Button
                onClick={() => setHideCompletedSection(!hideCompletedSection)}
                className="w-full"
                size="small"
                color="primary"
                type="filled"
              >
                {renderIcon('EyeIcon', classNames('h-5 w-5 text-white'))}
                <Typography
                  type="h6"
                  className="ml-2"
                  text={`${
                    hideCompletedSection ? 'Show' : 'Hide'
                  } completed sections`}
                  color="white"
                />
              </Button>
            </div>
          )}
          {isReturningUser &&
            completedCategories.length > 0 &&
            !hideCompletedSection && (
              <div className={'px-4'}>
                {completedCategories.map((cat: ProgressTrackingCategoryDto) => {
                  const categoryFromReport = getCategoryFromCurrentReport(
                    cat.id,
                    report
                  );

                  return (
                    <ObservationCategoryCard
                      key={`completed-${cat.id}`}
                      className={'mt-4'}
                      categoryName={cat.name}
                      categoryColour={cat.color}
                      isCompetentWithCategory={
                        [
                          ProgressTrackingLevels.LevelThree,
                          ProgressTrackingLevels.LevelTwo,
                        ].includes(categoryFromReport?.achievedLevelId ?? 0) &&
                        !categoryFromReport?.supportingTask
                      }
                      levelId={categoryFromReport?.achievedLevelId || 0}
                      childName={`${childUser?.firstName} ${childUser?.surname}`}
                      helpingSkillId={
                        categoryFromReport?.supportingTask?.taskId || 0
                      }
                      toDoNote={
                        categoryFromReport?.supportingTask?.todoText || ''
                      }
                      onEdit={() =>
                        onCategoryNavigation(
                          cat.id,
                          ChildProgressObservationStatus.Completed
                        )
                      }
                    />
                  );
                })}
              </div>
            )}
          {!isComplete && (
            <div className={'mt-4 px-4'}>
              <Alert
                type={'info'}
                title="Remember, each child is unique!"
                messageColor="textDark"
                message="Observe children carefully to see what they can do."
              />
            </div>
          )}
        </div>
      </BannerWrapper>
      <Dialog fullScreen visible={tutorialActive} position={DialogPosition.Top}>
        <div className={styles.dialogContent}>
          <ProgressTrackingTutorial
            onComplete={() => setTutorialActive(false)}
            onClose={() => setTutorialActive(false)}
          />
        </div>
      </Dialog>
    </>
  );
};
