import { api } from '../axios.helper';
import { Config } from '@ecdlink/core';
import {
  VisitBackReferralModelInput,
  VisitDataStatus,
  VisitDataStatusFilterInput,
} from '@ecdlink/graphql';

class Referral {
  _accessToken: string;

  constructor(accessToken: string) {
    this._accessToken = accessToken;
  }

  async getReferralsForInfant(id: string): Promise<VisitDataStatus[]> {
    const apiInstance = api(Config.graphQlApi, this._accessToken);
    const response = await apiInstance.post<{
      data: { referralsForInfant: VisitDataStatus[] };
      errors?: {};
    }>(``, {
      query: `
        query GetReferralsForInfant($id: String) {
          referralsForInfant(id: $id) {
            id
            comment
            color
            type
            section
            isCompleted
            insertedDate
            visitData {
              visitName
              visitSection
              question
              visit {
                plannedVisitDate
              }
            }
          }
        }
          `,
      variables: {
        id,
        // id: '6c2bc4ab-f06e-44d1-adee-be91dd98e1b0',
        // test id
      },
    });

    if (response.status !== 200 || response.data.errors) {
      throw new Error(
        'Get Referrals For Infant Failed - Server connection error'
      );
    }

    return response.data.data.referralsForInfant;
  }

  async getReferralsForVisitId(visitId: string): Promise<VisitDataStatus[]> {
    const apiInstance = api(Config.graphQlApi, this._accessToken);
    const response = await apiInstance.post<{
      data: { referralsForVisitId: VisitDataStatus[] };
      errors?: {};
    }>(``, {
      query: `
      query GetReferralsForVisitId($visitId: String) {
        referralsForVisitId(visitId: $visitId) {
              id
              comment
              color
          type
              section
              isCompleted
        }
      }
          `,
      variables: {
        visitId,
      },
    });

    if (response.status !== 200 || response.data.errors) {
      throw new Error(
        'Get Referrals For Infant Failed - Server connection error'
      );
    }

    return response.data.data.referralsForVisitId;
  }

  async updateVisitDataStatus(
    input: VisitDataStatusFilterInput[]
  ): Promise<{}> {
    const apiInstance = api(Config.graphQlApi, this._accessToken);
    const response = await apiInstance.post<{
      data: {};
      errors?: {};
    }>(``, {
      query: `
        mutation UpdateVisitDataStatus($input: VisitDataStatusReferralInput) {
          updateVisitDataStatus(input: $input) {
          
          }
        }
          `,
      variables: {
        input: { referrals: input },
      },
    });

    if (response.status !== 200 || response.data.errors) {
      throw new Error(
        'Update Visit Data Status Failed - Server connection error'
      );
    }
    return response.data.data;
  }

  async getCompletedReferralsForInfant(id: string): Promise<VisitDataStatus[]> {
    const apiInstance = api(Config.graphQlApi, this._accessToken);
    const response = await apiInstance.post<{
      data: { completedReferralsForInfant: VisitDataStatus[] };
      errors?: {};
    }>(``, {
      query: `
        query GetCompletedReferralsForInfant($id: String) {
          completedReferralsForInfant(id: $id) {
            id
            comment
            color
            type
            section
            isCompleted
            backReferralCompleted
            referralDateCompleted
            insertedDate
            visitData {
              visitName
              visitSection
              question
            }
            backReferral {
              id
              comment
            }
          }
        }
          `,
      variables: {
        id,
      },
    });

    if (response.status !== 200 || response.data.errors) {
      throw new Error(
        'Get Referrals For Infant Failed - Server connection error'
      );
    }
    return response.data.data.completedReferralsForInfant;
  }

  async getReferralsForMother(id: string): Promise<VisitDataStatus[]> {
    const apiInstance = api(Config.graphQlApi, this._accessToken);
    const response = await apiInstance.post<{
      data: { referralsForMother: VisitDataStatus[] };
      errors?: {};
    }>(``, {
      query: `
        query GetReferralsForMother($id: String) {
          referralsForMother(id: $id) {
            id
            comment
            color
            type
            section
            isCompleted
            insertedDate
            visitData {
              visitName
              visitSection
              question
              visit {
                plannedVisitDate
              }
            }
          }
        }
          `,
      variables: {
        id,
      },
    });

    if (response.status !== 200 || response.data.errors) {
      throw new Error(
        'Get Referrals For Mother Failed - Server connection error'
      );
    }

    return response.data.data.referralsForMother;
  }

  async getCompletedReferralsForMother(id: string): Promise<VisitDataStatus[]> {
    const apiInstance = api(Config.graphQlApi, this._accessToken);
    const response = await apiInstance.post<{
      data: { completedReferralsForMother: VisitDataStatus[] };
      errors?: {};
    }>(``, {
      query: `
        query GetCompletedReferralsForMother($id: String) {
          completedReferralsForMother(id: $id) {
            id
            comment
            color
            type
            section
            isCompleted
            referralDateCompleted
            insertedDate
            visitData {
              visitName
              visitSection
              question
            }
            backReferral {
              id
              comment
            }
          }
        }
          `,
      variables: {
        id,
      },
    });

    if (response.status !== 200 || response.data.errors) {
      throw new Error(
        'Get Completed Referrals For Mother Failed - Server connection error'
      );
    }
    return response.data.data.completedReferralsForMother;
  }

  async addVisitBackReferral(input: VisitBackReferralModelInput): Promise<{}> {
    const apiInstance = api(Config.graphQlApi, this._accessToken);
    const response = await apiInstance.post<{
      data: {};
      errors?: {};
    }>(``, {
      query: `
        mutation AddVisitBackReferral($input: VisitBackReferralModelInput) {
          addVisitBackReferral(input: $input) {
            id,
            comment
          }
        }
          `,
      variables: {
        input,
      },
    });

    if (response.status !== 200 || response.data.errors) {
      throw new Error(
        'Add Visit Back Referral Data Status Failed - Server connection error'
      );
    }
    return response.data.data;
  }
}

export default Referral;
