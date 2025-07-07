import {
  Config,
  ChildProgressObservationReport,
  ChildProgressReportSummaryModel,
} from '@ecdlink/core';
import {
  ChildProgressReport,
  ChildProgressReportInput,
} from '@ecdlink/graphql';
import { api } from '../axios.helper';

class ContentReportService {
  _accessToken: string;
  _locale: string;

  constructor(accessToken: string, locale: string) {
    this._accessToken = accessToken;
    this._locale = locale;
  }

  async getUserContentChildProgressReports(userId: string): Promise<any[]> {
    const apiInstance = api(Config.graphQlApi, this._accessToken);
    const response = await apiInstance.post<any>(``, {
      query: `
        query GetUserContentChildProgressReport($UserId: String, $Locale: String) {
          GetUserContentChildProgressReport(UserId: $UserId, Locale: $Locale) {          
            contentItem {
              id
              contentTypeId
              name
              reference              
            }
            content      
          }
        }
      `,
      variables: {
        UserId: userId,
        Locale: this._locale,
      },
    });

    if (response.status !== 200) {
      throw new Error(
        'Get User Content Child Progress Reports failed - Server connection error'
      );
    }

    return response.data.data.GetUserContentChildProgressReport;
  }

  async createChildProgressReport(
    input: ChildProgressReportInput
  ): Promise<ChildProgressReport> {
    const apiInstance = api(Config.graphQlApi, this._accessToken);
    const response = await apiInstance.post<any>(``, {
      query: `
        mutation createChildProgressReport($input: ChildProgressReportInput) {
          createChildProgressReport(input: $input) {
            id
            reportContent
            classroomGroupId
            userId
            childId
          }
        }
      `,
      variables: {
        input: input,
      },
    });

    if (response.status !== 200) {
      throw new Error(
        'Updating child progress report failed - Server connection error'
      );
    }

    return response.data.data.createChildProgressReport;
  }

  async syncChildProgressReport(
    input: ChildProgressReportInput
  ): Promise<boolean> {
    const apiInstance = api(Config.graphQlApi, this._accessToken);
    const response = await apiInstance.post<any>(``, {
      query: `
        mutation updateChildProgressReport($input: ChildProgressReportInput, $id: UUID) {
          updateChildProgressReport(input: $input, id: $id) {
            id
            reportContent
            classroomGroupId
            userId
            childId
          }
        }
      `,
      variables: {
        input: input,
        id: input.Id,
      },
    });

    if (response.status !== 200) {
      throw new Error(
        'Updating child progress report failed - Server connection error'
      );
    }

    return true;
  }

  async updateChildProgressReport(
    input: ChildProgressReportInput,
    id: string
  ): Promise<ChildProgressReport> {
    const apiInstance = api(Config.graphQlApi, this._accessToken);
    const response = await apiInstance.post<any>(``, {
      query: `
        mutation updateChildProgressReport($input: ChildProgressReportInput,$id:UUID!) {
          updateChildProgressReport(input: $input,id:$id) {
            id
            reportContent
            classroomGroupId
            userId
            childId
          }
        }
      `,
      variables: {
        input: input,
        id: id,
      },
    });

    if (response.status !== 200) {
      throw new Error(
        'Updating child progress report failed - Server connection error'
      );
    }

    return response.data.data.updateChildProgressReport;
  }

  async generateChildProgressReport(
    childId: string,
    classgroupId: string,
    reportDate: Date
  ): Promise<string> {
    const apiInstance = api(Config.graphQlApi, this._accessToken);
    const response = await apiInstance.post<any>(``, {
      query: `
        query generateChildProgressReport($childId: UUID!,$classgroupId:UUID!,$reportDate:DateTime!) {
          generateChildProgressReport(childId: $childId,classgroupId:$classgroupId,reportDate:$reportDate)
        }
      `,
      variables: {
        childId: childId,
        classgroupId: classgroupId,
        reportDate: reportDate,
      },
    });

    if (response.status !== 200) {
      throw new Error('Updating child failed - Server connection error');
    }

    return response.data.data.generateChildProgressReport;
  }

  async getChildProgressReportsSummary(
    count: number = 5
  ): Promise<ChildProgressReportSummaryModel[]> {
    const apiInstance = api(Config.graphQlApi, this._accessToken);
    const response = await apiInstance.post<any>(``, {
      query: `
        query childProgressReportSummary($count: Int!) {
          childProgressReportSummary(count: $count) {    
            reportId      
            categories {
              achievedLevelId
              categoryId
              tasks {
                levelId
                skillId
                value
              }       
            }
            childId
            childFirstname
            childSurname
            classroomName
            reportDate      
            reportPeriod
            reportDateCreated
            reportDateCompleted
        }
      }
      `,
      variables: {
        count: count,
      },
    });
    if (response.status !== 200) {
      throw new Error(
        'Get child progress report summary failed - Server connection error'
      );
    }
    return response.data.data.childProgressReportSummary;
  }

  async getDetailedProgressReports(
    count: number = 5
  ): Promise<ChildProgressObservationReport[]> {
    const apiInstance = api(Config.graphQlApi, this._accessToken);
    const response = await apiInstance.post<any>(``, {
      query: `
        query childProgressReports($count: Int!) {
          childProgressReports(count: $count) {  
            id
            categories {
              achievedLevelId
              categoryId
              status
              supportingTask {
                taskDescription
                taskId
                todoText
              }
              tasks {
                description
                levelId
                skillId
                value
              }
            }
            childId
            childFirstname
            childSurname
            classroomName
            dateCompleted
            dateCreated
            reportingPeriod
            reportingDate
            howCanCaregiverHelpChild
            practitionerPhotoUrl
            practitionerSurname
            practitionerFirstname
            childEnjoys 
          }
        }
      `,
      variables: {
        count: count,
      },
    });
    if (response.status !== 200) {
      throw new Error(
        'Get child progress reports failed - Server connection error'
      );
    }
    return response.data.data.childProgressReports;
  }

  async getDetailedProgressReport(
    reportId: string
  ): Promise<ChildProgressObservationReport> {
    const apiInstance = api(Config.graphQlApi, this._accessToken);
    const response = await apiInstance.post<any>(``, {
      query: `
        query childProgressReport($reportId: UUID!) {
          childProgressReport(reportId: $reportId) {  
          id
          categories {
            achievedLevelId
            categoryId
            status
            missingTasks {
              description
              levelId
              skillId
              value
            }
            supportingTask {
              taskDescription
              taskId
              todoText
            }
            tasks {
              description
              levelId
              skillId
              value
            }
          }
          childId
          childFirstname
          childSurname
          classroomName
          dateCompleted
          dateCreated
          reportingPeriod
          reportingDate
          howCanCaregiverHelpChild
          practitionerPhotoUrl
          practitionerSurname
          practitionerFirstname
          childEnjoys 
        }
      }`,
      variables: {
        reportId: reportId,
      },
    });
    if (response.status !== 200) {
      throw new Error('Get progress report failed - Server connection error');
    }
    return response.data.data.childProgressReport;
  }
}

export default ContentReportService;
