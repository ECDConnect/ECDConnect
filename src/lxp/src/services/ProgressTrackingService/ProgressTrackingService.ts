import { ChildProgressReport } from '@/models/progress/child-progress-report';
import { api } from '../axios.helper';
import {
  Config,
  PractitionerProgressReportSummaryDto,
  ProgressTrackingAgeGroupDto,
} from '@ecdlink/core';
import {
  ProgressTrackingCategoryDto,
  ProgressTrackingSkillDto,
  ProgressTrackingSubCategoryDto,
} from '@ecdlink/core';
import {
  ChildProgressReportModelInput,
  ProgressTrackingAgeGroup,
  ProgressTrackingSkill,
  ResourceLink,
} from '@ecdlink/graphql';
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

  async getProgressTrackingAgeGroups(
    locale: string
  ): Promise<ProgressTrackingAgeGroupDto[]> {
    const apiInstance = api(Config.graphQlApi, this._accessToken);
    const response = await apiInstance.post<{
      data: { GetAllProgressTrackingAgeGroup: ProgressTrackingAgeGroup[] };
    }>(``, {
      query: `query GetAllProgressTrackingAgeGroup($locale: String) {
          GetAllProgressTrackingAgeGroup(locale: $locale) {
            id
            name            
            startAgeInMonths
            endAgeInMonths     
            color
            description
            skills
          }
        }`,
      variables: {
        locale: locale,
      },
    });

    if (response.status !== 200) {
      throw new Error(
        'Get Progress Tracking Age Groups - Server connection error'
      );
    }

    const mappedResponse =
      response.data.data.GetAllProgressTrackingAgeGroup.map((x) => ({
        id: x.id!,
        name: x.name!,
        startAgeInMonths: Number(x.startAgeInMonths!),
        endAgeInMonths: Number(x.endAgeInMonths!),
        color: x.color!,
        description: x.description!,
        skills:
          x.skills! && x.skills.length > 0
            ? x.skills!.split(',').map((y) => Number(y))
            : [],
      }));

    return mappedResponse;
  }

  async getProgressTrackingSkills(
    locale: string
  ): Promise<ProgressTrackingSkillDto[]> {
    const apiInstance = api(Config.graphQlApi, this._accessToken);
    const response = await apiInstance.post<{
      data: { GetAllProgressTrackingSkill: ProgressTrackingSkill[] };
    }>(``, {
      query: `
      query GetAllProgressTrackingSkill($locale: String) {
        GetAllProgressTrackingSkill(locale: $locale) {
          id                
          name
          supportImage
          isReverseScored
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

    return response.data.data.GetAllProgressTrackingSkill.map((x) => ({
      id: x.id!,
      name: x.name || '',
      supportImage: x.supportImage || undefined,
      isReverseScored: !!x.isReverseScored,
      description: x.value || '', // Small remapping, I added the descriptions to the value field in the content since a description field did not exist and value was not being used
    }));
  }

  async getProgressResourcesLinks(locale: string): Promise<ResourceLink[]> {
    const apiInstance = api(Config.graphQlApi, this._accessToken);
    const response = await apiInstance.post<any>(``, {
      query: `
      query GetResourcesLinks($locale: String) {
        GetAllResourceLink(locale: $locale) {
          id
          link
          description
          title
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
    return response.data.data.GetAllResourceLink;
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
                  imageUrl
                  color
                  subCategories {
                    id
                    name
                    imageUrl
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

  async getChildProgressReportsForUser(
    userId: string
  ): Promise<ChildProgressReport[]> {
    const apiInstance = api(Config.graphQlApi, this._accessToken);
    const response = await apiInstance.post<{
      data: { childProgressReportsForUser: ChildProgressReport[] };
      errors?: {};
    }>(``, {
      query: `query getChildProgressReportsForUser($userId: UUID!) {
        childProgressReportsForUser(userId: $userId) {
          id,
          dateCreated,
          childId,
          dateCompleted,
          notes,
          howToSupport,
          childProgressReportPeriodId
          observationsCompleteDate
          childEnjoys
          goodProgressWith
          howCanCaregiverSupport
          classroomName
          practitionerName
          principalName
          principalPhoneNumber
          skillObservations {
            skillId,
            value
          }
          skillsToWorkOn {
            skillId
            howToSupport
          }          
        }
      }`,
      variables: {
        userId: userId,
      },
    });

    if (response.status !== 200 || !!response.data.errors) {
      throw new Error('Get Progress reports failed - Server connection error');
    }

    return response.data.data.childProgressReportsForUser;
  }

  async createOrUpdateChildProgressReport(
    input: ChildProgressReportModelInput
  ): Promise<boolean> {
    const apiInstance = api(Config.graphQlApi, this._accessToken);
    const response = await apiInstance.post<{
      data: { createOrUpdateChildProgressReport: boolean };
      errors?: {};
    }>(``, {
      query: `
        mutation createOrUpdateChildProgressReport($input: ChildProgressReportModelInput) {
          createOrUpdateChildProgressReport(input: $input) {
          }
        }
      `,
      variables: {
        input: input,
      },
    });

    if (response.status !== 200 || !!response.data.errors) {
      throw new Error(
        'Updating child progress report failed - Server connection error'
      );
    }

    return response.data.data.createOrUpdateChildProgressReport;
  }

  async classroomProgressSummaryDownloaded(
    classroomGroupId: string
  ): Promise<boolean> {
    const apiInstance = api(Config.graphQlApi, this._accessToken);
    const response = await apiInstance.post<{
      data: { createOrUpdateChildProgressReport: boolean };
      errors?: {};
    }>(``, {
      query: `
        mutation ClassroomProgressSummaryDownloaded($classroomGroupId: UUID!) {
          classroomProgressSummaryDownloaded(classroomGroupId: $classroomGroupId) {
          }
        }
      `,
      variables: {
        classroomGroupId: classroomGroupId,
      },
    });

    if (response.status !== 200 || !!response.data.errors) {
      throw new Error(
        'Progress report summary downloaded failed - Server connection error'
      );
    }

    return response.data.data.createOrUpdateChildProgressReport;
  }
}

export default ProgressTrackingService;
