import { api } from '../axios.helper';
import {
  Config,
  UserDto,
  PractitionerDto,
  PractitionerColleagues,
  ClassroomGroupDto,
  EcdRegistrationDto,
} from '@ecdlink/core';
import {
  ClassroomGroupReassignmentsInput,
  EcdRegistrationInputModelInput,
  EcdRegistrationUpdateInputModelInput,
  MutationAddPractitionerToPrincipalArgs,
  MutationUpdatePractitionerContactInfoArgs,
  NotificationDisplay,
  PractitionerInput,
  PractitionerRemovalHistory,
  PrincipalInvitationStatus,
} from '@ecdlink/graphql';

class PractitionerService {
  _accessToken: string;

  constructor(accessToken: string) {
    this._accessToken = accessToken;
  }

  async getPractitionersForCoach(userId: string): Promise<PractitionerDto[]> {
    const apiInstance = api(Config.graphQlApi, this._accessToken);

    const response = await apiInstance.post<any>(``, {
      id: 'allPractitionersForCoach',
      variables: {
        userId,
      },
    });

    if (response.status !== 200 || !!response.data.errors) {
      throw new Error(
        'Get Practitioners For Coach Failed - Server connection error'
      );
    }

    return response.data.data.allPractitionersForCoach;
  }

  async getPractitionerById(id: string): Promise<PractitionerDto> {
    const apiInstance = api(Config.graphQlApi, this._accessToken);
    const response = await apiInstance.post<any>(``, {
      id: 'GetPractitionerById',
      variables: {
        id: id,
      },
    });

    if (response.status !== 200 || !!response.data.errors) {
      throw new Error('Get Practitioner Failed - Server connection error');
    }

    return response.data.data.GetPractitionerById;
  }

  async getPractitionerByUserId(userId: string): Promise<PractitionerDto> {
    const apiInstance = api(Config.graphQlApi, this._accessToken);
    const response = await apiInstance.post<any>(``, {
      id: 'GetPractitionerByUserId',
      variables: {
        userId,
      },
    });

    if (response.status !== 200) {
      throw new Error(
        'Get Practitioner by user id Failed - Server connection error'
      );
    }

    return response.data.data.practitionerByUserId;
  }

  async getPractitionerPermissions(userId: string): Promise<PractitionerDto> {
    const apiInstance = api(Config.graphQlApi, this._accessToken);
    const response = await apiInstance.post<any>(``, {
      id: 'GetPractitionerPermissions',
      variables: {
        userId,
      },
    });

    if (response.status !== 200) {
      throw new Error(
        'Get Practitioner by user id Failed - Server connection error'
      );
    }

    return response.data.data.practitionerPermissions;
  }

  async getAllPractitioners(): Promise<PractitionerDto[]> {
    const apiInstance = api(Config.graphQlApi, this._accessToken);
    const response = await apiInstance.post<any>(``, {
      id: 'GetAllPractitioners',
    });

    if (response.status !== 200 || !!response.data.errors) {
      throw new Error('Get All Practitioners Failed - Server connection error');
    }

    return response.data.data.allPractitioners;
  }

  async getPractitionerByIdNumber(idNumber: string): Promise<UserDto> {
    const apiInstance = api(Config.graphQlApi, this._accessToken);
    const response = await apiInstance.post<any>(``, {
      id: 'GetPractitionerByIdNumber',
      variables: {
        idNumber,
      },
    });

    if (response.status !== 200) {
      throw new Error(
        'Get Practitioner by ID number Failed - Server connection error'
      );
    }

    return response.data.data.practitionerByIdNumber;
  }

  // promotePractitionerToPrincipal(userId: String): Practitioner
  async PromotePractitionerToPrincipal(userId: string): Promise<UserDto> {
    const apiInstance = api(Config.graphQlApi, this._accessToken);
    const response = await apiInstance.post<any>(``, {
      id: 'promotePractitionerToPrincipal',
      variables: {
        userId,
      },
    });

    if (response.status !== 200) {
      throw new Error(
        'Get Practitioner by ID number Failed - Server connection error'
      );
    }

    return response.data.data.promotePractitionerToPrincipal;
  }

