import { Button, Colours, StepItem, Typography } from '@ecdlink/ui';
import { Maybe, TraineeOnBoardTimeline, Visit } from '@ecdlink/graphql';
import {
  CalendarIcon,
  PhoneIcon,
  ClipboardCheckIcon,
} from '@heroicons/react/solid';
// import { generalSupportVisitTypes } from './coach-practitioner-journey.types';

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
    case 'consolidation meeting scheduled':
      return { type: 'inProgress' };
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
        (status === 'Consolidation meeting scheduled' && 'CalendarIcon') ||
        ((color === 'Warning' || color === 'Error') && 'ExclamationCircleIcon'),
      subTitleColor: getStepType(color)?.color || '',
      type:
        status === 'Consolidation meeting scheduled'
          ? 'inProgress'
          : getStepType(color).type,
      extraData: { date: date ? new Date(date) : null },
    } as StepItem;
  }

  return {
    title: status,
    subTitle: getStepDate(date),
    inProgressStepIcon:
      (color === 'Warning' || color === 'Error') && 'ExclamationCircleIcon',
    subTitleColor: getStepType(color)?.color || '',
    type: getStepType(color).type,
    extraData: { date: date ? new Date(date) : null },
  } as StepItem;
};

export const timelineSteps = (
  timeline: TraineeOnBoardTimeline,
  onView: (visit: Visit) => void,
  isLoading: boolean,
  isOnline: boolean,
  visits?: Maybe<Visit>[]
): StepItem[] => {
  const steps: (StepItem<{ date?: Date }> | {})[] = [];

  steps.push(
    setStep(
      timeline?.starterLicenseStatus || 'Starter Licence',
      timeline?.starterLicenseDate,
      timeline?.starterLicenseColor
    )
  );
  steps.push(
    setStep(
      timeline?.smartSpaceLicenseStatus || 'SmartSpace Licence',
      timeline?.smartSpaceLicenseDate,
      timeline?.smartSpaceLicenseColor
    )
  );
  steps.push(
    setStep(
      timeline?.consolidationMeetingStatus || 'Consolidation meeting scheduled',
      timeline?.consolidationMeetingDate || timeline?.consolidationDeadlineDate,
      timeline?.consolidationMeetingColor
    )
  );
  steps.push(
    setStep(
      timeline?.smartSpaceChecklistStatus || 'Fill in the SmartSpace checklist',
      timeline?.smartSpaceChecklistDate ||
        timeline?.smartSpaceChecklistDeadlineDate,
      timeline?.smartSpaceChecklistColor
    )
  );
  steps.push(
    setStep(
      timeline?.communitySupportStatus || 'Get community support',
      timeline?.communitySupportDate || timeline?.communitySupportDeadlineDate,
      timeline?.communitySupportColor
    )
  );
  steps.push(
    setStep(
      timeline?.threeChildrenRegisteredStatus || 'Register 3 children',
      timeline?.threeChildrenRegisteredDate ||
        timeline?.threeChildrenRegisteredDeadlineDate,
      timeline?.threeChildrenRegisteredColor
    )
  );
  steps.push(
    setStep(
      timeline?.sSCoachVisitStatus || 'SmartSpace visit from coach',
      timeline?.sSCoachVisitDate || timeline?.sSCoachVisitDeadlineDate,
      timeline?.sSCoachVisitColor
    )
  );
  steps.push(
    setStep(
      timeline?.signFranchiseeAgreementStatus || 'Sign franchisee agreement',
      timeline?.signFranchiseeAgreementDate ||
        timeline?.signFranchiseeAgreementDeadlineDate,
      timeline?.signFranchiseeAgreementColor
    )
  );
  steps.push(
    setStep(
      timeline?.signStartUpSupportAgreementStatus ||
        'Sign start-up support agreement',
      timeline?.signStartUpSupportAgreementDate ||
        timeline?.signStartUpSupportAgreementDeadlineDate,
      timeline?.signStartUpSupportAgreementColor
    )
  );

  // if (!!timeline.prePQASiteVisits?.length) {
  //   const date =
  //     timeline.prePQAVisitDate1Color === 'Success' &&
  //     !visits?.some((item) =>
  //       item?.visitType?.name?.includes('pre_pqa_visit_1')
  //     )
  //       ? new Date(
  //           timeline.prePQASiteVisits?.find((item) =>
  //             item?.visitType?.name?.includes('pre_pqa_visit_2')
  //           )?.plannedVisitDate
  //         ).toLocaleDateString('en-ZA', dateOptions)
  //       : new Date(
  //           timeline.prePQASiteVisits?.find((item) =>
  //             item?.visitType?.name?.includes('pre_pqa_visit_1')
  //           )?.plannedVisitDate
  //         ).toLocaleDateString('en-ZA', dateOptions);

  //   const isLateDate =
  //     new Date(date) < new Date() &&
  //     timeline.prePQASiteVisits.some((item) => !item?.attended);
  //   const isAllCompleted = timeline.prePQASiteVisits?.every(
  //     (item) => !!item?.attended
  //   );
  //   const getType = (): StepItem['type'] => {
  //     if (isAllCompleted) {
  //       return 'completed';
  //     }

  //     if (isLateDate) {
  //       return 'inProgress';
  //     }

  //     return 'todo';
  //   };
  //   steps.push({
  //     title: 'Pre-PQA site visits',
  //     subTitle: `By ${date}`,
  //     type: getType(),
  //     inProgressStepIcon: 'ExclamationCircleIcon',
  //     subTitleColor: isLateDate ? 'alertDark' : 'textMid',
  //     showAccordion: true,
  //     extraData: {
  //       date: new Date(date),
  //     },
  //     accordionContent: (
  //       <>
  //         {timeline.prePQASiteVisits
  //           ?.filter(
  //             (visit: Maybe<Visit>) =>
  //               typeof visit?.visitType?.order !== 'undefined'
  //           )
  //           ?.sort(sortVisit)
  //           ?.map((visit, index) => {
  //             const previousVisit =
  //               index > 1 ? timeline.prePQASiteVisits?.[index - 1] : undefined;
  //             const title =
  //               (index === 0 && timeline.prePQAVisitDate1Status) ||
  //               (index === 1 && timeline.prePQAVisitDate2Status) ||
  //               visit?.visitType?.description ||
  //               'Visit';

  //             const color =
  //               (index === 0 && timeline.prePQAVisitDate1Color) ||
  //               (index === 1 && timeline.prePQAVisitDate2Color);

  //             const attendedRule =
  //               (visit?.visitType?.order === 1 && !visit.attended) ||
  //               (!!previousVisit?.attended && !visit?.attended);

  //             return (
  //               <div className="my-4">
  //                 <div className="relative flex items-center gap-1">
  //                   <span>
  //                     <CalendarIcon className="text-primary h-4 w-4" />
  //                   </span>
  //                   <Typography
  //                     type="body"
  //                     color="textDark"
  //                     className="w-6/12 font-bold"
  //                     text={title}
  //                   />
  //                   {visits?.some((item) => item?.id === visit?.id) &&
  //                     attendedRule && (
  //                       <Button
  //                         style={{
  //                           position: 'absolute',
  //                           right: -36,
  //                         }}
  //                         className="z-50 w-32"
  //                         type="outlined"
  //                         color="primary"
  //                         text="Schedule"
  //                         icon="CalendarIcon"
  //                         // TODO: add integration
  //                         onClick={() => {}}
  //                       />
  //                     )}
  //                   {!!visit?.attended && isOnline && (
  //                     <Button
  //                       style={{
  //                         position: 'absolute',
  //                         right: -36,
  //                       }}
  //                       className="z-50 w-24"
  //                       type="filled"
  //                       color="secondaryAccent2"
  //                       textColor="secondary"
  //                       text="View"
  //                       isLoading={isLoading}
  //                       disabled={isLoading}
  //                       onClick={() => onView(visit)}
  //                     />
  //                   )}
  //                 </div>
  //                 <Typography
  //                   type="body"
  //                   color={getStepType(String(color))?.color || 'textMid'}
  //                   text={
  //                     !!visit?.plannedVisitDate
  //                       ? `By ${new Date(
  //                           visit.plannedVisitDate
  //                         ).toLocaleDateString('en-ZA', dateOptions)}`
  //                       : ''
  //                   }
  //                 />
  //               </div>
  //             );
  //           })}
  //       </>
  //     ),
  //   });
  // }

  // if (!!timeline.supportVisits?.length) {
  //   const date = new Date(
  //     timeline.supportVisits[
  //       timeline.supportVisits.length - 1
  //     ]?.plannedVisitDate
  //   ).toLocaleDateString('en-ZA', dateOptions);

  // steps.push({
  //   title: 'General support visits',
  //   subTitle: `By ${date}`,
  //   type: timeline.supportVisits?.every((item) => !!item?.attended)
  //     ? 'completed'
  //     : 'todo',
  //   extraData: {
  //     date: new Date(date),
  //   },
  //   showAccordion: true,
  //   accordionContent: (
  //     <>
  //       {timeline.supportVisits
  //         ?.filter(
  //           (visit: Maybe<Visit>) =>
  //             typeof visit?.visitType?.order !== 'undefined'
  //         )
  //         ?.sort(sortVisit)
  //         ?.map((item) => (
  //           <div className="my-4">
  //             <div className="relative flex items-center gap-1">
  //               {item?.visitType?.name === generalSupportVisitTypes.call ? (
  //                 <span>
  //                   <PhoneIcon className="text-primary h-4 w-4" />
  //                 </span>
  //               ) : (
  //                 <span>
  //                   <ClipboardCheckIcon className="text-primary h-4 w-4" />
  //                 </span>
  //               )}
  //               <Typography
  //                 type="body"
  //                 color="textDark"
  //                 className="w-6/12 font-bold"
  //                 text={item?.visitType?.description || ''}
  //               />
  //               {!!item?.attended && isOnline && (
  //                 <Button
  //                   style={{
  //                     position: 'absolute',
  //                     right: -36,
  //                   }}
  //                   className="z-50 w-24"
  //                   type="filled"
  //                   color="secondaryAccent2"
  //                   textColor="secondary"
  //                   text="View"
  //                   isLoading={isLoading}
  //                   disabled={isLoading}
  //                   onClick={() => onView(item)}
  //                 />
  //               )}
  //             </div>
  //             <Typography
  //               type="body"
  //               // TODO: add schedule integration
  //               color={getStepType(String('Success'))?.color || 'textMid'}
  //               text={
  //                 !!item?.plannedVisitDate
  //                   ? `By ${new Date(
  //                       item.plannedVisitDate
  //                     ).toLocaleDateString('en-ZA', dateOptions)}`
  //                   : ''
  //               }
  //             />
  //           </div>
  //         ))}
  //     </>
  //   ),
  // });
  // }

  // const formattedSteps = steps
  //   .filter((object) => Object.keys(object).length !== 0)
  //   .sort(
  //     (
  //       stepA,
  //       stepB // TODO: fix type
  //     ) =>
  //       // @ts-ignore
  //       (stepA.extraData?.date?.getTime() || 0) -
  //       // @ts-ignore
  //       (stepB.extraData?.date?.getTime() || 0)
  //   ) as StepItem<{ date: Date }>[];

  //   console.log({formattedSteps})
  // return formattedSteps;

  return steps as StepItem<{ date: Date }>[];
};
