import { Button, StepItem, Typography } from '@ecdlink/ui';
import { Maybe, PractitionerTimeLine, Visit } from '@ecdlink/graphql';
import { CalendarIcon } from '@heroicons/react/solid';

export const dateOptions: Intl.DateTimeFormatOptions = {
  year: 'numeric',
  month: 'short',
  day: 'numeric',
};

export const filterVisit = (visit: Maybe<Visit>) =>
  !visit?.attended && typeof visit?.visitType?.order !== 'undefined';

export const sortVisit = (visitA?: Maybe<Visit>, visitB?: Maybe<Visit>) =>
  (Number(visitA?.visitType?.order) || 0) -
  (Number(visitB?.visitType?.order) || 0);

export const getStepType = (color?: Maybe<string>): StepItem['type'] => {
  if (!color) return 'todo';

  switch (color.toLowerCase()) {
    case 'success':
      return 'completed';
    case 'warning':
      return 'inProgress';
    case 'error':
      return 'inProgress';
    default:
      return 'todo';
  }
};

export const getStepDate = (date?: string) =>
  !!date ? `By ${new Date(date).toLocaleDateString('en-ZA', dateOptions)}` : '';

export const setStep = (
  status?: Maybe<string>,
  date?: string,
  color?: Maybe<string>
) => {
  if (!!status) {
    return {
      title: status,
      subTitle: getStepDate(date),
      type: getStepType(color),
      extraData: { date: date ? new Date(date) : null },
    };
  }

  return {};
};

export const timelineSteps = (timeline: PractitionerTimeLine): StepItem[] => {
  const steps: (StepItem<{ date?: Date }> | {})[] = [];

  steps.push(
    setStep(
      timeline.clubMeetingDate1Status,
      timeline.clubMeetingDate1,
      timeline?.clubMeetingDate1Color
    )
  );
  steps.push(
    setStep(
      timeline.clubMeetingDate2Status,
      timeline.clubMeetingDate2,
      timeline?.clubMeetingDate2Color
    )
  );
  steps.push(
    setStep(
      timeline.clubMeetingDate3Status,
      timeline.clubMeetingDate3,
      timeline?.clubMeetingDate3Color
    )
  );
  steps.push(
    setStep(
      timeline.coachingCircle1Status,
      timeline.coachingCircleDate1,
      timeline?.coachingCircle1Color
    )
  );
  steps.push(
    setStep(
      timeline.coachingCircle2Status,
      timeline.coachingCircleDate2,
      timeline?.coachingCircle2Color
    )
  );
  steps.push(
    setStep(
      timeline.coachingCircle3Status,
      timeline.coachingCircleDate3,
      timeline?.coachingCircle3Color
    )
  );
  steps.push(
    setStep(
      timeline.coachingCircle4Status,
      timeline.coachingCircleDate4,
      timeline?.coachingCircle4Color
    )
  );
  steps.push(
    setStep(
      timeline.consolidationMeetingStatus,
      timeline.consolidationMeetingDate,
      timeline?.consolidationMeetingColor
    )
  );
  steps.push(
    setStep(
      timeline.firstAidCourseStatus,
      timeline.firstAidDate,
      timeline?.firstAidCourseColor
    )
  );
  steps.push(
    setStep(
      timeline.smartSpaceLicenseStatus,
      timeline.smartSpaceLicenseDate,
      timeline?.smartSpaceLicenseColor
    )
  );
  steps.push(
    setStep(
      timeline.starterLicenseStatus,
      timeline.starterLicenseDate,
      timeline?.starterLicenseColor
    )
  );

  const formattedSteps = steps
    .filter((object) => Object.keys(object).length !== 0)
    .sort(
      // @ts-ignore
      (stepA, stepB) => (stepA.extraData?.date || null) - stepB?.extraData?.date
    ) as StepItem<{ date: Date }>[];

  formattedSteps.push({
    title: 'Pre-PQA site visits',
    subTitle: `By 10 Apr 2020`,
    type: 'todo',
    showAccordion: true,
    accordionContent: (
      <>
        {timeline.siteVisits
          ?.filter(filterVisit)
          ?.sort(sortVisit)
          ?.map((visit, index) => {
            const previousVisit =
              index > 1 ? timeline.siteVisits?.[index - 1] : undefined;
            const title =
              (index === 0 && timeline.prePQAVisitDate1Status) ||
              (index === 1 && timeline.prePQAVisitDate2Status) ||
              visit?.visitType?.description ||
              'Visit';
            return (
              <div className="my-4">
                <div className="relative flex items-center gap-1">
                  <span>
                    <CalendarIcon className="text-primary h-4 w-4" />
                  </span>
                  <Typography
                    type="body"
                    color="textDark"
                    className="w-6/12 font-bold"
                    text={title}
                  />
                  {((visit?.visitType?.order === 1 && !visit.attended) ||
                    (!!previousVisit?.attended && !visit?.attended)) && (
                    <Button
                      style={{
                        position: 'absolute',
                        right: -36,
                      }}
                      className="z-50 w-32"
                      type="outlined"
                      color="primary"
                      text="Schedule"
                      icon="CalendarIcon"
                      // TODO: add integration
                      onClick={() => {}}
                    />
                  )}
                </div>
                <Typography
                  type="body"
                  color="textMid"
                  text={
                    !!visit?.plannedVisitDate
                      ? `By ${new Date(
                          visit.plannedVisitDate
                        ).toLocaleDateString('en-ZA', dateOptions)}`
                      : ''
                  }
                />
              </div>
            );
          })}
      </>
    ),
  });

  return formattedSteps;
};
