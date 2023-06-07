export interface PractitionerJourneyParams {
  practitionerId: string;
}

export const visitTypes = {
  supportVisit: 'General support visit',
  delicensing: 'Delicensing',
  pqa: {
    firstPQA: { name: 'pqa_visit_1', description: 'First PQA' },
  },
};

export const generalSupportVisitTypes = {
  visit: 'support_visit',
  call: 'support_call',
};
