import { RootState } from '../types';
import { createSelector } from '@reduxjs/toolkit';
import {
  PractitionerTimelineState,
  FormData,
  RatingData,
  PreviousFormData,
  FollowUpType,
  VisitType,
  PQAStateKeys,
} from './pqa.types';
import { getSectionQuestions } from '@/pages/practitioner/practitioner-profile/practitioner-journey/utils';

export const getPractitionerTimelineByIdSelector = (userId: string) => {
  return createSelector(
    (state: RootState) => state.pqa.coachPractitionersTimeline,
    (items: PractitionerTimelineState[] | undefined) => {
      return items?.find((item) => item.practitionerId === userId)?.timeline;
    }
  );
};

export const getReAccreditationFormDataByIdSelector = (userId: string) => {
  return createSelector(
    (state: RootState) => state.pqa.reAccreditationFormData,
    (items: FormData[] | undefined) => {
      return items
        ?.filter((item) => item.practitionerId === userId)
        .map((item) => item.formData);
    }
  );
};

export const getPrePqaFormDataByIdSelector = (userId: string) => {
  return createSelector(
    (state: RootState) => state.pqa.prePqaFormData,
    (items: FormData[] | undefined) => {
      return items
        ?.filter((item) => item.practitionerId === userId)
        .map((item) => item.formData);
    }
  );
};

export const getPqaFormDataByIdSelector = (userId: string) => {
  return createSelector(
    (state: RootState) => state.pqa.pqaFormData,
    (items: FormData[] | undefined) => {
      return items
        ?.filter((item) => item.practitionerId === userId)
        .map((item) => item.formData);
    }
  );
};

export const getCurrentCoachPractitionerVisitByUserId = (
  currentVisitName: string,
  userId: string
) =>
  createSelector([getPractitionerTimelineByIdSelector(userId)], (timeline) => {
    const currentVisit = timeline?.prePQASiteVisits?.find(
      (visit) => visit?.visitType?.name === currentVisitName
    );

    return currentVisit || undefined;
  });

export const getPreviousCoachVisitByUserId = (
  currentVisitName: string,
  userId: string
) =>
  createSelector([getPractitionerTimelineByIdSelector(userId)], (timeline) => {
    const currentVisit = timeline?.prePQASiteVisits?.find(
      (visit) => visit?.visitType?.name === currentVisitName
    );

    if (currentVisit) {
      const previousVisit = timeline?.prePQASiteVisits?.find(
        (visit) =>
          visit?.visitType?.order === Number(currentVisit?.visitType?.order) - 1
      );
      return previousVisit || undefined;
    }

    return undefined;
  });

export const getVisitDataByVisitIdSelector = (
  visitId: string,
  stateType: PQAStateKeys
) => {
  return createSelector(
    (state: RootState) => state.pqa[stateType],
    (items: PreviousFormData[] | undefined) => {
      return items?.find((item) => item.visitId === visitId)?.formData;
    }
  );
};

export const getAllSectionsQuestions = (
  visitId: string,
  stateType: PQAStateKeys
) =>
  createSelector(
    [getVisitDataByVisitIdSelector(visitId, stateType)],
    (formData) => {
      const sectionQuestions = getSectionQuestions(formData);

      return sectionQuestions;
    }
  );

