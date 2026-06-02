import { Config, LearnerDto } from '@ecdlink/core';
import { LearnerInput, LearnerInputModelInput } from '@ecdlink/graphql';
import { api } from '../axios.helper';
class ClassroomGroupLearnerService {
  _accessToken: string;

  constructor(accessToken: string) {
    this._accessToken = accessToken;
  }

  async getClassroomGroupLearners(): Promise<LearnerDto[]> {
    const apiInstance = api(Config.graphQlApi, this._accessToken);
    const response = await apiInstance.post<any>(``, {
      id: 'GetAllLearner',
    });

    if (response.status !== 200) {
      throw new Error(
        'Get Classroom Group Learners Failed - Server connection error'
      );
    }

    return response.data.data.GetAllLearner;
  }

  async updateLearner(id: string, input: LearnerInput): Promise<boolean> {
    const apiInstance = api(Config.graphQlApi, this._accessToken);
    const response = await apiInstance.post<any>(``, {
      id: 'updateLearner',
      variables: {
        id: id,
        input: input,
      },
    });

    if (response.status !== 200) {
      throw new Error('Updating learner failed - Server connection error');
    }

    return true;
  }

  async updateLearnerWithUserId(
    userId: string,
    input: LearnerInputModelInput
  ): Promise<boolean> {
    const apiInstance = api(Config.graphQlApi, this._accessToken);
    const response = await apiInstance.post<any>(``, {
      id: 'updateLearnerWithUserId',
      variables: {
        input: input,
      },
    });

    if (response.status !== 200) {
      throw new Error('Updating learner failed - Server connection error');
    }

    return true;
  }

  async createLearner(input: LearnerInput): Promise<LearnerDto> {
    const apiInstance = api(Config.graphQlApi, this._accessToken);
    const response = await apiInstance.post<any>(``, {
      id: 'createLearner',
      variables: {
        input: input,
      },
    });

    if (response.status !== 200) {
      throw new Error('Creating learner failed - Server connection error');
    }

    return response.data.data.createLearner;
  }

  /**
   * Preferred method for moving a child to a different class.
   * This calls the new MoveChildToClassroomGroup mutation which:
   * - Safely ensures only one active learner for the child (prevents duplicates across devices)
   * - Fully updates the Learner's hierarchy
   * - Fully updates the Child's hierarchy + UserHierarchyEntity
   *   so the child is correctly linked to the new practitioner
   *
   * All in one server call. The frontend does **not** need to (and should no longer) call
   * updateLearnerHierarchy afterwards — the backend owns the hierarchy logic for moves.
   */
  async moveChildToClassroomGroup(
    childUserId: string,
    newClassroomGroupId: string,
    startedAttendance?: string | Date
  ): Promise<any> {
    const apiInstance = api(Config.graphQlApi, this._accessToken);
    const response = await apiInstance.post<any>(``, {
      id: 'MoveChildToClassroomGroup',
      variables: {
        childUserId,
        newClassroomGroupId,
        startedAttendance: startedAttendance ?? new Date().toISOString(),
      },
    });

    if (response.status !== 200) {
      throw new Error(
        'Moving child to new class failed - Server connection error'
      );
    }

    return response.data.data.moveChildToClassroomGroup;
  }
}

export default ClassroomGroupLearnerService;
