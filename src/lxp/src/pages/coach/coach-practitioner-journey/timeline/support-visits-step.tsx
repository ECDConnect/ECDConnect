import { Visit, PractitionerTimeline } from '@ecdlink/graphql';
import { dateOptions, getStepType } from './timeline-steps';
import { generalSupportVisitTypes } from '../coach-practitioner-journey.types';
import { ClipboardCheckIcon, PhoneIcon } from '@heroicons/react/solid';
import { Button, Typography } from '@ecdlink/ui';
import { useSelector } from 'react-redux';
import { practitionerSelectors } from '@/store/practitioner';

interface SupportVisitsProps {
  isLoading: boolean;
  timeline: PractitionerTimeline;
  isOnline: boolean;
  practitionerId: string;
  onView: (visit: Visit) => void;
  onStartRequestedSupportVisit: (visitId: string) => void;
}

export const SupportVisits = ({
  timeline,
  isOnline,
  isLoading,
  practitionerId,
  onView,
  onStartRequestedSupportVisit,
}: SupportVisitsProps) => {
  const practitioner = useSelector(
    practitionerSelectors.getPractitionerByUserId(practitionerId)
  );
  const mergedVisits = [...(timeline?.supportVisits ?? [])];
  if (
    !!timeline?.requestedCoachVisits &&
    timeline?.requestedCoachVisits.length > 0
  ) {
    if (!!timeline?.supportVisits && timeline?.supportVisits.length > 0) {
      mergedVisits.push(
        ...timeline.requestedCoachVisits.filter(
          (v) =>
            !!v && !timeline.supportVisits?.find((x) => !!x && x.id === v.id)
        )
      );
    } else {
      mergedVisits.push(...timeline.requestedCoachVisits);
    }
  }

  return (
    <>
      {mergedVisits?.map((item, index) => (
        <div className="my-4" key={item?.id}>
          <div className="relative flex items-center gap-1">
            {item?.visitType?.name === generalSupportVisitTypes.call ? (
              <span>
                <PhoneIcon className="text-primary h-4 w-4" />
              </span>
            ) : (
              <span>
                <ClipboardCheckIcon className="text-primary h-4 w-4" />
              </span>
            )}
            <Typography
              type="body"
              color="textDark"
              className="w-6/12 font-bold"
              text={
                item?.visitType?.name?.includes('requested')
                  ? `${practitioner?.user?.firstName} requested a ${
                      item?.visitType?.name ===
                      generalSupportVisitTypes.practitioner_visit
                        ? 'visit'
                        : 'call'
                    }`
                  : !!item?.eventId
                  ? `Scheduled ${item?.visitType?.description || ''}`
                  : item?.visitType?.description || ''
              }
            />
            {!item?.attended &&
              (!mergedVisits[index - 1] ||
                !!mergedVisits[index - 1]?.attended) && (
                <Button
                  style={{
                    position: 'absolute',
                    right: -36,
                  }}
                  className="z-50 w-24"
                  type="filled"
                  color="primary"
                  textColor="white"
                  text="Start"
                  icon="ArrowCircleRightIcon"
                  isLoading={isLoading}
                  disabled={isLoading}
                  onClick={() => onStartRequestedSupportVisit?.(item?.id || '')}
                />
              )}
            {!!item?.attended && isOnline && (
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
                onClick={() => onView(item)}
              />
            )}
          </div>
          <Typography
            type="body"
            // TODO: add schedule integration
            color={getStepType(String('Success'))?.color || 'textMid'}
            text={
              !!item?.plannedVisitDate
                ? `${item.attended ? '' : 'By '}${new Date(
                    item.plannedVisitDate
                  ).toLocaleDateString('en-ZA', dateOptions)}`
                : ''
            }
          />
        </div>
      ))}
    </>
  );
};