  // Used only by coach stuff, we should refactor and remove this when we work on coach functionality
  // Already removed on the BE
  async getClassroomGroupClassroomsForPractitioner(
    userId: string
  ): Promise<ClassroomGroupDto[]> {
    const apiInstance = api(Config.graphQlApi, this._accessToken);
    const response = await apiInstance.post<any>(``, {
      id: 'GetClassroomGroupClassroomsForPractitioner',
      variables: {
        userId,
      },
    });

    if (response.status !== 200) {
      throw new Error(
        'Get Practitioner classrooms Failed - Server connection error'
      );
    }

    return response.data.data.classroomGroupClassroomsForPractitioner;
  }

  async UpdatePractitionerShareInfo(practitionerId: string): Promise<boolean> {
    const apiInstance = api(Config.graphQlApi, this._accessToken);
    const response = await apiInstance.post<any>(``, {
      id: 'updatePractitionerShareInfo',
      variables: {
        practitionerId,
      },
    });

    if (response.status !== 200) {
      throw new Error(
        'Get Practitioner by ID number Failed - Server connection error'
      );
    }

    return response.data.data.updatePractitionerShareInfo;
  }

  async UpdatePractitionerRegistered(
    practitionerId: string,
    status: boolean = true
  ): Promise<boolean> {
    const apiInstance = api(Config.graphQlApi, this._accessToken);
    const response = await apiInstance.post<any>(``, {
      id: 'UpdatePractitionerRegistered',
      variables: {
        practitionerId,
        status,
      },
    });

    if (response.status !== 200) {
      throw new Error(
        'Get Practitioner by ID number Failed - Server connection error'
      );
    }

    return response.data.data.updatePractitionerRegistered;
  }

  async UpdatePractitionerProgress(
    practitionerId: string,
    progress: any
  ): Promise<boolean> {
    const apiInstance = api(Config.graphQlApi, this._accessToken);
    const response = await apiInstance.post<any>(``, {
      id: 'updatePractitionerProgress',
      variables: {
        practitionerId,
        progress,
      },
    });

    if (response.status !== 200) {
      throw new Error(
        'UpdatePractitionerProgress Failed - Server connection error'
      );
    }

    return response.data.data.updatePractitionerProgress;
  }

  async UpdatePractitionerUsePhotoInReport(
    practitionerId: string,
    usePhotoInReport: string
  ): Promise<boolean> {
    const apiInstance = api(Config.graphQlApi, this._accessToken);
    const response = await apiInstance.post<any>(``, {
      id: 'updatePractitionerUsePhotoInReport',
      variables: {
        practitionerId,
        usePhotoInReport,
      },
    });

    if (response.status !== 200) {
      throw new Error(
        'UpdatePractitionerProgress Failed - Server connection error'
      );
    }

    return response.data.data.updatePractitionerUsePhotoInReport;
  }

  async AddPractitionerToPrincipal(
    input: MutationAddPractitionerToPrincipalArgs
  ): Promise<UserDto> {
    const apiInstance = api(Config.graphQlApi, this._accessToken);
    const response = await apiInstance.post<any>(``, {
      id: 'addPractitionerToPrincipal',
      variables: {
        userId: input.userId,
        idNumber: input.idNumber,
        firstName: input.firstName,
        lastName: input.lastName,
        programmeTypeId: input.programmeTypeId,
        preschoolCode: input.preschoolCode,
      },
    });

    if (response.status !== 200) {
      throw new Error(
        'Get Practitioner by ID number Failed - Server connection error'
      );
    }

    return response.data.data.addPractitionerToPrincipal;
  }

