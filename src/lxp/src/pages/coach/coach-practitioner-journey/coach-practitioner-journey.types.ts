export interface PractitionerJourneyParams {
  practitionerId: string;
}

export const visitTypes = {
  supportVisit: 'General support visit',
  pqa: {
    firstPQA: 'First PQA',
  },
};

export const generalSupportVisitTypes = {
  visit: 'support_visit',
  call: 'support_call',
};
