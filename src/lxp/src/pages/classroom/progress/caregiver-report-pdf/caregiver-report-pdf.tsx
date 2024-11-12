import { ProgressCaregiverReportSummaryPage } from './caregiver-report-pdf-1-summary';
import { ProgressCaregiverReportSkillsPage } from './caregiver-report-pdf-2-skills';
import { ProgressCaregiverReportWorkingOnPage } from './caregiver-report-pdf-3-working-on';
import { ProgressCaregiverReportBuildingPage } from './caregiver-report-pdf-4-building';
import { ProgressCaregiverResourcesPage } from './caregiver-report-pdf-5-resources';
import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { progressTrackingSelectors } from '@/store/progress-tracking';
import { ProgressCaregiverReportWorkingOnNonePage } from './caregiver-report-pdf-3-working-on-none';
import { ProgressCaregiverReportBuildingNonePage } from './caregiver-report-pdf-4-building-none';
import { getProgressAgeGroupForChild } from '@/utils/child/child-progress-report.utils';
import { useProgressForChild } from '@/hooks/useProgressForChild';

export type ProgressCaregiverReportPdfProps = {
  childId: string;
  reportId: string;
};

export const ProgressCaregiverReportPdf: React.FC<
  ProgressCaregiverReportPdfProps
> = ({ childId, reportId }) => {
  const { child, detailedReports } = useProgressForChild(childId);

  const report = detailedReports.find((x) => x.id === reportId)!;

  const ageGroups = useSelector(
    progressTrackingSelectors.getProgressAgeGroups()
  );

  const categories = useSelector(
    progressTrackingSelectors.getProgressTrackingCategories()
  );

  const skillsByCategory = useMemo(() => {
    return categories
      .filter((x) =>
        report.skillObservations.some((y) => y.categoryId === x.id)
      )
      .map((category) => {
        return {
          ...category,
          skills: report.skillObservations.filter(
            (x) => x.categoryId === category.id
          ),
        };
      });
  }, [categories, report]);

  const skillsToWorkOnByCategory = useMemo(() => {
    return categories
      .filter((x) =>
        report.skillObservations.some((y) => y.categoryId === x.id)
      )
      .map((category) => {
        return {
          ...category,
          skills: report.skillsToWorkOn.filter(
            (x) => x.categoryId === category.id
          ),
        };
      });
  }, [categories, report]);

  const splitSkillsPage =
    report.skillObservations.reduce(
      (count, skill) => count + (skill.isPositive ? 1 : 0),
      0
    ) > 20;
  const splitWorkingOnPage =
    report.skillObservations.reduce(
      (count, skill) => count + (skill.isNegative ? 1 : 0),
      0
    ) > 20;

  const totalPages =
    5 + (splitSkillsPage ? 1 : 0) + (splitWorkingOnPage ? 1 : 0);

  const ageGroup = getProgressAgeGroupForChild(
    report.reportingPeriodEndDate,
    child!,
    ageGroups
  );

  return (
    <>
      <ProgressCaregiverReportSummaryPage
        ageInMonths={report.ageInMonthsAtReport || 0}
        childEnjoys={report.childEnjoys || ''}
        goodProgressWith={report.goodProgressWith || ''}
        howCanCaregiverSupport={report.howCanCaregiverSupport!}
        childFirstName={child?.user?.firstName || ''}
        childFullName={`${child?.user?.firstName || ''} ${
          child?.user?.surname || ''
        }`}
        classroomName={report.classroomName || ''}
        practitionerName={report.practitionerName || ''}
        principalName={report.principalName || ''}
        principalPhoneNumber={report.principalPhoneNumber || ''}
        reportingPeriodEndDate={new Date(report.reportingPeriodEndDate)}
        totalPages={totalPages}
      />

      <div className="mt-12">
        <ProgressCaregiverReportSkillsPage
          childFirstName={child?.user?.firstName || ''}
          reportingPeriodEndDate={new Date(report.reportingPeriodEndDate)}
          skillsByCategory={
            splitSkillsPage ? skillsByCategory.slice(0, 2) : skillsByCategory
          }
          pageNumber={2}
          totalPages={totalPages}
        />
      </div>
      {splitSkillsPage && (
        <div className="mt-12">
          <ProgressCaregiverReportSkillsPage
            childFirstName={child?.user?.firstName || ''}
            reportingPeriodEndDate={new Date(report.reportingPeriodEndDate)}
            skillsByCategory={skillsByCategory.slice(2, 4)}
            pageNumber={3}
            totalPages={totalPages}
          />
        </div>
      )}

      {!!report.skillsToWorkOn.length && (
        <div className="mt-12">
          <ProgressCaregiverReportWorkingOnPage
            childFirstName={child?.user?.firstName || ''}
            reportingPeriodEndDate={new Date(report.reportingPeriodEndDate)}
            pageNumber={splitSkillsPage ? 4 : 3}
            totalPages={totalPages}
            skillsByCategory={skillsToWorkOnByCategory}
          />
        </div>
      )}
      {!report.skillsToWorkOn.length && (
        <div className="mt-12">
          <ProgressCaregiverReportWorkingOnNonePage
            childFirstName={child?.user?.firstName || ''}
            reportingPeriodEndDate={new Date(report.reportingPeriodEndDate)}
            pageNumber={splitSkillsPage ? 4 : 3}
            totalPages={totalPages}
            ageGroupName={ageGroup!.name}
            howToSupport={report.howToSupport || ''}
          />
        </div>
      )}

      {!!report.skillsToWorkOn.length && (
        <>
          <div className="mt-12">
            <ProgressCaregiverReportBuildingPage
              childFirstName={child?.user?.firstName || ''}
              reportingPeriodEndDate={new Date(report.reportingPeriodEndDate)}
              skillsByCategory={
                splitWorkingOnPage
                  ? skillsByCategory.slice(0, 2)
                  : skillsByCategory
              }
              pageNumber={splitWorkingOnPage ? totalPages - 2 : totalPages - 1}
              totalPages={totalPages}
            />
          </div>
          {splitWorkingOnPage && (
            <div className="mt-12">
              <ProgressCaregiverReportBuildingPage
                childFirstName={child?.user?.firstName || ''}
                reportingPeriodEndDate={new Date(report.reportingPeriodEndDate)}
                skillsByCategory={skillsByCategory.slice(2, 4)}
                pageNumber={totalPages - 1}
                totalPages={totalPages}
              />
            </div>
          )}
        </>
      )}
      {!report.skillsToWorkOn.length && (
        <div className="mt-12">
          <ProgressCaregiverReportBuildingNonePage
            childFirstName={child?.user?.firstName || ''}
            reportingPeriodEndDate={new Date(report.reportingPeriodEndDate)}
            pageNumber={splitSkillsPage ? 4 : 3}
            totalPages={totalPages}
            ageGroupName={ageGroup!.name}
          />
        </div>
      )}

      <div className="mt-12">
        <ProgressCaregiverResourcesPage
          childFirstName={child?.user?.firstName || ''}
          reportingPeriodEndDate={new Date(report.reportingPeriodEndDate)}
          pageNumber={totalPages}
          totalPages={totalPages}
        />
      </div>
    </>
  );
};
