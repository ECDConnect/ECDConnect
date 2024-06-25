import { useDialog } from '@ecdlink/core';
import { Button, DialogPosition, Typography } from '@ecdlink/ui';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router';
import { SuccessCard } from '../../../../components/success-card/success-card';
import { DateFormats } from '../../../../constants/Dates';
import { useOnlineStatus } from '@hooks/useOnlineStatus';
import { useProgrammePlanningRecommendations } from '@hooks/useProgrammePlanningRecommendations';
import OnlineOnlyModal from '../../../../modals/offline-sync/online-only-modal';
import { programmeSelectors } from '@store/programme';
import {
  getDateRangeText,
  getProgrammeWeeks,
  getTotalIncompleteDaysInWeek,
} from '@utils/classroom/programme-planning/programmes.utils';
import { ActivitySubCategoryCard } from '../components/activities/components/activity-sub-category-card/activity-sub-category-card';
import { EmptyActivities } from '../components/activities/components/empty-activity-filter-result/empty-activity-filter-result';
import { IconInformationIndicator } from '../components/icon-information-indicator/icon-information-indicator';
import { ProgrammePlanningHeader } from '../components/programme-planning-header/programme-planning-header';
import { ProgrammeHistory } from './components/programme-history/programme-history';
import { ProgrammeSummaryListItem } from './components/programme-summary-list-item/programme-summary-list-item';
import { ProgrammeSummaryProps } from './programme-summary.types';
import ROUTES from '@routes/routes';
import { TabsItemForPrincipal } from '../../class-dashboard/class-dashboard.types';

