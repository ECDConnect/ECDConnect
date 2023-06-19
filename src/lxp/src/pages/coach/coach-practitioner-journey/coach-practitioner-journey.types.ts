export interface PractitionerJourneyParams {
  practitionerId: string;
}

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
    firstPQA: { name: 'pqa_visit_1', description: 'First PQA' },
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
  },
};

export const generalSupportVisitTypes = {
  visit: 'support_visit',
  call: 'support_call',
};
