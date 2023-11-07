import { useAppDispatch } from '@/store';
import {
  progressTrackingSelectors,
  progressTrackingThunkActions,
} from '@/store/progress-tracking';
import { useCallback, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { jsPDF } from 'jspdf';
import { Button, Card, Typography, classNames, renderIcon } from '@ecdlink/ui';
const { usePDF } = require('react-to-pdf');

export const PractitionerPdfSummaryReport = () => {
  const appDispatch = useAppDispatch();
  const progressSummary = useSelector(
    progressTrackingSelectors?.getPractitionerProgressReportSummary
  );
  const { toPDF, targetRef } = usePDF({
    filename: 'practitioner-progress-summary-report.pdf',
  });

  console.log({ progressSummary });

  const fetchData = useCallback(async () => {
    await appDispatch(
      progressTrackingThunkActions.getPractitionerProgressReportSummary({
        reportingPeriod: 'Nov 2023',
      })
    );
  }, [appDispatch]);

  useEffect(() => {
    fetchData();
  }, []);

  // Default export is a4 paper, portrait, using millimeters for units
  // const doc = new jsPDF();

  // doc.text("Hello world!", 10, 10);
  // doc.save("a4.pdf");

  return (
    <div>
      <div ref={targetRef}>
        {progressSummary?.classSummaries?.map((item) => {
          return (
            <div className="p-8">
              <div className="flex justify-between">
                <Typography
                  className={'mr-1'}
                  type={'h1'}
                  color={'textDark'}
                  text={`${progressSummary?.reportingPeriod} Progress Summary`}
                />
                <div>
                  <div className="flex">
                    <Typography
                      className={'mr-1'}
                      type={'small'}
                      weight="bold"
                      color={'textDark'}
                      text={`Class:`}
                    />
                    <Typography
                      className={'mr-1'}
                      type={'small'}
                      color={'textDark'}
                      text={`${item?.className} (${item?.childCount} children)`}
                    />
                  </div>
                  <div className="flex">
                    <Typography
                      className={'mr-1'}
                      type={'small'}
                      weight="bold"
                      color={'textDark'}
                      text={`Practitioner:`}
                    />
                    <Typography
                      className={'mr-1'}
                      type={'small'}
                      color={'textDark'}
                      text={`${item?.practitionerFullName}`}
                    />
                  </div>
                </div>
              </div>
              <div className="pt-8">
                <Typography
                  className={'mr-1'}
                  type={'h2'}
                  weight="bold"
                  color={'textDark'}
                  text={`Number of children working on each skill`}
                />
                {item?.categories?.map((subItem) => {
                  return (
                    <div className="pt-4">
                      <Typography
                        className={'mr-1 pb-4'}
                        type={'h2'}
                        weight="bold"
                        color={'textDark'}
                        text={`${subItem?.name}`}
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
      <Button type="filled" color="primary" onClick={toPDF}>
        Download PDF
      </Button>
    </div>
  );
};
