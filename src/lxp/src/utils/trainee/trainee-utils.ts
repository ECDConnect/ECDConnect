import { EnhancedStore } from '@reduxjs/toolkit';
import { RootState } from '@store/types';
import { addDays, format } from 'date-fns';

export class TraineeNotifications {
  store: EnhancedStore<RootState, any>;

  constructor(store: EnhancedStore<RootState, any>) {
    this.store = store;
  }

  // THIS IS NOT CURRENTLY USED ANYWHERE
  getNotifications = () => {
    //   const { trainee: traineeState, practitioner: practitionerState } = this.store.getState();
    //   const practitioner = practitionerState.practitioner;
    //   const traineeTimeline = traineeState?.traineeOnboardTimeline[practitioner?.userId || ''];
    //   const overdueDate = addDays(traineeTimeline?.dayOneStartUpTrainingDate as Date, 14);
    //   const traineeNotificationsData = [
    //     {
    //       title: 'Start your trainee journey!',
    //       message:
    //         'Sign your franchisee & start-up support agreements, start registering children, and make sure your venue meets the SmartSpace standards.',
    //       buttonText: 'Get started',
    //     },
    //     {
    //       title: 'Set up your venue',
    //       message: `Use the SmartSpace checklist to make sure your venue is safe and stimulating for children. Complete the checklist by ${
    //         traineeTimeline?.smartSpaceChecklistDeadlineDate
    //           ? format(
    //               traineeTimeline?.smartSpaceChecklistDeadlineDate,
    //               'd MMM yyyy'
    //             )
    //           : format(new Date(), 'd MMM yyyy')
    //       }`,
    //       buttonText: 'View checklist',
    //     },
    //     {
    //       title: "Gain your community's support",
    //       message: `Get the support of ECD Centres, ECD Forums, local authorities, and others in your community by ${
    //         traineeTimeline?.communitySupportDeadlineDate
    //           ? format(
    //               traineeTimeline?.communitySupportDeadlineDate,
    //               'd MMM yyyy'
    //             )
    //           : format(new Date(), 'd MMM yyyy')
    //       }`,
    //       buttonText: 'Learn more',
    //     },
    //     {
    //       title: 'Register at least 3 children',
    //       message: `Start registering children for your programme. Register 3 children by ${
    //         traineeTimeline?.threeChildrenRegisteredDeadlineDate
    //           ? format(
    //               traineeTimeline?.threeChildrenRegisteredDeadlineDate,
    //               'd MMM yyyy'
    //             )
    //           : format(new Date(), 'd MMM yyyy')
    //       }`,
    //       buttonText: 'Add a child',
    //     },
    //     {
    //       title: 'Accept SmartSpace invitation',
    //       message: `Your coach has scheduled your SmartSpace visit for ${
    //         traineeTimeline?.threeChildrenRegisteredDeadlineDate
    //           ? format(
    //               traineeTimeline?.threeChildrenRegisteredDeadlineDate,
    //               'd MMM yyyy'
    //             )
    //           : format(new Date(), 'd MMM yyyy')
    //       }. Accept your SmartSpace invitation and prepare for the visit.`,
    //       buttonText: 'Accept invitation',
    //     },
    //     {
    //       title: 'Sign agreements',
    //       message: `Read the franchisee & start-up support agreements, add your signature, and choose your programme type by ${
    //         traineeTimeline?.signStartUpSupportAgreementDeadlineDate
    //           ? format(
    //               traineeTimeline?.signStartUpSupportAgreementDeadlineDate,
    //               'd MMM yyyy'
    //             )
    //           : format(new Date(), 'd MMM yyyy')
    //       }`,
    //       buttonText: 'Sign agreement',
    //     },
    //     {
    //       title: 'Sign franchisee agreement',
    //       message: `Read the agreement, add your signature, and choose your programme type by ${
    //         traineeTimeline?.signFranchiseeAgreementDeadlineDate
    //           ? format(
    //               traineeTimeline?.signFranchiseeAgreementDeadlineDate,
    //               'd MMM yyyy'
    //             )
    //           : format(new Date(), 'd MMM yyyy')
    //       }`,
    //       buttonText: 'Sign agreement',
    //     },
    //     {
    //       title: 'Sign start-up support agreement',
    //       message: `As part of becoming a SmartStarter, you will receive start-up support to help you build your business. Read the conditions of this support and sign the agreement by ${
    //         traineeTimeline?.signStartUpSupportAgreementDeadlineDate
    //           ? format(
    //               traineeTimeline?.signStartUpSupportAgreementDeadlineDate,
    //               'd MMM yyyy'
    //             )
    //           : format(new Date(), 'd MMM yyyy')
    //       }`,
    //       buttonText: 'Sign agreement',
    //     },
    //     {
    //       title: 'Onboarding tasks overdue',
    //       message: `You have overdue onboarding tasks. Tasks were due by ${
    //         traineeTimeline?.dayOneStartUpTrainingDate
    //           ? format(overdueDate, 'd MMM yyyy')
    //           : format(new Date(), 'd MMM yyyy')
    //       }. If you do not complete these tasks, your coach will be asked to remove you from the programme.`,
    //       buttonText: 'Sign agreement',
    //     },
    //     {
    //       title: 'Only 2 more onboarding steps to complete!',
    //       message: `Finish just 2 more steps to become a SmartStarter.`,
    //       buttonText: 'Keep going',
    //     },
    //   ];
  };
}
