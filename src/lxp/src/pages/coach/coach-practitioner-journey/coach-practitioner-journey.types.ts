export interface PractitionerJourneyParams {
  practitionerId: string;
}

export interface CoachPractitionerJourneyPageState {
  action?: string;
  actionParams?: any;
}

export const maxNumberOfVisits = 3;

export const visitTypes = {
  supportVisit: {
    name: 'support_visit',
    description: 'General support visit',
    eventType: 'General support visit' as 'General support visit',
    scheduleStartText: 'support visit',
  },
  requestedVisit: {
    name: 'requested_support_visit',
    description: 'Requested visit',
    eventType: 'Requested visit' as 'Requested visit',
    scheduleStartText: 'requested visit',
  },
  delicensing: 'Delicensing',
  prePqa: {
    includes: 'pre_pqa_visit',
    first: {
      name: 'pre_pqa_visit_1',
      description: 'First site visit',
      eventType: 'First site visit' as 'First site visit',
      scheduleStartText: 'first site visit',
    },
    second: {
      name: 'pre_pqa_visit_2',
      description: 'Second site visit',
      eventType: 'Second site visit' as 'Second site visit',
      scheduleStartText: 'second site visit',
    },
  },
  pqa: {
    includes: 'pqa_visit',
    firstPQA: {
      name: 'pqa_visit_1',
      description: 'First PQA',
      eventType: 'First PQA' as 'First PQA',
      scheduleStartText: 'first PQA visit',
    },
    followUp: {
      name: 'pqa_visit_follow_up',
      description: 'Follow-up visit',
      timelineDescription: 'Start follow-up PQA visit ',
      eventType: 'PQA follow-up' as 'PQA follow-up',
      scheduleStartText: 'follow-up PQA visit',
    },
  },
  reaccreditation: {
    includes: 're_accreditation',
    first: {
      name: 're_accreditation_1',
      description: 'Re-accreditation visit',
      eventType: 'Re-accreditation' as 'Re-accreditation',
      scheduleStartText: 're-accreditation visit',
    },
    second: {
      name: 're_accreditation_2',
      description: 'Re-accreditation visit',
      eventType: 'Re-accreditation' as 'Re-accreditation',
      scheduleStartText: 're-accreditation visit',
    },
    third: {
      name: 're_accreditation_3',
      description: 'Re-accreditation visit',
      eventType: 'Re-accreditation' as 'Re-accreditation',
      scheduleStartText: 're-accreditation visit',
    },
    followUp: {
      name: 're_accreditation_follow_up',
      description: 'Follow-up visit',
      timelineDescription: 'Start re-accreditation follow up visit',
      eventType: 'Re-accreditation follow-up' as 'Re-accreditation follow-up',
      scheduleStartText: 'follow-up re-accreditation visit',
    },
  },
};

export const generalSupportVisitTypes = {
  visit: 'support_visit',
  call: 'support_call',
  practitioner_visit: 'practitioner_visit',
  practitioner_call: 'practitioner_call',
};