  async UpdatePractitionerByid(
    practitionerId: string,
    input: MutationUpdatePractitionerContactInfoArgs
  ): Promise<PractitionerDto> {
    const apiInstance = api(Config.graphQlApi, this._accessToken);
    const response = await apiInstance.post<any>(``, {
      id: 'updatePractitionerContactInfo',
      variables: {
        practitionerId,
        input,
      },
    });
    if (response.status !== 200) {
      throw new Error(
        'Update Practitioner by ID number Failed - Server connection error'
      );
    }

    return response.data.data.updatePractitionerContactInfo;
  }

  async UpdatePrincipalInvitation(
    practitionerId: string,
    principalId: string,
    accepted: boolean = true
  ): Promise<PrincipalInvitationStatus> {
    const apiInstance = api(Config.graphQlApi, this._accessToken);
    const response = await apiInstance.post<any>(``, {
      id: 'updatePrincipalInvitation',
      variables: {
        practitionerId,
        principalId,
        accepted,
      },
    });

    if (response.status !== 200) {
      throw new Error(
        'Get Practitioner by ID number Failed - Server connection error'
      );
    }
    return response.data.data.updatePrincipalInvitation;
  }

  async RemovePractitioner(
    practitionerUserId: string,
    reasonForPractitionerLeavingId: string | undefined = undefined,
    reasonDetails: string | undefined = undefined,
    newPrincipalId: string | undefined = undefined,
    classroomGroupReassignments: ClassroomGroupReassignmentsInput[]
  ): Promise<boolean> {
    const apiInstance = api(Config.graphQlApi, this._accessToken);

    const response = await apiInstance.post<any>(``, {
      id: 'removePractitioner',
      variables: {
        practitionerUserId,
        reasonForPractitionerLeavingId,
        reasonDetails,
        newPrincipalId,
        classroomGroupReassignments,
      },
    });

    if (
      response.status !== 200 ||
      !!response.data.errors ||
      !response.data.data.removePractitioner
    ) {
      throw new Error('Remove practitioner failed');
    }

    return response.data.data.removePractitioner;
  }

  async RemovePractitionerFromProgramme(
    practitionerUserId: string,
    reasonForPractitionerLeavingProgrammeId: string | undefined = undefined,
    reasonDetails: string | undefined = undefined,
    classroomId: string,
    dateOfRemoval: Date,
    classroomGroupReassignments: ClassroomGroupReassignmentsInput[]
  ): Promise<boolean> {
    const apiInstance = api(Config.graphQlApi, this._accessToken);
    const response = await apiInstance.post<any>(``, {
      id: 'removeFromProgramme',
      variables: {
        practitionerUserId,
        reasonForPractitionerLeavingProgrammeId,
        reasonDetails,
        classroomId,
        dateOfRemoval,
        classroomGroupReassignments,
      },
    });

    if (response.status !== 200) {
      throw new Error(
        'Get Practitioner by ID number Failed - Server connection error'
      );
    }

    return response.data.data.removeFromProgramme;
  }

  async displayMetrics(type: string): Promise<NotificationDisplay[]> {
    const apiInstance = api(Config.graphQlApi, this._accessToken);
    const response = await apiInstance.post<any>(``, {
      id: 'displayMetrics',
      variables: {
        type,
      },
    });

    if (response.status !== 200) {
      throw new Error('Display metrics Failed - Server connection error');
    }

    return response.data.data.displayMetrics;
  }

  // Can we remove this now?
  async getClassroomActionItems(
    practitionerId: string
  ): Promise<NotificationDisplay[]> {
    const apiInstance = api(Config.graphQlApi, this._accessToken);
    const response = await apiInstance.post<any>(``, {
      id: 'classroomActionItems',
      variables: {
        practitionerId,
      },
    });

    if (response.status !== 200) {
      throw new Error('Display metrics Failed - Server connection error');
    }

    return response.data.data.classroomActionItems;
  }

