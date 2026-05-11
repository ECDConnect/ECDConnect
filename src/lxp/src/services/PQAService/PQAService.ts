import { Config } from '@ecdlink/core';
import {
  AssessmentForm,
  CmsVisitDataInputModelInput,
  FollowUpVisitModelInput,
  JourneyTimeline,
  PractitionerTimeline,
  SupportVisitModelInput,
  UpdateVisitPlannedVisitDateModelInput,
  Visit,
  VisitData,
  VisitModelInput,
} from '@ecdlink/graphql';
import { api } from '../axios.helper';
import {
  AssessmentFormDto,
  AssessmentPageDto,
  AssessmentReportDto,
} from '@/models/journey/Journey.dto';

class PQAService {
  _accessToken: string;

  constructor(accessToken: string) {
    this._accessToken = accessToken;
  }

  async addVisitData(input: CmsVisitDataInputModelInput): Promise<boolean> {
    const apiInstance = api(Config.graphQlApi, this._accessToken);
    const response = await apiInstance.post<{
      data: { addVisitData: boolean };
      errors?: {};
    }>(``, {
      id: 'addVisitData',
      variables: {
        input,
      },
    });

    if (response.status !== 200 || response.data.errors) {
      throw new Error('Add visit failed - Server connection error');
    }

    return true;
  }

  async addSupportVisitData(
    input: CmsVisitDataInputModelInput
  ): Promise<boolean> {
    const apiInstance = api(Config.graphQlApi, this._accessToken);
    const response = await apiInstance.post<{
      data: { addSupportVisitData: boolean };
      errors?: {};
    }>(``, {
      id: 'addSupportVisitData',
      variables: {
        input,
      },
    });

    if (response.status !== 200 || response.data.errors) {
      throw new Error('Add support visit failed - Server connection error');
    }

    return true;
  }

  async addSupportVisitForPractitioner(
    input: SupportVisitModelInput
  ): Promise<Visit> {
    const apiInstance = api(Config.graphQlApi, this._accessToken);
    const response = await apiInstance.post<{
      data: { addSupportVisitForPractitioner: Visit };
      errors?: {};
    }>(``, {
      id: 'AddSupportVisitForPractitioner',
      variables: {
        input,
      },
    });

    if (response.status !== 200 || response.data.errors) {
      throw new Error('Add support visit failed - Server connection error');
    }

    return response.data.data.addSupportVisitForPractitioner;
  }

  async addFollowUpVisitForPractitioner(
    input: FollowUpVisitModelInput
  ): Promise<Visit> {
    const apiInstance = api(Config.graphQlApi, this._accessToken);
    const response = await apiInstance.post<{
      data: { addFollowUpVisitForPractitioner: Visit };
      errors?: {};
    }>(``, {
      id: 'AddFollowUpVisitForPractitioner',
      variables: {
        input,
      },
    });

    if (response.status !== 200 || response.data.errors) {
      throw new Error('Add follow up visit failed - Server connection error');
    }

    return response.data.data.addFollowUpVisitForPractitioner;
  }

  async addReAccreditationFollowUpVisitForPractitioner(
    input: FollowUpVisitModelInput
  ): Promise<Visit> {
    const apiInstance = api(Config.graphQlApi, this._accessToken);
    const response = await apiInstance.post<{
      data: { addReAccreditationFollowUpVisitForPractitioner: Visit };
      errors?: {};
    }>(``, {
      id: 'AddReAccreditationFollowUpVisitForPractitioner',
      variables: {
        input,
      },
    });

    if (response.status !== 200 || response.data.errors) {
      throw new Error(
        'Add reAccreditation follow up visit failed - Server connection error'
      );
    }

    return response.data.data.addReAccreditationFollowUpVisitForPractitioner;
  }

  async addSelfAssessmentForPractitioner(
    input: SupportVisitModelInput
  ): Promise<Visit> {
    const apiInstance = api(Config.graphQlApi, this._accessToken);
    const response = await apiInstance.post<{
      data: { addSelfAssessmentForPractitioner: Visit };
      errors?: {};
    }>(``, {
      id: 'AddSelfAssessmentForPractitioner',
      variables: {
        input,
      },
    });

    if (response.status !== 200 || response.data.errors) {
      throw new Error('Add self assessment failed - Server connection error');
    }

    return response.data.data.addSelfAssessmentForPractitioner;
  }

  async getVisitDataForVisitId(visitId: string): Promise<VisitData[]> {
    const apiInstance = api(Config.graphQlApi, this._accessToken);
    const response = await apiInstance.post<{
      data: { visitDataForVisitId: VisitData[] };
      errors?: {};
    }>(``, {
      id: 'GetVisitDataForVisitId',
      variables: {
        visitId,
      },
    });

    if (response.status !== 200 || response.data.errors) {
      throw new Error(
        'Get Visit Data For Visit Id Failed - Server connection error'
      );
    }

    return response.data.data.visitDataForVisitId;
  }

