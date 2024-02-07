import { Maybe, PractitionerTimeline, Visit } from '@ecdlink/graphql';
import {
  ScheduleOrStartProps,
  dateOptions,
  getStepType,
  sortVisit,
} from './timeline-steps';
import { CalendarIcon } from '@heroicons/react/solid';
import { Button, Typography } from '@ecdlink/ui';
import {
  getScheduleOrStartButtonIcon,
  getScheduleOrStartButtonText,
  getScheduleOrStartSubTitleText,
} from './utils';
import { visitTypes } from '../coach-practitioner-journey.types';

interface PrePqaVisitsProps {
  currentVisit: Maybe<Visit>;
  isLoading: boolean;
  timeline: PractitionerTimeline;
  isOnline: boolean;
  onView: (visit: Visit) => void;
  visits?: Maybe<Visit>[];
  onStart: (visitName: string) => void;
  onScheduleOrStart: (schedule: ScheduleOrStartProps) => void;
}

export const PrePqaVisits = ({
  currentVisit,
  isLoading,
  isOnline,
  onView,
  timeline,
  visits,
  onStart,
  onScheduleOrStart,
}: PrePqaVisitsProps) => {
  const onClick = (options: ScheduleOrStartProps) => {
    if (!options.visit?.eventId) {
      onScheduleOrStart(options);
    } else {
      onStart(options.visit.visitType?.name as string);
    }
  };

  return (
    <>
      {timeline.prePQASiteVisits
        ?.filter(
          (visit: Maybe<Visit>) =>
            typeof visit?.visitType?.order !== 'undefined'
        )
        ?.sort(sortVisit)
        ?.map((visit, index) => {
          const previousVisit =
            index > 0 ? timeline.prePQASiteVisits?.[index - 1] : undefined;
          const title =
            (index === 0 && timeline.prePQAVisitDate1Status) ||
            (index === 1 && timeline.prePQAVisitDate2Status) ||
            visit?.visitType?.description ||
            'Visit';

          const color =
            (index === 0 && timeline.prePQAVisitDate1Color) ||
            (index === 1 && timeline.prePQAVisitDate2Color);

          const attendedRule =
            !!visit &&
            ((!previousVisit && !visit.attended) ||
              (!!previousVisit?.attended && !visit?.attended));

          return (
            <div className="my-4" key={visit?.id}>
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
                {!!visit && attendedRule && (
                  <Button
                    style={{
                      position: 'absolute',
                      right: -36,
                    }}
                    className="z-50 w-32"
                    type="outlined"
                    color="primary"
                    text={getScheduleOrStartButtonText(visit)}
                    iconPosition="start"
                    icon={getScheduleOrStartButtonIcon(visit)}
                    // TODO: add integration
                    onClick={() =>
                      onClick({
                        visit,
                        visitTypeName: currentVisit?.visitType?.name || '',
                        visitEventId: currentVisit?.eventId,
                        eventType:
                          visit?.visitType?.name ===
                          visitTypes.prePqa.first.name
                            ? visitTypes.prePqa.first.eventType
                            : visitTypes.prePqa.second.eventType,
                        scheduleStartText:
                          visit?.visitType?.name ===
                          visitTypes.prePqa.first.name
                            ? visitTypes.prePqa.first.scheduleStartText
                            : visitTypes.prePqa.second.scheduleStartText,
                      })
                    }
                  />
                )}
                {!!visit?.attended && isOnline && (
                  <Button
                    style={{
                      position: 'absolute',
                      right: -36,
                    }}
                    className="z-50 w-32"
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
                    ? `${getScheduleOrStartSubTitleText(visit)}${new Date(
                        visit.attended
                          ? visit.actualVisitDate
                          : visit.plannedVisitDate
                      ).toLocaleDateString('en-ZA', dateOptions)}`
                    : ''
                }
              />
            </div>
          );
        })}
    </>
  );
};