  async getPractitionerColleagues(
    userId: string
  ): Promise<PractitionerColleagues[]> {
    const apiInstance = api(Config.graphQlApi, this._accessToken);
    const response = await apiInstance.post<any>(``, {
      id: 'practitionerColleagues',
      variables: {
        userId,
      },
    });

    if (response.status !== 200) {
      throw new Error(
        'Practitioner Colleagues Failed - Server connection error'
      );
    }

    return response.data.data.practitionerColleagues;
  }

  async updatePractitionerEmergencyContact(
    userId: string,
    firstname: string,
    surname: string,
    contactno: string
  ): Promise<boolean> {
    const apiInstance = api(Config.graphQlApi, this._accessToken);
    const response = await apiInstance.post<any>(``, {
      id: 'updatePractitionerEmergencyContact',
      variables: {
        userId,
        firstname,
        surname,
        contactno,
      },
    });

    if (response.status !== 200) {
      throw new Error(
        'Update Emergency contact information failed - Server connection error'
      );
    }

    return response.data.data.updatePractitionerEmergencyContact;
  }

  async updatePractitioner(
    userId: PractitionerInput['Id'],
    practitioner: PractitionerInput
  ): Promise<boolean> {
    const apiInstance = api(Config.graphQlApi, this._accessToken);
    const response = await apiInstance.post<any>(``, {
      id: 'updatePractitioner',
      variables: {
        id: userId,
        input: practitioner,
      },
    });

    if (response.status !== 200) {
      throw new Error('Updating Practitioner failed - Server connection error');
    }

    return true;
  }

  async getMoodleSessionForCurrentUser(): Promise<string> {
    const apiInstance = api(Config.graphQlApi, this._accessToken);

    const response = await apiInstance.post<any>(``, {
      id: 'getMoodleSessionForCurrentUser',
    });
    if (response.status !== 200) {
      throw new Error('Get Practitioner Failed - Server connection error');
    }

    return response.data.data.getMoodleSessionForCurrentUser;
  }

  async GetPractitionerInviteCount(userId: string): Promise<string> {
    const apiInstance = api(Config.graphQlApi, this._accessToken);

    const response = await apiInstance.post<any>(``, {
      id: 'GetPractitionerInviteCount',
      variables: {
        userId,
      },
    });
    if (response.status !== 200) {
      throw new Error('Get Practitioner Failed - Server connection error');
    }

    return response.data.data.practitionerInviteCount;
  }

  async GetLastPractitionerInviteDate(userId: string): Promise<string> {
    const apiInstance = api(Config.graphQlApi, this._accessToken);

    const response = await apiInstance.post<any>(``, {
      id: 'GetLastPractitionerInviteDate',
      variables: {
        userId,
      },
    });
    if (response.status !== 200) {
      throw new Error(
        'Get Practitioner Invite Date Failed - Server connection error'
      );
    }

    return response.data.data.lastPractitionerInviteDate;
  }

  async GetAllPractitionerInvites(userId: string): Promise<Date[]> {
    const apiInstance = api(Config.graphQlApi, this._accessToken);

    const response = await apiInstance.post<{
      data: { allPractitionerInvites: Date[] };
      errors?: {};
    }>(``, {
      id: 'GetAllPractitionerInvites',
      variables: {
        userId,
      },
    });
    if (response.status !== 200) {
      throw new Error(
        'Get Practitioner Invite Dates Failed - Server connection error'
      );
    }

    return response.data.data.allPractitionerInvites;
  }

  async SendPractitionerInviteToApplication(userId: string): Promise<string> {
    const apiInstance = api(Config.graphQlApi, this._accessToken);

    const response = await apiInstance.post<any>(``, {
      id: 'SendPractitionerInviteToApplication',
      variables: {
        userId,
      },
    });
    if (response.status !== 200) {
      throw new Error('Get Practitioner Failed - Server connection error');
    }

    return response.data.data.sendPractitionerInviteToApplication;
  }

