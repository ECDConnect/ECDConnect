export interface PractitionerJourneyParams {
  practitionerId: string;
}

export interface CoachPractitionerJourneyPageState {
  action?: string;
  actionParams?: any;
}

export const maxNumberOfVisits = 3;

export const visitTypes = {
  supportVisit: 'General support visit',
  delicensing: 'Delicensing',
  prePqa: {
    includes: 'pre_pqa_visit',
    first: {
      name: 'pre_pqa_visit_1',
      description: 'First site visit',
    },
    second: {
      name: 'pre_pqa_visit_2',
      description: 'Second site visit',
    },
  },
  pqa: {
    includes: 'pqa_visit',
    firstPQA: { name: 'pqa_visit_1', description: 'First PQA' },
    secondPQA: { name: 'pqa_visit_2', description: 'First PQA' },
    thirdPQA: { name: 'pqa_visit_3', description: 'First PQA' },
    followUp: {
      name: 'pqa_visit_follow_up',
      description: 'Follow-up visit',
      timelineDescription: 'Start follow-up PQA visit ',
    },
  },
  reaccreditation: {
    includes: 're_accreditation',
    first: {
      name: 're_accreditation_1',
      description: 'Re-accreditation visit',
    },
    second: {
      name: 're_accreditation_2',
      description: 'Re-accreditation visit',
    },
    third: {
      name: 're_accreditation_3',
      description: 'Re-accreditation visit',
    },
    followUp: {
      name: 're_accreditation_follow_up',
      description: 'Follow-up visit',
      timelineDescription: 'Start re-accreditation follow up visit',
    },
  },
};

export const generalSupportVisitTypes = {
  visit: 'support_visit',
  call: 'support_call',
};
