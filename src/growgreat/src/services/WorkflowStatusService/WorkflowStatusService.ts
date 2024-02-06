import { Config, WorkflowStatusDto } from '@ecdlink/core';
import { api } from '../axios.helper';
class WorkflowStatusService {
  _accessToken: string;

  constructor(accessToken: string) {
    this._accessToken = accessToken;
  }

  async getWorkflowStatuses(): Promise<WorkflowStatusDto[]> {
    const apiInstance = api(Config.graphQlApi, this._accessToken);
    const response = await apiInstance.post<any>(``, {
      query: `
        query GetAllWorkflowStatus($isActive: Boolean = true){
          GetAllWorkflowStatus(where: { isActive: { eq: $isActive } }) {
            id
            description
            enumId
          }
        }
          `,
    });

    if (response.status !== 200) {
      throw new Error('Get Workflow Statuses Failed - Server connection error');
    }
    return response.data.data.GetAllWorkflowStatus;
  }
}

export default WorkflowStatusService;
