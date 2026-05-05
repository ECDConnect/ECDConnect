import { useEffect, useMemo, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router';
import { format } from 'date-fns';
import { Button, Card, Divider, ProgressBar, Typography } from '@ecdlink/ui';

import { classroomsSelectors } from '@/store/classroom';
import { progressTrackingSelectors } from '@/store/progress-tracking';
import { useProgressGenerateSummaryPdfReport as usePdfFromHtml } from '@/hooks/useProgressGenerateSummaryPdfReport';
import { ProgressCaregiverReportPdf } from '../caregiver-report-pdf/caregiver-report-pdf';
import ROUTES from '@/routes/routes';
import { useProgressForChildren } from '@/hooks/useProgressForChildren';

export const ProgressTabReportPeriodsCompleted: React.FC = () => {
  const history = useHistory();
  const shareRef = useRef<HTMLDivElement>(null);

  const { children } = useProgressForChildren(true);

  const reportPeriods = useSelector(
    classroomsSelectors.getAllProgressReportPeriods()
  );
  const allProgressReports = useSelector(
    progressTrackingSelectors.getProgressReports()
  );

  const { asyncGenerateReport } = usePdfFromHtml();
  const [isReportReady, setIsReportReady] = useState(false);
  const [reportPeriodId, setReportPeriodId] = useState<string>('');
  const [reportPeriodDate, setReportPeriodDate] = useState<string>('');
  const [generatedReports, setGeneratedReports] = useState<
    Record<string, boolean>
  >({});
  const [generatingReports, setGeneratingReports] = useState(false);

  /**
   * Calculate progress per report period
   */
  const reportProgress = useMemo(() => {
    const currentYear = new Date().getFullYear();
    return reportPeriods
      .filter((period) =>
        period.startDate
          ? new Date(period.startDate).getFullYear() === currentYear
          : false
      )
      .map((period) => {
        const reports = allProgressReports.filter(
          (r) => r.childProgressReportPeriodId === period.id
        );
        const completed = reports.filter((r) => !!r.dateCompleted).length;
        const percentage = reports.length
          ? Math.ceil((completed / reports.length) * 100)
          : 0;
        return { ...period, percentage };
      });
  }, [reportPeriods, allProgressReports]);

  /**
   * Generate all PDF reports for a given period
   */
  const generateAllReports = async (
    periodId: string,
    periodDateRange: string
  ) => {
    if (!shareRef.current) return;

    setGeneratingReports(true);
    setReportPeriodId(periodId);

    const pdfReports = allProgressReports.filter(
      (x) => x.childProgressReportPeriodId === periodId
    );

    // Initialize all as "not generated"
    setGeneratedReports(
      Object.fromEntries(pdfReports.map((r) => [r.id, false]))
    );

    const reportElements = Array.from(shareRef.current.children).entries();

    for (const [index, element] of reportElements) {
      const report = pdfReports[index];
      if (!report) continue;

      const child = children.find((x) => x.childId === report.childId);

      await asyncGenerateReport(
        element as HTMLElement,
        (element as HTMLElement)?.offsetWidth || 750,
        ` - ${child ? child.childFullName : ''} ${periodDateRange}`
      );

      // Mark report as generated
      setGeneratedReports((prev) => ({
        ...prev,
        [report.id]: true,
      }));
    }

    setGeneratingReports(false);
    setReportPeriodId('');
  };

  /**
   * Label for download button
   */
  const generateButtonLabel = (periodId: string) => {
    const pdfReports = allProgressReports.filter(
      (x) => x.childProgressReportPeriodId === periodId
    );
    const total = pdfReports.length;
    const completed = pdfReports.filter((r) => generatedReports[r.id]).length;

    return generatingReports
      ? `${completed} of ${total} reports generated`
      : 'Download all progress reports';
  };

  /**
   * Hidden report components for PDF generation
   */
  const hiddenReportsForSelectedPeriod = useMemo(() => {
    if (!reportPeriodId) return null;

    return allProgressReports
      .filter((r) => r.childProgressReportPeriodId === reportPeriodId)
      .map((report, index) => (
        <div
          key={`${index}_${report.childId}`}
          style={{ letterSpacing: '0.02px' }}
        >
          <ProgressCaregiverReportPdf
            childId={report.childId}
            reportId={report.id as string}
            onRendered={() => setIsReportReady(true)}
          />
        </div>
      ));
  }, [reportPeriodId, allProgressReports]);

  useEffect(() => {
    if (!reportPeriodId) return;
    generateAllReports(reportPeriodId, reportPeriodDate);
  }, [reportPeriodId]);

  return (
    <div className="mt-2 flex flex-col justify-center p-4">
      <Typography
        color="textDark"
        type="h3"
        text="Your last reporting period for the year is complete!"
      />
      <Typography
        type="small"
        color="textMid"
        text="Review your previous reports below"
      />

      <Divider dividerType="dashed" className="my-2" />

      {reportProgress.map((report, index) =>
        report.id ? (
          <div key={report.id}>
            <Typography
              color="textDark"
              type="h3"
              text={`Report ${index + 1}`}
            />
            <Typography
              type="small"
              color="textMid"
              text={`${format(
                new Date(report.startDate || ''),
                'd MMM'
              )} - ${format(new Date(report.endDate || ''), 'd MMM yyyy')}`}
            />

            <Card className="bg-uiBg mb-4 mt-4 flex rounded-2xl p-4">
              <div className="flex w-full flex-col justify-center">
                <div className="mt-6 flex justify-center">
                  <ProgressBar
                    label={`${report.percentage}%`}
                    subLabel=""
                    hint="Reports completed"
                    value={report.percentage}
                    primaryColour={
                      report.percentage === 100 ? 'successMain' : 'alertMain'
                    }
                    secondaryColour="textLight"
                    textColour="textDark"
                    isHiddenSubLabel
                    className="w-full"
                  />
                </div>
              </div>
            </Card>

            {report.percentage > 0 && (
              <>
                <Button
                  onClick={() => {
                    setReportPeriodId(report.id);
                    setReportPeriodDate(
                      `${format(
                        new Date(report.startDate || ''),
                        'd MMM'
                      )} - ${format(
                        new Date(report.endDate || ''),
                        'd MMM yyyy'
                      )}`
                    );
                  }}
                  className="mt-auto w-full"
                  size="small"
                  color="quatenary"
                  textColor="white"
                  type="filled"
                  isLoading={
                    reportPeriodId === report.id && generatingReports
                      ? true
                      : false
                  }
                  icon={
                    reportPeriodId === report.id && generatingReports
                      ? undefined
                      : 'DownloadIcon'
                  }
                  text={
                    reportPeriodId === report.id
                      ? generateButtonLabel(report.id)
                      : 'Download all progress reports'
                  }
                  disabled={
                    reportPeriodId === report.id ? generatingReports : false
                  }
                />

                <Button
                  onClick={() =>
                    history.replace(
                      ROUTES.PROGRESS_VIEW_REPORTS_SUMMARY_SELECT_CLASSROOM_GROUP_AND_AGE_GROUP,
                      { reportPeriodId: report.id }
                    )
                  }
                  className="mt-4 w-full"
                  size="small"
                  color="quatenary"
                  textColor="quatenary"
                  type="outlined"
                  icon="EyeIcon"
                  text="See Summary"
                />
              </>
            )}

            <Divider dividerType="dashed" className="my-2" />
          </div>
        ) : null
      )}

      {/* Hidden section for PDF rendering */}
      <div hidden ref={shareRef}>
        {hiddenReportsForSelectedPeriod}
      </div>
    </div>
  );
};