const mock = [
  {
    visitSection: 'Step 1',
    questions: [
      {
        answer: 'notes step 1',
        question: 'Observation notes',
      },
    ],
  },
  {
    visitSection: 'Step 2',
    questions: [
      {
        question: 'SmartSpace check',
        answer: [
          'The venue has enough clean, safe water for children to drink.',
          'The venue has a safe, clean and hygienic place for children to go to the toilet.',
          'There is a tap, a tippy-tap, a water dispenser or similar for handwashing under clean running water with measures that allow for physical distancing as appropriate.',
          'Medicines and harmful substances are out of reach of children.',
          'Children cannot reach matches, lighters or paraffin.',
          'Children cannot reach or step on sharp objects or other dangerous objects.',
          'Children cannot reach hot cooker plates or pans on the cooker.',
          'There is no open water (where children could fall and drown).',
          'There are no exposed electrical wires or electric sockets that children can reach.',
          'There is no smoking or open fires in the venue.',
          'There are no heights or steps from which children could fall.',
          'No dangerous animals can approach the venue.',
          'If children use an outdoor area, it is clean, with no litter or animal faeces.',
          'The venue is in an area that is known as a safe place in the community.',
          'There is at minimum a bucket of sand available in case of fires or fire blanket or extinguisher.',
          'There is a basic first aid kit in case of accidents.',
          'There is an emergency plan displayed on the wall (can use one from Starter pack).',
        ].toString(),
      },
    ],
  },
  {
    visitSection: 'Step 3',
    questions: [
      {
        question: 'Additional standards',
        answer:
          'The programme does not exceed the maximum child number per programme type.,The venue has good natural ventilation (windows or doors that can open).',
      },
    ],
  },
  {
    visitSection: 'Step 4',
    questions: [
      {
        answer: 'discuss next steps, step ',
        question:
          'Together with the SmartStarter, agree on what next steps can be taken and note them here:',
      },
    ],
  },
  {
    visitSection: 'Programme details',
    questions: [
      {
        answer: '1',
        question: 'How many assistants will attend every session?',
      },
    ],
  },
  {
    visitSection: 'Step 6',
    questions: [
      {
        question: 'How many cm is the short side of the room?',
        answer: '410',
      },
      {
        question: 'How many cm is the long side of the room?',
        answer: '410',
      },
    ],
  },
  {
    visitSection: 'Step 7',
    questions: [
      {
        question: 'Is this address correct?',
        answer: 'true',
      },
      {
        question: 'Where is the programme site located?',
        answer: '',
      },
      {
        question:
          'Please confirm {client}’s proof of ownership, lease or permission ',
        answer: 'true',
      },
    ],
  },
  {
    visitSection: 'Step 8',
    questions: [
      {
        question: 'A. The learning environment & use of the SmartStart routine',
        answer:
          'Supervision: children are supervised at all times.,Learning space: the space is divided into 3 or more interest areas, which are labelled.,Message board: the message board is up to date.',
      },
    ],
  },
  {
    visitSection: 'Step 9',
    questions: [
      {
        question: 'Which of these did you see during the session?',
        answer: 'Story time,Large group activity',
      },
    ],
  },
  {
    visitSection: 'Step 10',
    questions: [
      {
        question: 'Warm interactions',
        answer: '0',
      },
      {
        question: 'Individual attention',
        answer: '1',
      },
      {
        question: 'Maintaining order',
        answer: '1',
      },
      {
        question: 'Comforting children',
        answer: '1',
      },
      {
        question: 'Resolving conflicts',
        answer: '0',
      },
      {
        question: 'Talking with children',
        answer: '1',
      },
      {
        question: 'Encouraging intiative',
        answer: '0',
      },
      {
        question: 'Extending learning',
        answer: '1',
      },
      {
        question: 'Appropriate activities',
        answer: '0',
      },
      {
        question: 'Interactive story time',
        answer: '0',
      },
    ],
  },
  {
    visitSection: 'Step 11',
    questions: [
      {
        question: 'C. Records',
        answer:
          'Caregiver meetings: there are attendance registers for the last two monthly caregiver meetings.,Accidents: there is an accident register.',
      },
    ],
  },
  {
    visitSection: 'Step 12',
    questions: [
      {
        question: 'D. Operational standards',
        answer:
          'Parent satisfaction: parent satisfaction surveys - 3 surveys with total score from parents of more than 3 (to be collected at the meeting).',
      },
    ],
  },
  {
    visitSection: 'Step 15',
    questions: [
      {
        question:
          'Did you observe an adult hitting or smacking a child at this programme?',
        answer: 'false',
      },
      {
        question:
          'Is the SmartStart programme being implemented for long enough?',
        answer: 'true',
      },
      {
        question:
          'Are there too many children attending the SmartStart programme?',
        answer: 'false',
      },
      {
        question: 'Are there enough assistants for the programme?',
        answer: 'true',
      },
    ],
  },
  {
    visitSection: 'Step 16',
    questions: [
      {
        answer: 'summary of step 1',
        question: 'Summary of discussion',
      },
    ],
  },
  {
    visitSection: 'Step 17',
    questions: [
      {
        question: 'How many children are present today?',
        answer: '3',
      },
      {
        question: 'How long did the programme run today?',
        answer: '3',
      },
      {
        question: 'Was there an assistant present today?',
        answer: 'false',
      },
      {
        question: 'Assistant first name',
        answer: '',
      },
      {
        question: 'Assistant surname',
        answer: '',
      },
    ],
  },
];

