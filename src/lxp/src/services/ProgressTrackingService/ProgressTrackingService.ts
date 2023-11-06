import { api } from '../axios.helper';
import { Config, PractitionerProgressReportSummaryDto } from '@ecdlink/core';
import {
  ProgressTrackingCategoryDto,
  ProgressTrackingLevelDto,
  ProgressTrackingSkillDto,
  ProgressTrackingSubCategoryDto,
} from '@ecdlink/core';
class ProgressTrackingService {
  _accessToken: string;

  constructor(accessToken: string) {
    this._accessToken = accessToken;
  }

  async getProgressTrackingCategories(
    locale: string
  ): Promise<ProgressTrackingCategoryDto[]> {
    const apiInstance = api(Config.graphQlApi, this._accessToken);
    const response = await apiInstance.post<any>(``, {
      query: `
      query GetAllProgressTrackingCategory($locale: String) {
        GetAllProgressTrackingCategory(locale: $locale) {
          id
          name
          subTitle
          description
          imageUrl
          color
          subCategories {
            id
          }          
        }
      }        
      `,
      variables: {
        locale: locale,
      },
    });

    if (response.status !== 200) {
      throw new Error(
        'Get Progress Tracking Categories failed - Server connection error'
      );
    }

    return response.data.data.GetAllProgressTrackingCategory;
  }

  async getProgressTrackingSubCategories(
    locale: string
  ): Promise<ProgressTrackingSubCategoryDto[]> {
    const apiInstance = api(Config.graphQlApi, this._accessToken);
    const response = await apiInstance.post<any>(``, {
      query: `
      query GetAllProgressTrackingSubCategory($locale: String) {
        GetAllProgressTrackingSubCategory(locale: $locale) {
          id
          name
          description
          imageUrl
          skills {
            id
          } 
        }
      }         
      `,
      variables: {
        locale: locale,
      },
    });

    if (response.status !== 200) {
      throw new Error(
        'Get Progress Tracking Sub-Categories failed - Server connection error'
      );
    }

    return response.data.data.GetAllProgressTrackingSubCategory;
  }

  async getProgressTrackingSkills(
    locale: string
  ): Promise<ProgressTrackingSkillDto[]> {
    const apiInstance = api(Config.graphQlApi, this._accessToken);
    const response = await apiInstance.post<any>(``, {
      query: `
      query GetAllProgressTrackingSkill($locale: String) {
        GetAllProgressTrackingSkill(locale: $locale) {
          id                
          name
          level {
            id
          }
          value
        }
      }         
      `,
      variables: {
        locale: locale,
      },
    });

    if (response.status !== 200) {
      throw new Error('Get Progress Tracking Skills - Server connection error');
    }

    return response.data.data.GetAllProgressTrackingSkill;
  }

  async getProgressTrackingLevels(
    locale: string
  ): Promise<ProgressTrackingLevelDto[]> {
    const apiInstance = api(Config.graphQlApi, this._accessToken);
    const response = await apiInstance.post<any>(``, {
      query: `
      query GetAllProgressTrackingLevel($locale: String) {
        GetAllProgressTrackingLevel(locale: $locale) {
          id
          name
          description
          imageUrl  
          imageUrlDim
          imageUrlDone
        }
      }        
      `,
      variables: {
        locale: locale,
      },
    });

    if (response.status !== 200) {
      throw new Error(
        'Get Progress Tracking Levels failed - Server connection error'
      );
    }

    return response.data.data.GetAllProgressTrackingLevel;
  }

  async practitionerProgressReportSummary(
    reportingPeriod: string
  ): Promise<PractitionerProgressReportSummaryDto> {
    const apiInstance = api(Config.graphQlApi, this._accessToken);
    const response = await apiInstance.post<any>(``, {
      query: `
      query practitionerProgressReportSummary{
        practitionerProgressReportSummary(reportingPeriod: "Nov 2023") {
          reportingPeriod
          classSummaries {
              practitionerUserId
              practitionerFullName
              className
              childCount
              categories {
                  id
                  name
                  subCategories {
                      id
                      name
                      childrenPerSkill {
                          childCount
                          skill
                      }
                  }
              }
          }
        }
      }
      `,
      variables: {
        reportingPeriod: reportingPeriod,
      },
    });

    if (response.status !== 200) {
      throw new Error(
        'Get Progress Tracking Categories failed - Server connection error'
      );
    }

    return response.data.data.practitionerProgressReportSummary;
  }
}

export default ProgressTrackingService;
