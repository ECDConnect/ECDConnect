import { Maybe, PractitionerTimeline, Visit } from '@ecdlink/graphql';
import { dateOptions, getStepType, sortVisit } from './timeline-steps';
import { CalendarIcon } from '@heroicons/react/solid';
import { Button, Typography } from '@ecdlink/ui';

interface PrePqaVisitsProps {
  isLoading: boolean;
  timeline: PractitionerTimeline;
  isOnline: boolean;
  onView: (visit: Visit) => void;
  visits?: Maybe<Visit>[];
}

export const PrePqaVisits = ({
  isLoading,
  isOnline,
  onView,
  timeline,
  visits,
}: PrePqaVisitsProps) => (
  <>
    {timeline.prePQASiteVisits
      ?.filter(
        (visit: Maybe<Visit>) => typeof visit?.visitType?.order !== 'undefined'
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
          (visit?.visitType?.order === 1 && !visit.attended) ||
          (!!previousVisit?.attended && !visit?.attended);

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
                  ? `${visit?.attended ? '' : 'By '}${new Date(
                      visit?.attended
                        ? visit.insertedDate
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
