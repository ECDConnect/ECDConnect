import { Button, CoreRadioGroup, Typography } from '@ecdlink/ui';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useHistory, useLocation } from 'react-router';
import { format } from 'date-fns';
import { useSelector } from 'react-redux';
import ROUTES from '@/routes/routes';
import { useProgressForChildren } from '@/hooks/useProgressForChildren';
import { classroomsSelectors } from '@/store/classroom';
import { useOnlineStatus } from '@/hooks/useOnlineStatus';
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
    const { isOnline } = useOnlineStatus();

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

    // Create a mapping from childId to childUserId (assuming children have both 'id' and 'childUserId')
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

    const [selectedPeriod, setSelectedPeriod] = useState<string | undefined>(
      () => {
        // This runs only once – during initial render
        if (routeState?.reportPeriodId) {
          return routeState.reportPeriodId;
        }

        if (availablePeriods?.length === 1) {
          return availablePeriods[0].id;
        }

        if (currentReportingPeriod?.id) {
          return currentReportingPeriod.id;
        }

        return undefined;
      }
    );

    const [selectedClassroom, setSelectedClassroom] = useState<
      string | undefined
    >(() => {
      if (availableClassrooms.length === 1) return availableClassrooms[0].id;
      return undefined;
    });
    const [selectedAgeGroup, setSelectedAgeGroup] = useState<
      number | undefined
    >(undefined);

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

    // FILTERED CLASSROOMS (based on selected period)
    const filteredClassroomOptions = useMemo(() => {
      // Base: all classrooms that have at least one child with any report
      let baseClassrooms = availableClassrooms;

      // If a period is selected → filter classrooms that actually have reports in this period
      if (selectedPeriod) {
        // Find all childUserIds that have a report in the selected period (via mapping)
        const childrenWithReportInPeriod = new Set(
          allReportsForYear
            .filter(
              (report) => report.childProgressReportPeriodId === selectedPeriod
            )
            .map((report) => childIdToChildUserId.get(report?.childId))
            .filter((userId): userId is string => userId !== undefined)
        );

        // Keep only classrooms that have at least one learner with a report in this period
        baseClassrooms = availableClassrooms.filter((group) =>
          group.learners.some((learner) =>
            childrenWithReportInPeriod.has(learner.childUserId)
          )
        );
      }

      // Map to radio group options
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

    // FILTERED AGE GROUPS (based on selected period + selected classroom)
    const filteredAgeGroupOptions = useMemo(() => {
      let relevantReports = allReportsForYear;

      if (selectedPeriod) {
        relevantReports = relevantReports.filter(
          (r) => r.childProgressReportPeriodId === selectedPeriod
        );
      }

      const childLookup = new Map(children.map((c) => [c.childId, c]));

      const allowedAgeGroupIds = new Set<number>();

      if (selectedClassroom) {
        const classroom = availableClassrooms.find(
          (g) => g.id === selectedClassroom
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

      // Filter the known age groups to only those that appear
      return reportAgeGroups
        .filter((ag) => allowedAgeGroupIds.has(ag?.id!))
        .map((ag, idx) => ({
          id: idx,
          label: ag?.name! ?? 'Unknown',
          value: ag?.id!,
        }));
    }, [
      selectedPeriod,
      selectedClassroom,
      allReportsForYear,
      availableClassrooms,
      children,
      reportAgeGroups,
    ]);

    // Auto-select when there's exactly one option — in useEffect
    useEffect(() => {
      if (filteredClassroomOptions.length === 1) {
        setSelectedClassroom(
          (prev) => prev ?? filteredClassroomOptions[0].value
        );
      }
    }, [filteredClassroomOptions]);

    useEffect(() => {
      if (filteredAgeGroupOptions.length === 1) {
        const onlyOption = filteredAgeGroupOptions[0];
        // Only set if different — prevents loop
        setSelectedAgeGroup((current) => {
          if (current === onlyOption.value) return current;
          return onlyOption.value;
        });
      }
    }, [filteredAgeGroupOptions]);

    // ────────────────────────────────────────────────
    // Navigation logic
    // ────────────────────────────────────────────────

    const showClassroomStep = filteredClassroomOptions.length > 1; // Updated to use filtered options
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
              onChange={setSelectedClassroom}
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
          </Step>
        )}

        {showAgeGroupStep && (
          <Step
            stepKey={ChildProgressSummarySteps.ageRange}
            viewBannerWapper={true}
          >
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
              onChange={(v: number) => setSelectedAgeGroup(v)}
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
          </Step>
        )}
      </StepViewer>
    );
  };