  async getPractitionerTimeline(userId: string): Promise<PractitionerTimeline> {
    const apiInstance = api(Config.graphQlApi, this._accessToken);
    const response = await apiInstance.post<{
      data: { practitionerTimeline: PractitionerTimeline };
      errors?: {};
    }>(``, {
      id: 'GetPractitionerTimeline',
      variables: {
        userId,
      },
    });

    if (response.status !== 200 || response.data.errors) {
      throw new Error(
        'Get Practitioner Timeline Failed - Server connection error'
      );
    }
    return response.data.data.practitionerTimeline;
  }

  async getJourneyTimeline(userId: string): Promise<JourneyTimeline[]> {
    const apiInstance = api(Config.graphQlApi, this._accessToken);
    const response = await apiInstance.post<{
      data: { journeyTimeline: JourneyTimeline[] };
      errors?: {};
    }>(``, {
      id: 'GetJourneyTimeline',
      variables: {
        userId,
      },
    });

    if (response.status !== 200 || response.data.errors) {
      throw new Error('Get Journey Timeline Failed - Server connection error');
    }
    return response.data.data.journeyTimeline;
  }

  async getJourneyPublishedAssessmentForms(): Promise<AssessmentFormDto[]> {
    const apiInstance = api(Config.graphQlApi, this._accessToken);
    const response = await apiInstance.post<{
      data: { journeyPublishedAssessmentForms: AssessmentFormDto[] };
      errors?: {};
    }>(``, {
      id: 'getJourneyPublishedAssessmentForms',
    });

    if (response.status !== 200 || response.data.errors) {
      throw new Error(
        'Get Published Assessment Forms Failed - Server connection error'
      );
    }
    return response.data.data.journeyPublishedAssessmentForms;
  }

  async getJourneyAssessmentFormData(id: number): Promise<AssessmentFormDto> {
    const apiInstance = api(Config.graphQlApi, this._accessToken);
    const response = await apiInstance.post<{
      data: { journeyAssessmentFormData: AssessmentFormDto };
      errors?: {};
    }>(``, {
      id: 'getJourneyAssessmentFormData',
      variables: {
        id,
      },
    });

    if (response.status !== 200 || response.data.errors) {
      throw new Error(
        'Get Journey Assessment Form Data Failed - Server connection error'
      );
    }
    return response.data.data.journeyAssessmentFormData;
  }

  async getJourneyAssessmentReport(
    visitId: string
  ): Promise<AssessmentReportDto> {
    const apiInstance = api(Config.graphQlApi, this._accessToken);
    const response = await apiInstance.post<{
      data: { journeyAssessmentReport: AssessmentReportDto };
      errors?: {};
    }>(``, {
      id: 'GetJourneyAssessmentReport',
      variables: {
        visitId,
      },
    });

    if (response.status !== 200 || response.data.errors) {
      throw new Error(
        'Get Journey Assessment Report Failed - Server connection error'
      );
    }
    return response.data.data.journeyAssessmentReport;
  }

  async submitJourneyAssessmentFormData(
    formId: string,
    formName: string,
    input: AssessmentPageDto[]
  ): Promise<AssessmentReportDto> {
    const apiInstance = api(Config.graphQlApi, this._accessToken);
    const response = await apiInstance.post<{
      data: { submitJourneyAssessmentFormData: AssessmentReportDto };
      errors?: {};
    }>(``, {
      id: 'submitJourneyAssessmentFormData',
      variables: {
        formId,
        formName,
        input,
      },
    });

    if (response.status !== 200 || response.data.errors) {
      throw new Error(
        'Submit Journey Assessment Form Data failed - Server connection error'
      );
    }

    return response.data.data.submitJourneyAssessmentFormData;
  }

  async updateVisitPlannedVisitDate(
    input: UpdateVisitPlannedVisitDateModelInput
  ): Promise<Visit> {
    const apiInstance = api(Config.graphQlApi, this._accessToken);
    const response = await apiInstance.post<{
      data: { updateVisitPlannedVisitDate: Visit };
      errors?: {};
    }>(``, {
      id: 'updateVisitPlannedVisitDate',
      variables: {
        input,
      },
    });

    if (response.status !== 200 || response.data.errors) {
      throw new Error(
        'Update Visit PlannedVisitDate failed - Server connection error'
      );
    }

    return response.data.data.updateVisitPlannedVisitDate;
  }

  async addCoachVisitInviteForPractitioner(
    input: VisitModelInput
  ): Promise<Visit> {
    const apiInstance = api(Config.graphQlApi, this._accessToken);
    const response = await apiInstance.post<{
      data: { addCoachVisitInviteForPractitioner: Visit };
      errors?: {};
    }>(``, {
      id: 'AddCoachVisitInviteForPractitioner',
      variables: {
        input,
      },
    });

    if (response.status !== 200 || response.data.errors) {
      throw new Error(
        'Add coach visit invite for practitioner failed - Server connection error'
      );
    }

    return response.data.data.addCoachVisitInviteForPractitioner;
  }
}

export default PQAService;
