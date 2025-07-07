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
      query: `
        query {
          GetAllLearner {
            id            
            classroomGroupId
            startedAttendance
            stoppedAttendance
            userId
            isActive            
          }
        }
          `,
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
      query: `
        mutation updateLearner($id: UUID!, $input: LearnerInput) {
          updateLearner(id: $id, input: $input) {
            id
          }
        }
      `,
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
      query: `
        mutation updateLearnerWithUserId($input: LearnerInputModelInput) {
          updateLearnerWithUserId(input: $input) {
            id
          }
        }
      `,
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
      query: `
        mutation createLearner($input: LearnerInput) {
          createLearner(input: $input) {
            id            
            classroomGroupId
            startedAttendance
            userId            
          }
        }
      `,
      variables: {
        input: input,
      },
    });

    if (response.status !== 200) {
      throw new Error('Creating learner failed - Server connection error');
    }

    return response.data.data.createLearner;
  }

  async updateLearnerHierarchy(
    learnerId: string,
    classroomGroupId: string
  ): Promise<boolean> {
    const apiInstance = api(Config.graphQlApi, this._accessToken);
    const response = await apiInstance.post<any>(``, {
      query: `
        mutation UpdateLearnerHierarchy($learnerId: String,  $classroomGroupId: String,) {
          updateLearnerHierarchy(learnerId: $learnerId, classroomGroupId: $classroomGroupId){
            id
          }
        }
      `,
      variables: {
        learnerId: learnerId,
        classroomGroupId: classroomGroupId,
      },
    });

    if (response.status !== 200) {
      throw new Error(
        'Updating learner hierarchy failed - Server connection error'
      );
    }

    return true;
  }
}

export default ClassroomGroupLearnerService;
