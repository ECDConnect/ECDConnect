import { Button, Colours, StepItem, Typography } from '@ecdlink/ui';
import { Maybe, PractitionerTimeline, Visit } from '@ecdlink/graphql';
import { CalendarIcon } from '@heroicons/react/solid';

export const dateOptions: Intl.DateTimeFormatOptions = {
  year: 'numeric',
  month: 'short',
  day: 'numeric',
};

export const filterVisit = (visit: Maybe<Visit>) =>
  !visit?.attended && typeof visit?.visitType?.order !== 'undefined';

export const sortVisit = (visitA?: Maybe<Visit>, visitB?: Maybe<Visit>) => {
  const orderA = Number(visitA?.visitType?.order) || 0;
  const orderB = Number(visitB?.visitType?.order) || 0;
  return orderA - orderB;
};

export const getStepType = (
  color?: Maybe<string>
): { type: StepItem['type']; color?: Colours } => {
  if (!color) return { type: 'todo' };

  switch (color.toLowerCase()) {
    case 'success':
      return { type: 'completed' };
    case 'warning':
      return { type: 'inProgress', color: 'alertDark' };
    case 'error':
      return { type: 'inProgress', color: 'alertDark' };
    default:
      return { type: 'todo' };
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
      inProgressStepIcon:
        (color === 'Warning' || color === 'Error') && 'ExclamationCircleIcon',
      subTitleColor: getStepType(color)?.color || '',
      type: getStepType(color).type,
      extraData: { date: date ? new Date(date) : null },
    } as StepItem;
  }

  return {};
};

export const timelineSteps = (
  timeline: PractitionerTimeline,
  onView: (visit: Visit) => void,
  isLoading: boolean,
  isOnline: boolean,
  visits?: Maybe<Visit>[]
): StepItem[] => {
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
      (
        stepA,
        stepB // TODO: fix type
      ) =>
        // @ts-ignore
        (stepA.extraData?.date?.getTime() || 0) -
        // @ts-ignore
        (stepB.extraData?.date?.getTime() || 0)
    ) as StepItem<{ date: Date }>[];

  if (!!timeline.siteVisits?.length) {
    formattedSteps.push({
      title: 'Pre-PQA site visits',
      subTitle: `By ${
        timeline.prePQAVisitDate1Color === 'Success' &&
        !visits?.some((item) =>
          item?.visitType?.name?.includes('pre_pqa_visit_1')
        )
          ? new Date(
              timeline.siteVisits?.find((item) =>
                item?.visitType?.name?.includes('pre_pqa_visit_2')
              )?.plannedVisitDate
            ).toLocaleDateString('en-ZA', dateOptions)
          : new Date(
              timeline.siteVisits?.find((item) =>
                item?.visitType?.name?.includes('pre_pqa_visit_1')
              )?.plannedVisitDate
            ).toLocaleDateString('en-ZA', dateOptions)
      }`,
      type: timeline.siteVisits?.every((item) => !!item?.attended)
        ? 'completed'
        : 'todo',
      showAccordion: true,
      accordionContent: (
        <>
          {timeline.siteVisits
            ?.filter(
              (visit: Maybe<Visit>) =>
                typeof visit?.visitType?.order !== 'undefined'
            )
            ?.sort(sortVisit)
            ?.map((visit, index) => {
              const previousVisit =
                index > 1 ? timeline.siteVisits?.[index - 1] : undefined;
              const title =
                (index === 0 && timeline.prePQAVisitDate1Status) ||
                (index === 1 && timeline.prePQAVisitDate2Status) ||
                visit?.visitType?.description ||
                'Visit';

              const color =
                (index === 0 && timeline.prePQAVisitDate1Color) ||
                (index === 1 && timeline.prePQAVisitDate2Color);

              const attendedRule =
                (visit?.visitType?.order === 1 && !visit.attended) ||
                (!!previousVisit?.attended && !visit?.attended);

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
                    {visits?.some((item) => item?.id === visit?.id) &&
                      attendedRule && (
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
                    {!!visit?.attended && isOnline && (
                      <Button
                        style={{
                          position: 'absolute',
                          right: -36,
                        }}
                        className="z-50 w-24"
                        type="filled"
                        color="secondaryAccent2"
                        textColor="secondary"
                        text="View"
                        isLoading={isLoading}
                        disabled={isLoading}
                        onClick={() => onView(visit)}
                      />
                    )}
                  </div>
                  <Typography
                    type="body"
                    color={getStepType(String(color))?.color || 'textMid'}
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
  }

  return formattedSteps;
};
