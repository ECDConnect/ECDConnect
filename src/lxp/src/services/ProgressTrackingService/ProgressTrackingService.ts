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
      id: 'GetAllProgressTrackingCategory',
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
      id: 'GetAllProgressTrackingSubCategory',
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
      id: 'GetAllProgressTrackingAgeGroup',
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
      id: 'GetAllProgressTrackingSkill',
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
      id: 'GetResourcesLinks',
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
      id: 'practitionerProgressReportSummary',
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
      id: 'getChildProgressReportsForUser',
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
      id: 'createOrUpdateChildProgressReport',
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

  async getClassroomProgressSummaryDownloaded(
    classroomGroupId: string
  ): Promise<boolean> {
    const apiInstance = api(Config.graphQlApi, this._accessToken);
    const response = await apiInstance.post<{
      data: { createOrUpdateChildProgressReport: boolean };
      errors?: {};
    }>(``, {
      id: 'ClassroomProgressSummaryDownloaded',
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
