import { Button, CoreRadioGroup, Typography } from '@ecdlink/ui';
import { useMemo, useState } from 'react';
import { useHistory, useLocation } from 'react-router';
import { format } from 'date-fns';
import { useSelector } from 'react-redux';
import ROUTES from '@/routes/routes';
import { useProgressForChildren } from '@/hooks/useProgressForChildren';
import { classroomsSelectors } from '@/store/classroom';
import { StepViewer } from '@/components/step-viewer/step-viewer';
import { Step } from '@/components/step-viewer/components/step';
import { ChildProgressSummarySteps } from './view-summary.types';
import { useStepNavigation } from '@ecdlink/core';

export type ProgressViewReportsSummarySelectClassroomGroupAndAgeGroupState = {
  reportPeriodId: string;
};

export const ProgressViewReportsSummarySelectClassroomGroupAndAgeGroup: React.FC =
  () => {
    const history = useHistory();

    const { state: routeState } =
      useLocation<ProgressViewReportsSummarySelectClassroomGroupAndAgeGroupState>();

    const { activeStepKey, canGoBack, goBackOneStep, goToStep } =
      useStepNavigation(ChildProgressSummarySteps.reportingPeriod);

    const classroomGroups = useSelector(classroomsSelectors.getClassroomGroups);

    const {
      allReportingPeriods,
      allReportsForYear,
      children,
      currentReportingPeriod,
    } = useProgressForChildren();

    // ────────────────────────────────────────────────
    // Base derived data
    // ────────────────────────────────────────────────

    const reportChildUserIds = useMemo(
      () => new Set(children.map((r) => r.childUserId)),
      [children]
    );

    const reportAgeGroups = useMemo(
      () =>
        Array.from(new Set(children.map((r) => r.ageGroup).filter(Boolean))),
      [children]
    );

    const reportPeriodIds = useMemo(
      () =>
        new Set(allReportsForYear.map((r) => r.childProgressReportPeriodId)),
      [allReportsForYear]
    );

    const availablePeriods = useMemo(
      () => allReportingPeriods.filter((p) => reportPeriodIds.has(p.id)),
      [allReportingPeriods, reportPeriodIds]
    );

    const childIdToChildUserId = useMemo(
      () =>
        new Map(children.map((child) => [child.childId, child.childUserId])),
      [children]
    );

    const availableClassrooms = useMemo(
      () =>
        classroomGroups.filter((group) =>
          group.learners.some((l) => reportChildUserIds.has(l.childUserId))
        ),
      [classroomGroups, reportChildUserIds]
    );

    // ────────────────────────────────────────────────
    // Manual selections (what the user explicitly picked)
    // ────────────────────────────────────────────────

    const [selectedPeriod, setSelectedPeriod] = useState<string | undefined>(
      () => {
        if (routeState?.reportPeriodId) return routeState.reportPeriodId;
        if (availablePeriods?.length === 1) return availablePeriods[0].id;
        if (currentReportingPeriod?.id) return currentReportingPeriod.id;
        return undefined;
      }
    );

    const [manualClassroom, setManualClassroom] = useState<string | undefined>(
      undefined
    );

    const [manualAgeGroup, setManualAgeGroup] = useState<number | undefined>(
      undefined
    );

    // ────────────────────────────────────────────────
    // Options (filtered by upstream selections)
    // ────────────────────────────────────────────────

    const periodOptions = useMemo(
      () =>
        availablePeriods.map((period, idx) => ({
          id: idx,
          label: `Report ${idx + 1} - ${format(
            new Date(period?.startDate ?? Date.now()),
            'd MMM'
          )} to ${format(
            new Date(period?.endDate ?? Date.now()),
            'd MMM yyyy'
          )}`,
          value: period.id,
        })),
      [availablePeriods]
    );

    const filteredClassroomOptions = useMemo(() => {
      let baseClassrooms = availableClassrooms;

      if (selectedPeriod) {
        const childrenWithReportInPeriod = new Set(
          allReportsForYear
            .filter((r) => r.childProgressReportPeriodId === selectedPeriod)
            .map((r) => childIdToChildUserId.get(r?.childId))
            .filter((userId): userId is string => userId !== undefined)
        );

        baseClassrooms = availableClassrooms.filter((group) =>
          group.learners.some((l) =>
            childrenWithReportInPeriod.has(l.childUserId)
          )
        );
      }

      return baseClassrooms.map((group, idx) => ({
        id: idx,
        label: group.name,
        value: group.id,
      }));
    }, [
      selectedPeriod,
      availableClassrooms,
      allReportsForYear,
      childIdToChildUserId,
    ]);

    const filteredAgeGroupOptions = useMemo(() => {
      let relevantReports = allReportsForYear;

      if (selectedPeriod) {
        relevantReports = relevantReports.filter(
          (r) => r.childProgressReportPeriodId === selectedPeriod
        );
      }

      const childLookup = new Map(children.map((c) => [c.childId, c]));
      const allowedAgeGroupIds = new Set<number>();

      // Use the resolved classroom (auto or manual) for filtering
      const resolvedClassroom =
        filteredClassroomOptions.length === 1
          ? filteredClassroomOptions[0].value
          : manualClassroom;

      if (resolvedClassroom) {
        const classroom = availableClassrooms.find(
          (g) => g.id === resolvedClassroom
        );
        if (!classroom) return [];

        const childUserIdsInClass = new Set(
          classroom.learners.map((l) => l.childUserId)
        );

        relevantReports.forEach((report) => {
          const child = childLookup.get(report.childId);
          if (
            child?.ageGroup?.id &&
            childUserIdsInClass.has(child.childUserId)
          ) {
            allowedAgeGroupIds.add(child.ageGroup.id);
          }
        });
      } else {
        relevantReports.forEach((report) => {
          const child = childLookup.get(report.childId);
          if (child?.ageGroup?.id) {
            allowedAgeGroupIds.add(child.ageGroup.id);
          }
        });
      }

      return reportAgeGroups
        .filter((ag) => allowedAgeGroupIds.has(ag?.id!))
        .map((ag, idx) => ({
          id: idx,
          label: ag?.name ?? 'Unknown',
          value: ag?.id!,
        }));
    }, [
      selectedPeriod,
      manualClassroom,
      filteredClassroomOptions,
      allReportsForYear,
      availableClassrooms,
      children,
      reportAgeGroups,
    ]);

    // ────────────────────────────────────────────────
    // Resolved selections (auto-select if only one option)
    // ────────────────────────────────────────────────

    const selectedClassroom = useMemo(() => {
      if (filteredClassroomOptions.length === 1)
        return filteredClassroomOptions[0].value;
      return manualClassroom;
    }, [filteredClassroomOptions, manualClassroom]);

    const selectedAgeGroup = useMemo(() => {
      if (filteredAgeGroupOptions.length === 1)
        return filteredAgeGroupOptions[0].value;
      return manualAgeGroup;
    }, [filteredAgeGroupOptions, manualAgeGroup]);

    // ────────────────────────────────────────────────
    // Navigation logic
    // ────────────────────────────────────────────────

    const showClassroomStep = filteredClassroomOptions.length > 1;
    const showAgeGroupStep = filteredAgeGroupOptions.length > 1;

    const canProceed = {
      period: !!selectedPeriod,
      classroom: !!selectedClassroom,
      ageGroup: selectedAgeGroup !== undefined,
    };

    const goToReport = () => {
      if (
        !selectedPeriod ||
        !selectedClassroom ||
        selectedAgeGroup === undefined
      )
        return;

      history.replace(ROUTES.PROGRESS_VIEW_REPORTS_SUMMARY, {
        reportPeriodId: selectedPeriod,
        ageGroupId: selectedAgeGroup,
        classroomGroupId: selectedClassroom,
      });
    };

    const handleNext = () => {
      if (activeStepKey === ChildProgressSummarySteps.reportingPeriod) {
        if (showClassroomStep) {
          goToStep(ChildProgressSummarySteps.classroom);
        } else if (showAgeGroupStep) {
          goToStep(ChildProgressSummarySteps.ageRange);
        } else {
          goToReport();
        }
      } else if (activeStepKey === ChildProgressSummarySteps.classroom) {
        if (showAgeGroupStep) {
          goToStep(ChildProgressSummarySteps.ageRange);
        } else {
          goToReport();
        }
      } else if (activeStepKey === ChildProgressSummarySteps.ageRange) {
        goToReport();
      }
    };

    const handleBack = () => {
      if (activeStepKey === ChildProgressSummarySteps.reportingPeriod) {
        history.push(ROUTES.CLASSROOM.ROOT, { activeTabIndex: 2 });
      } else if (canGoBack()) {
        goBackOneStep();
      }
    };

    // ────────────────────────────────────────────────
    // Render
    // ────────────────────────────────────────────────

    return (
      <StepViewer
        title="Child progress summary"
        onBack={handleBack}
        onClose={() =>
          history.push(ROUTES.CLASSROOM.ROOT, { activeTabIndex: 2 })
        }
        activeStep={activeStepKey}
      >
        <Step
          stepKey={ChildProgressSummarySteps.reportingPeriod}
          viewBannerWapper={true}
        >
          <div className={'h-full bg-white px-4 pt-2 pb-4'}>
            <Typography
              color="textMid"
              text="Choose reporting period"
              type="h3"
              className="mb-4 mt-4"
            />

            <CoreRadioGroup
              options={periodOptions}
              currentValue={selectedPeriod}
              colour="quatenary"
              selectedOptionBackgroundColor="uiBg"
              onChange={(val) => {
                setSelectedPeriod(val);
                // Reset downstream manual selections when period changes
                setManualClassroom(undefined);
                setManualAgeGroup(undefined);
              }}
            />

            <Button
              icon="ArrowCircleRightIcon"
              text="Next"
              type="filled"
              color="quatenary"
              textColor="white"
              onClick={handleNext}
              disabled={!canProceed.period}
              className="mb-4 mt-auto w-full"
            />
          </div>
        </Step>

        {showClassroomStep && (
          <Step
            stepKey={ChildProgressSummarySteps.classroom}
            viewBannerWapper={true}
          >
            <div className={'h-full bg-white px-4 pt-2 pb-4'}>
              <Typography
                color="textMid"
                text="Choose a class to view"
                type="h3"
                className="mb-4 mt-4"
              />

              <CoreRadioGroup
                options={filteredClassroomOptions}
                currentValue={selectedClassroom}
                colour="quatenary"
                selectedOptionBackgroundColor="uiBg"
                onChange={(val) => {
                  setManualClassroom(val);
                  // Reset age group when classroom changes
                  setManualAgeGroup(undefined);
                }}
              />

              <Button
                icon="ArrowCircleRightIcon"
                text="Next"
                type="filled"
                color="quatenary"
                textColor="white"
                onClick={handleNext}
                disabled={!canProceed.classroom}
                className="mb-4 mt-auto w-full"
              />
            </div>
          </Step>
        )}

        {showAgeGroupStep && (
          <Step
            stepKey={ChildProgressSummarySteps.ageRange}
            viewBannerWapper={true}
          >
            <div className={'h-full bg-white px-4 pt-2 pb-4'}>
              <Typography
                color="textMid"
                text="Choose an age range to view"
                type="h3"
                className="mb-4 mt-4"
              />

              <CoreRadioGroup
                options={filteredAgeGroupOptions}
                currentValue={selectedAgeGroup}
                colour="quatenary"
                selectedOptionBackgroundColor="uiBg"
                onChange={(v: number) => setManualAgeGroup(v)}
              />

              <Button
                icon="ArrowCircleRightIcon"
                text="Next"
                type="filled"
                color="quatenary"
                textColor="white"
                onClick={handleNext}
                disabled={!canProceed.ageGroup}
                className="mb-4 mt-auto w-full"
              />
            </div>
          </Step>
        )}
      </StepViewer>
    );
  };
