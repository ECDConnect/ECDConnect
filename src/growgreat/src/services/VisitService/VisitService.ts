import { api } from '../axios.helper';
import { Config, VisitStatusDto } from '@ecdlink/core';
import {
  CmsVisitDataInputModelInput,
  MoreInformation,
  Progress_VisitDataStatus,
  VisitData,
  VisitVideos,
} from '@ecdlink/graphql';
import { HealthPromotion } from '@ecdlink/graphql';

class Visit {
  _accessToken: string;

  constructor(accessToken: string) {
    this._accessToken = accessToken;
  }

  async getHealthCareWorkerVisitStatus(
    userId: string
  ): Promise<VisitStatusDto> {
    const apiInstance = api(Config.graphQlApi, this._accessToken);
    const response = await apiInstance.post<{
      data: { healthCareWorkerVisitStatus: VisitStatusDto };
      errors?: {};
    }>(``, {
      query: `
        query GetHealthCareWorkerVisitStatus($userId: String) {
          healthCareWorkerVisitStatus(userId: $userId) {
            motherOverDueVisits
            motherDueVisits
            childDueVisits
          }
        } 
          `,
      variables: {
        userId,
      },
    });

    if (response.status !== 200 || response.data.errors) {
      throw new Error(
        'Get Health Care Worker Visit Status Failed - Server connection error'
      );
    }

    return response.data.data.healthCareWorkerVisitStatus;
  }

  // TODO: add interface
  async addVisitFormData(input: CmsVisitDataInputModelInput): Promise<any> {
    const apiInstance = api(Config.graphQlApi, this._accessToken);
    const response = await apiInstance.post<any>(``, {
      query: `
          mutation AddVisitData($input: CMSVisitDataInputModelInput) {
            addVisitData(input: $input) {
            }
        }
        `,
      variables: {
        input: input,
      },
    });

    if (response.status !== 200 || response.data.errors) {
      throw new Error('Adding visit data failed - Server connection error');
    }

    return response.data.data.createInfant;
  }

  async getMoreInformation(
    section: string,
    locale: string
  ): Promise<MoreInformation[]> {
    const apiInstance = api(Config.graphQlApi, this._accessToken);
    const response = await apiInstance.post<{
      data: { moreInformation: MoreInformation[] };
      errors?: {};
    }>(``, {
      query: `
      query GetMoreInformation($section: String, $locale: String) {
        moreInformation(section: $section, locale: $locale){
          descriptionA
          descriptionAColor
          descriptionB
          descriptionBColor
          descriptionBIcon
          descriptionC
          descriptionCColor
          descriptionD
          descriptionDColor
          descriptionDIcon
          headerA
          headerB
          headerC
          id
          infoBoxDescription
          infoBoxIcon
          infoBoxTitle
          section
          showDividerA
          showDividerB
          type
          visit
        }
      }    
      `,
      variables: {
        section,
        locale,
      },
    });

    if (response.status !== 200) {
      throw new Error('Get More Information Failed - Server connection error');
    }

    return response.data.data.moreInformation;
  }

  async getHealthPromotion(
    section: string,
    locale: string
  ): Promise<HealthPromotion[]> {
    const apiInstance = api(Config.graphQlApi, this._accessToken);
    const response = await apiInstance.post<{
      data: { healthPromotion: HealthPromotion[] };
      errors?: {};
    }>(``, {
      query: `
        query GetHealthPromotion($section: String, $locale: String) {
          healthPromotion(section: $section, locale: $locale){
            description
            descriptionListIcon
            id
            section
            type
            visit
          }
        }
      `,
      variables: {
        section,
        locale,
      },
    });

    if (response.status !== 200) {
      throw new Error('Get Health Promotion Failed - Server connection error');
    }

    return response.data.data.healthPromotion;
  }

  async getVisitVideos(
    section: string,
    locale: string
  ): Promise<VisitVideos[]> {
    const apiInstance = api(Config.graphQlApi, this._accessToken);
    const response = await apiInstance.post<{
      data: { healthPromotion: VisitVideos[] };
      errors?: {};
    }>(``, {
      query: `
        query GetVisitVideos($section: String, $locale: String) {
          visitVideos(section: $section, locale: $locale){
            id
            infoBoxDescriptionA
            infoBoxDescriptionB
            infoBoxIconA
            infoBoxIconB
            infoBoxTitleA
            infoBoxTitleB
            section
            showDividerA
            tipBoxButtonColorA
            tipBoxButtonTextA
            tipBoxColorA
            tipBoxColorB
            tipBoxDescriptionB
            tipBoxDescriptionColorB
            tipBoxIconA
            tipBoxIconB
            tipBoxTitleA
            tipBoxTitleB
            tipBoxTitleColorA
            tipBoxTitleColorB
            type
            video
            visit
          }
        }
      `,
      variables: {
        section,
        locale,
      },
    });

    if (response.status !== 200) {
      throw new Error('Get Visit Videos Failed - Server connection error');
    }

    return response.data.data.healthPromotion;
  }

  async getCompletedVisitsForVisitId(visitId: string): Promise<string[]> {
    const apiInstance = api(Config.graphQlApi, this._accessToken);
    const response = await apiInstance.post<{
      data: { completedVisitsForVisitId: string[] };
      errors?: {};
    }>(``, {
      query: `
        query GetCompletedVisitsForVisitId($visitId: String) {
          completedVisitsForVisitId(visitId: $visitId) {
          }
        }
      `,
      variables: {
        visitId,
      },
    });

    if (response.status !== 200 || response.data.errors) {
      throw new Error(
        'Get Completed Visits For Visit Id Failed - Server connection error'
      );
    }

    return response.data.data.completedVisitsForVisitId;
  }

  async getPreviousVisitInformationForInfant(
    visitId: string
  ): Promise<Progress_VisitDataStatus> {
    const apiInstance = api(Config.graphQlApi, this._accessToken);
    const response = await apiInstance.post<{
      data: { previousVisitInformationForInfant: Progress_VisitDataStatus };
      errors?: {};
    }>(``, {
      query: `
        query GetPreviousVisitInformationForInfant($visitId: String) {
          previousVisitInformationForInfant(visitId: $visitId) {
                score
                visitDataStatus {
                  id
                  comment
                  color
                  type
                  section
                }
          }
        }
      `,
      variables: {
        visitId,
      },
    });

    if (response.status !== 200 || response.data.errors) {
      throw new Error(
        'Get Previous Visit Information For Infant Failed - Server connection error'
      );
    }

    return response.data.data.previousVisitInformationForInfant;
  }

  async getGrowthDataForInfant(infantId: string): Promise<VisitData> {
    const apiInstance = api(Config.graphQlApi, this._accessToken);
    const response = await apiInstance.post<{
      data: { growthDataForInfant: VisitData };
      errors?: {};
    }>(``, {
      query: `
        query GetGrowthDataForInfant($id: String) {
          growthDataForInfant(id: $id) {
            visitName
            visitSection
            question
            questionAnswer
            visit {
              plannedVisitDate
            }
          }
        }
      `,
      variables: {
        id: infantId,
      },
    });

    if (response.status !== 200 || response.data.errors) {
      throw new Error(
        'Get Growth Data For Infant Failed - Server connection error'
      );
    }

    return response.data.data.growthDataForInfant;
  }
}

export default Visit;