  async deActivatePractitioner(
    userId: string,
    reasonForPractitionerLeavingId: string,
    leavingComment?: string,
    reasonDetails?: string
  ): Promise<boolean> {
    const apiInstance = api(Config.graphQlApi, this._accessToken);

    const response = await apiInstance.post<{
      data: { deActivatePractitioner: boolean };
      errors?: {};
    }>(``, {
      id: 'DeActivatePractitioner',
      variables: {
        userId,
        leavingComment,
        reasonForPractitionerLeavingId,
        reasonDetails,
      },
    });
    if (response.status !== 200 || response.data.errors) {
      throw new Error(
        'Deactivate Practitioner Failed - Server connection error'
      );
    }

    return response.data.data.deActivatePractitioner;
  }

  async getRemovalForPractitioner(
    userId: string
  ): Promise<PractitionerRemovalHistory | undefined> {
    const apiInstance = api(Config.graphQlApi, this._accessToken);
    const response = await apiInstance.post<any>(``, {
      id: 'removalDetailsForPractitioner',
      variables: {
        userId,
      },
    });

    if (response.status !== 200) {
      throw new Error(
        'Get practitioner removal Failed - Server connection error'
      );
    }

    return response.data.data.removalDetailsForPractitioner;
  }

  async getRemovalsForPractitioners(
    userIds: string[]
  ): Promise<PractitionerRemovalHistory[] | undefined> {
    const apiInstance = api(Config.graphQlApi, this._accessToken);
    const response = await apiInstance.post<any>(``, {
      id: 'removalDetailsForPractitioners',
      variables: {
        userIds,
      },
    });

    if (response.status !== 200) {
      throw new Error(
        'Get practitioners removals Failed - Server connection error'
      );
    }

    return response.data.data.removalDetailsForPractitioners;
  }

  async updateRemovePractitionerFromProgramme(
    removalId: string,
    reasonForPractitionerLeavingProgrammeId: string | undefined = undefined,
    reasonDetails: string | undefined = undefined,
    dateOfRemoval: Date,
    classroomGroupReassignments: ClassroomGroupReassignmentsInput[]
  ): Promise<boolean> {
    const apiInstance = api(Config.graphQlApi, this._accessToken);
    const response = await apiInstance.post<any>(``, {
      id: 'updateRemovalFromProgramme',
      variables: {
        removalId,
        reasonForPractitionerLeavingProgrammeId,
        reasonDetails,
        dateOfRemoval,
        classroomGroupReassignments,
      },
    });

    if (response.status !== 200) {
      throw new Error(
        'Update practitioner removal Failed - Server connection error'
      );
    }

    return response.data.data.removeFromProgramme;
  }

  async cancelRemovePractitionerFromProgramme(
    removalId: string
  ): Promise<boolean> {
    const apiInstance = api(Config.graphQlApi, this._accessToken);
    const response = await apiInstance.post<any>(``, {
      id: 'cancelRemovalFromProgramme',
      variables: {
        removalId,
      },
    });

    if (response.status !== 200) {
      throw new Error(
        'Cancel practitioner removal Failed - Server connection error'
      );
    }

    return response.data.data.removeFromProgramme;
  }

  async switchPrincipal(
    oldPrincipalUserId: string,
    newPrincipalUserId: string
  ): Promise<boolean> {
    const apiInstance = api(Config.graphQlApi, this._accessToken);
    const response = await apiInstance.post<any>(``, {
      id: 'switchPrincipal',
      variables: {
        oldPrincipalUserId,
        newPrincipalUserId,
      },
    });

    if (response.status !== 200) {
      throw new Error('Switch principal Failed - Server connection error');
    }

    return response.data.data.switchPrincipal;
  }

  async UpdatePractitionerBusinessWalkthrough(): Promise<boolean> {
    const apiInstance = api(Config.graphQlApi, this._accessToken);
    const response = await apiInstance.post<any>(``, {
      id: 'UpdatePractitionerBusinessWalkthrough',
    });

    if (response.status !== 200) {
      throw new Error(
        'Update practitioner business walk through Failed - Server connection error'
      );
    }

    return response.data.data.updatePractitionerBusinessWalkthrough;
  }

