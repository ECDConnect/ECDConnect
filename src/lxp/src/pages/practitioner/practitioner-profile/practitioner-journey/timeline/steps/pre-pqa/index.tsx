import { Maybe, PractitionerTimeline, Visit } from '@ecdlink/graphql';
import { CalendarIcon } from '@heroicons/react/solid';
import { Button, Typography } from '@ecdlink/ui';
import { dateOptions, getStepType, sortVisitByInsertedDate } from '../../utils';
import { ViewEvent } from '../../timeline-steps';

interface PrePqaVisitsProps {
  isLoading: boolean;
  timeline: PractitionerTimeline;
  isOnline: boolean;
  onView: (event: ViewEvent) => void;
}

export const PrePqaVisits = ({
  isLoading,
  isOnline,
  onView,
  timeline,
}: PrePqaVisitsProps) => (
  <>
    {timeline.prePQASiteVisits
      ?.filter(
        (visit: Maybe<Visit>) => typeof visit?.visitType?.order !== 'undefined'
      )
      ?.sort(sortVisitByInsertedDate)
      ?.map((visit, index) => {
        const title =
          (index === 0 && timeline.prePQAVisitDate1Status) ||
          (index === 1 && timeline.prePQAVisitDate2Status) ||
          visit?.visitType?.description ||
          'Visit';

        const color =
          (index === 0 && timeline.prePQAVisitDate1Color) ||
          (index === 1 && timeline.prePQAVisitDate2Color);

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
                  onClick={() => onView({ visit, visitType: 'pre-pqa' })}
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
