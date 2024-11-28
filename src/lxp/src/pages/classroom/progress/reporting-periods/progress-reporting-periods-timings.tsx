import { ChildProgressReportPeriodDto } from '@/models/classroom/classroom.dto';
import { Alert, DatePicker, Divider, Typography } from '@ecdlink/ui';
import { differenceInDays, format } from 'date-fns';
import { useMemo } from 'react';

export type ProgressReportingPeriodsTimingsProps = {
  reportingPeriods: ChildProgressReportPeriodDto[];
  setReportingPeriods: (input: ChildProgressReportPeriodDto[]) => void;
};

export const ProgressReportingPeriodsTimings: React.FC<
  ProgressReportingPeriodsTimingsProps
> = ({ reportingPeriods, setReportingPeriods }) => {
  // Logic to get min/max date for each is bascially to loop back/forward through other dates
  // until we get the first one with a value, otherwise it's the beginning or end of the year
  // Save all dates in order, so we can easily check for previous/next date filled in

  const sequencedDates = useMemo(() => {
    let dates: string[] = [];
    reportingPeriods.forEach((x) => {
      dates.push(x.startDate);
      dates.push(x.endDate);
    });

    return dates;
  }, [reportingPeriods]);

  // Get previous date from our starting point otherwise start of year if none are found
  const getPreviousDate = (index: number, isStartDate: boolean) => {
    const sequencedDateIndex = index * 2 + (isStartDate ? 0 : 1);

    for (let i = sequencedDateIndex - 1; i >= 0; i--) {
      if (!!sequencedDates[i]) {
        var date = new Date(sequencedDates[i]);
        date.setDate(date.getDate() + 1);
        return date;
      }
    }

    return new Date(new Date().getFullYear(), 0, 1);
  };

  // Get next date from our starting point otherwise end of year if none are found
  const getNextDate = (index: number, isStartDate: boolean) => {
    const sequencedDateIndex = index * 2 + (isStartDate ? 0 : 1);
    for (let i = sequencedDateIndex + 1; i < sequencedDates.length; i++) {
      if (!!sequencedDates[i]) {
        var date = new Date(sequencedDates[i]);
        date.setDate(date.getDate() - 1);
        return date;
      }
    }

    return new Date(new Date().getFullYear(), 11, 31);
  };

  return (
    <>
      <Typography
        className="mt-4"
        color="textDark"
        text={'Choose the start & end dates for each report'}
        type={'h2'}
      />

      <Alert
        className="mt-4"
        type="info"
        title={`Child progress reports can be created within the selected start & end dates.`}
        list={[
          'However, practitioners can add child progress observations at any time.',
        ]}
      />

      <div className="mb-4">
        {reportingPeriods.map((reportingPeriod, index) => (
          <div key={`period-${index}`}>
            <Divider className="mt-4" dividerType="dashed" />
            <Typography
              color="textDark"
              text={`Reporting period ${index + 1}`}
              type={'h3'}
            />
            <Typography
              className="mt-2"
              color="textDark"
              text={'Start date'}
              type={'h4'}
            />
            <Typography
              className="mt-2 mb-2"
              color="textMid"
              text={
                'What is the first day that progress reports can be created?'
              }
              type={'body'}
            />
            <DatePicker
              placeholderText={`Please select a date`}
              wrapperClassName="text-left"
              className="text-textMid bg-uiBg mt-2 mr-4"
              selected={
                !!reportingPeriod.startDate
                  ? new Date(reportingPeriod.startDate)
                  : undefined
              }
              onChange={(date: Date | null) => {
                setReportingPeriods(
                  reportingPeriods.map((r, i) =>
                    i === index
                      ? {
                          ...r,
                          startDate: !!date
                            ? new Date(
                                date.getFullYear(),
                                date.getMonth(),
                                date.getDate(),
                                12
                              ).toString()
                            : '',
                        }
                      : r
                  )
                );
              }}
              dateFormat="EEE, dd MMM yyyy"
              minDate={getPreviousDate(index, true)}
              maxDate={getNextDate(index, true)}
              withPortal={true}
            />
            <Typography
              className="mt-2"
              color="textDark"
              text={'End date'}
              type={'h4'}
            />
            <Typography
              className="mt-2 mb-2"
              color="textMid"
              text={'Choose the deadline'}
              type={'body'}
            />
            <DatePicker
              placeholderText={`Please select a date`}
              wrapperClassName="text-left"
              className="text-textMid bg-uiBg mt-2 mr-4"
              selected={
                !!reportingPeriod.endDate
                  ? new Date(reportingPeriod.endDate)
                  : undefined
              }
              onChange={(date: Date | null) => {
                setReportingPeriods(
                  reportingPeriods.map((r, i) =>
                    i === index
                      ? {
                          ...r,
                          endDate: !!date
                            ? new Date(
                                date.getFullYear(),
                                date.getMonth(),
                                date.getDate(),
                                12
                              ).toString()
                            : '',
                        }
                      : r
                  )
                );
              }}
              dateFormat="EEE, dd MMM yyyy"
              minDate={getPreviousDate(index, false)}
              maxDate={getNextDate(index, false)}
              withPortal={true}
            />

            {!!reportingPeriod.startDate &&
              !!reportingPeriod.endDate &&
              differenceInDays(
                new Date(reportingPeriod.endDate),
                new Date(reportingPeriod.startDate)
              ) < 21 && (
                <Alert
                  className="mt-4"
                  type={'warning'}
                  title={`Report ${
                    index + 1
                  } start and end dates are very close together!`}
                  list={[
                    `Check the dates - you might not have enough time to finish all reports between ${format(
                      new Date(reportingPeriod.startDate),
                      'd MMM'
                    )} - ${format(
                      new Date(reportingPeriod.endDate),
                      'd MMM'
                    )}.`,
                  ]}
                />
              )}
          </div>
        ))}
      </div>
    </>
  );
};