const ProgrammeSummary: React.FC<ProgrammeSummaryProps> = ({
  programme,
  noPlan,
  variation,
}) => {
  const history = useHistory();

  const { isOnline } = useOnlineStatus();
  const dialog = useDialog();
  let todaysProgramme = useSelector(programmeSelectors.getTodaysProgramme());

  if (!programme) {
    programme = todaysProgramme;
  }

  const [programmeStartDate, programmeEndDate] = [
    new Date(programme?.startDate || 0),
    new Date(programme?.endDate || 0),
  ];

  const programmeWeeks = getProgrammeWeeks(programme);

  const { getAdditionalRecommendedSubCategories } =
    useProgrammePlanningRecommendations();

  const recommendations = getAdditionalRecommendedSubCategories(programme);

  const isProgrammeCompleted = programmeWeeks.every(
    (x) => x.totalIncompleteDays === 0
  );

  const [displayGoodMixCard, setDisplayGoodMixCard] = useState(true);

  const handleStart = () => {
    const firstInCompleteWeekIndex = programmeWeeks.findIndex(
      (week) => week.totalIncompleteDays > 0
    );

    if (firstInCompleteWeekIndex > -1) {
      history.push(ROUTES.PROGRAMMES.ROUTINE, {
        programmeId: programme?.id,
        weekIndex: firstInCompleteWeekIndex,
      });
      return;
    }

    history.push(ROUTES.PROGRAMMES.ROUTINE, {
      programmeId: programme?.id,
      weekIndex: 0,
    });
  };

  const handleBackToClassroom = () => {
    history.replace(ROUTES.CLASSROOM.ROOT, {
      activeTabIndex: TabsItemForPrincipal.CLASSES,
    });
  };

  const showOnlineOnly = () => {
    dialog({
      position: DialogPosition.Middle,
      render: (onSubmit) => {
        return <OnlineOnlyModal onSubmit={onSubmit}></OnlineOnlyModal>;
      },
    });
  };

  const handleAddProgramme = () => {
    if (!isOnline) {
      showOnlineOnly();
      return;
    }

    history.push(ROUTES.PROGRAMMES.THEME);
  };

  const handleWeekSelected = (weekIndex: number) => {
    history.push(ROUTES.PROGRAMMES.ROUTINE, {
      programmeId: programme?.id,
      weekIndex,
    });
  };

  return (
    <div className="py-2">
      {!noPlan && (
        <>
          <ProgrammePlanningHeader
            headerText={
              variation === 'update'
                ? 'Programme summary'
                : 'Plan your programme'
            }
            themeName={programme?.name}
            plannedWeeks={
              programmeWeeks?.filter((week) => week.totalIncompleteDays === 0)
                ?.length
            }
            showCount={
              variation === 'create' ||
              (variation === 'update' && isProgrammeCompleted)
            }
            totalWeeks={programmeWeeks?.length}
            subHeaderText={`${new Date(
              programme?.startDate || 0
            ).toLocaleString('en-ZA', DateFormats.standardDate)} - ${new Date(
              programme?.endDate || 0
            ).toLocaleString('en-ZA', DateFormats.standardDate)}`}
          />

          <div className="w-full px-4 py-4">
            {variation === 'view' ? (
              <Button
                id="gtm-add-programme"
                type="filled"
                color="primary"
                onClick={handleAddProgramme}
                icon="PlusIcon"
                iconPosition="start"
                text="New programme"
                textColor={'white'}
              />
            ) : !isProgrammeCompleted ? (
              <Button
                type="filled"
                color="primary"
                onClick={handleStart}
                className="w-full"
                icon="ArrowCircleRightIcon"
                iconPosition="start"
                text={'Continue planning'}
                textColor={'white'}
              />
            ) : (
              <Button
                type="filled"
                color="primary"
                onClick={handleBackToClassroom}
                className="w-full"
                icon="AcademicCapIcon"
                iconPosition="start"
                text="Back to classroom"
                textColor={'white'}
              />
            )}
          </div>

          <div className={'w-full'}>
            {programmeWeeks.map((week, idx) => (
              <ProgrammeSummaryListItem
                key={week.startDate.toString()}
                title={getDateRangeText(
                  week.startDate > programmeStartDate
                    ? week.startDate
                    : programmeStartDate,
                  week.endDate < programmeEndDate
                    ? week.endDate
                    : programmeEndDate
                )}
                subTitle={`${getTotalIncompleteDaysInWeek(
                  week
                )} days incomplete`}
                programmeWeek={idx + 1}
                isCompleted={week.totalIncompleteDays === 0}
                onClick={() => handleWeekSelected(idx)}
              />
            ))}
          </div>

          {recommendations && recommendations.length > 0 && (
            <div className={'flex flex-col items-stretch justify-center p-4'}>
              <Typography
                text="To create a balanced programme, add more of these skills to your plan:"
                type="unspecified"
                fontSize="16"
                color="alertDark"
              />

              {isOnline &&
                recommendations.map((subCategory) => (
                  <ActivitySubCategoryCard
                    key={`recommended - subcategory - ${subCategory.id}`}
                    subCategory={subCategory}
                  />
                ))}
              {!isOnline && (
                <EmptyActivities
                  title="Information not available when offline"
                  subTitle="Please go online and refresh the page to see suggested activities."
                  className="border-uiMid rounded-lg border border-dashed"
                />
              )}
            </div>
          )}

          {isProgrammeCompleted &&
            recommendations &&
            programme?.name === 'No theme' &&
            recommendations.length === 0 &&
            displayGoodMixCard && (
              <SuccessCard
                className={'mx-4 mt-4'}
                icon={'SparklesIcon'}
                text={`Good job, you have a good mix of skills in your daily routines!`}
                onClose={() => {
                  setDisplayGoodMixCard(false);
                }}
              />
            )}
        </>
      )}

      {noPlan && (
        <>
          <IconInformationIndicator
            title={'You don’t have any activities planned for this period.'}
            subTitle={'Choose a theme to get started'}
            actions={[
              {
                id: 'gtm-add-programme',
                text: 'New programme',
                textColor: 'white',
                icon: 'PlusIcon',
                iconPosition: 'start',
                type: 'filled',
                color: 'primary',
                onClick: handleAddProgramme,
              },
            ]}
          />
          <div className={'mt-4'}>
            <ProgrammeHistory
              onViewItem={(programme) =>
                history.push(ROUTES.PROGRAMMES.SUMMARY, {
                  programmeId: programme.id,
                  variation: 'update',
                })
              }
            />
          </div>
        </>
      )}
    </div>
  );
};

export default ProgrammeSummary;