  async UpdatePractitionerProgressWalkthrough(): Promise<boolean> {
    const apiInstance = api(Config.graphQlApi, this._accessToken);
    const response = await apiInstance.post<any>(``, {
      id: 'UpdatePractitionerProgressWalkthrough',
    });

    if (response.status !== 200) {
      throw new Error(
        'Update practitioner progress walk through Failed - Server connection error'
      );
    }

    return response.data.data.updatePractitionerProgressWalkthrough;
  }

  async sendPractitionerInvitePrincipal(
    principalPhoneNumber: string,
    practitionerUserId: string
  ): Promise<boolean> {
    const apiInstance = api(Config.graphQlApi, this._accessToken);
    const response = await apiInstance.post<any>(``, {
      id: 'SendPrincipalInviteToApplication',
      variables: {
        principalPhoneNumber,
        practitionerUserId,
      },
    });

    if (response.status !== 200) {
      throw new Error('Invite principal Failed - Server connection error');
    }

    return response.data.data.sendPrincipalInviteToApplication;
  }

  async sendPractitionerInviteToPreschool(
    practitionerPhoneNumber: string,
    preSchoolNameCode: string,
    preSchoolName: string,
    principalUserId: string,
    idOrPassport?: string
  ): Promise<boolean> {
    const apiInstance = api(Config.graphQlApi, this._accessToken);
    const response = await apiInstance.post<any>(``, {
      id: 'SendPractitionerInviteToPreSchool',
      variables: {
        practitionerPhoneNumber,
        preSchoolNameCode,
        preSchoolName,
        principalUserId,
        idOrPassport,
      },
    });

    if (response.status !== 200) {
      throw new Error('Invite principal Failed - Server connection error');
    }

    return response.data.data.sendPrincipalInviteToApplication;
  }

  async updatePractitionerCommunityTabStatus(
    practitionerUserId: string
  ): Promise<any> {
    const apiInstance = api(Config.graphQlApi, this._accessToken);
    const response = await apiInstance.post<any>(``, {
      id: 'UpdatePractitionerCommunityTabStatus',
      variables: {
        practitionerUserId,
      },
    });

    if (response.status !== 200 || response.data.errors) {
      throw new Error(
        'Updating practitioner community status failed - Server connection error'
      );
    }

    return response.data.data.updatePractitionerCommunityTabStatus;
  }

  async updateClickedECDHeros(userId: string): Promise<any> {
    const apiInstance = api(Config.graphQlApi, this._accessToken);
    const response = await apiInstance.post<any>(``, {
      id: 'UpdateClickedECDHeros',
      variables: {
        userId,
      },
    });

    if (response.status !== 200 || response.data.errors) {
      throw new Error(
        'Updating practitioner clicked ECD heroes status failed - Server connection error'
      );
    }

    return response.data.data.updateClickedECDHeros;
  }

  async createPractitionerEcdRegistration(
    input: EcdRegistrationInputModelInput
  ): Promise<EcdRegistrationDto> {
    const apiInstance = api(Config.graphQlApi, this._accessToken);
    const response = await apiInstance.post<any>(``, {
      id: 'CreateEcdRegistration',
      variables: {
        input,
      },
    });

    if (response.status !== 200) {
      throw new Error(
        'Create ECD registration Failed - Server connection error'
      );
    }

    return response.data.data.createEcdRegistration;
  }

  async updatePractitionerEcdRegistration(
    input: EcdRegistrationUpdateInputModelInput
  ): Promise<EcdRegistrationDto> {
    const apiInstance = api(Config.graphQlApi, this._accessToken);
    const response = await apiInstance.post<any>(``, {
      id: 'UpdateEcdRegistration',
      variables: {
        input,
      },
    });

    if (response.status !== 200) {
      throw new Error(
        'Update ECD registration Failed - Server connection error'
      );
    }

    return response.data.data.updateEcdRegistration;
  }
}

export default PractitionerService;