export const getSectionsQuestionsByStep = (
  visitId: string,
  stateType: PQAStateKeys,
  visitSection: string
) =>
  createSelector(
    [getVisitDataByVisitIdSelector(visitId, stateType)],
    (formData) => {
      // const sectionQuestions = getSectionQuestions(formData);
      const sectionQuestions = mock;

      const currentSection = sectionQuestions?.find(
        (item) => item.visitSection === visitSection
      );

      return currentSection;
    }
  );

export const getCurrentPQaRatingByUserId = (userId: string) =>
  createSelector([getPractitionerTimelineByIdSelector(userId)], (timeline) => {
    const pqaRating1 = timeline?.pQARating1;
    const pqaRating2 = timeline?.pQARating2;
    const pqaRating3 = timeline?.pQARating3;

    if (pqaRating3?.overallRating) {
      return {
        rating: pqaRating3,
        visitNumber: 3,
      } as RatingData;
    }

    if (pqaRating2?.overallRating) {
      return {
        rating: pqaRating2,
        visitNumber: 2,
      } as RatingData;
    }

    return {
      rating: pqaRating1,
      visitNumber: 1,
    } as RatingData;
  });

export const getCurrentReAccreditationRatingByUserId = (userId: string) =>
  createSelector([getPractitionerTimelineByIdSelector(userId)], (timeline) => {
    const rating1 = timeline?.reAccreditationRating1;
    const rating2 = timeline?.reAccreditationRating2;
    const rating3 = timeline?.reAccreditationRating3;

    if (rating3?.overallRating) {
      return {
        rating: rating3,
        visitNumber: 3,
      } as RatingData;
    }

    if (rating2?.overallRating) {
      return {
        rating: rating2,
        visitNumber: 2,
      } as RatingData;
    }

    return {
      rating: rating1,
      visitNumber: 1,
    } as RatingData;
  });

export const getLastCoachAttendedVisitByUserId = (
  userId: string,
  visitType: VisitType,
  followUpType: FollowUpType
) =>
  createSelector([getPractitionerTimelineByIdSelector(userId)], (timeline) => {
    const attendedVisits = timeline?.[visitType]?.filter(
      (visit) =>
        visit?.attended && !visit?.visitType?.name?.includes(followUpType)
    );

    if (attendedVisits?.length === 0) {
      return null;
    }

    return attendedVisits?.reduce((mostRecentVisit, visit) => {
      if (
        !mostRecentVisit ||
        new Date(visit?.insertedDate) > new Date(mostRecentVisit.insertedDate)
      ) {
        return visit;
      }

      return mostRecentVisit;
    }, null);
  });

export const getLastCoachAttendedFollowUpVisitByUserId = (
  userId: string,
  visitType: VisitType,
  followUpType: FollowUpType
) =>
  createSelector([getPractitionerTimelineByIdSelector(userId)], (timeline) => {
    const attendedVisits = timeline?.[visitType]?.filter(
      (visit) =>
        visit?.attended && visit?.visitType?.name?.includes(followUpType)
    );

    if (attendedVisits?.length === 0) {
      return null;
    }

    return attendedVisits?.reduce((mostRecentVisit, visit) => {
      if (
        !mostRecentVisit ||
        new Date(visit?.insertedDate) > new Date(mostRecentVisit.insertedDate)
      ) {
        return visit;
      }

      return mostRecentVisit;
    }, null);
  });
