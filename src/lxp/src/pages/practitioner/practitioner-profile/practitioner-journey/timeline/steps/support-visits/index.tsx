import { PractitionerTimeline } from '@ecdlink/graphql';
import { ClipboardCheckIcon, PhoneIcon } from '@heroicons/react/solid';
import { Button, Typography } from '@ecdlink/ui';
import { generalSupportVisitTypes } from '@/pages/coach/coach-practitioner-journey/coach-practitioner-journey.types';
import { dateOptions, getStepType } from '../../utils';
import { ViewEvent } from '../../timeline-steps';

interface SupportVisitsProps {
  isLoading: boolean;
  timeline: PractitionerTimeline;
  isOnline: boolean;
  onView: (event: ViewEvent) => void;
}

export const SupportVisits = ({
  timeline,
  isOnline,
  isLoading,
  onView,
}: SupportVisitsProps) => {
  const mergedVisits = [
    ...(timeline?.supportVisits ?? []),
    ...(timeline?.requestedCoachVisits ?? []),
  ];

  return (
    <>
      {mergedVisits?.map((item) => (
        <div className="my-4" key={item?.id}>
          <div className="relative flex items-center gap-1">
            {item?.visitType?.name === generalSupportVisitTypes.call ||
            item?.visitType?.name ===
              generalSupportVisitTypes.practitioner_call ? (
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
                item?.visitType?.name?.includes('practitioner')
                  ? `Requested ${
                      item?.visitType?.name ===
                      generalSupportVisitTypes.practitioner_call
                        ? 'Call'
                        : 'Visit'
                    }`
                  : item?.visitType?.description || ''
              }
            />
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
                onClick={() =>
                  onView({ visit: item, visitType: 'support-visit' })
                }
              />
            )}
          </div>
          <Typography
            type="body"
            color={getStepType(String('Success'))?.color || 'textMid'}
            text={
              !!item?.insertedDate
                ? `${new Date(item.insertedDate).toLocaleDateString(
                    'en-ZA',
                    dateOptions
                  )}`
                : ''
            }
          />
        </div>
      ))}
    </>
  );
};
