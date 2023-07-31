import { api } from '../axios.helper';
import {
  Config,
  UserDto,
  PractitionerDto,
  PractitionerColleagues,
  ClassroomGroupDto,
} from '@ecdlink/core';
import {
  ClassroomGroupReassignmentsInput,
  LicenseModelInput,
  MutationAddPractitionerToPrincipalArgs,
  MutationUpdatePractitionerContactInfoArgs,
  PractitionerInput,
  PractitionerRemovalHistory,
} from '@ecdlink/graphql';

interface ReportDetailsForPractitionerData {
  classroomGroupName: string;
  name: string;
  principalName: string;
  classroomGroupId: string;
  programmeTypeName: string;
  idNumber: string;
  insertedDate: string;
  programmeDays: string;
  phone: string;
  classSiteAddress: null | string;
}
class PractitionerService {
  _accessToken: string;

  constructor(accessToken: string) {
    this._accessToken = accessToken;
  }

  async getPractitionersForCoach(userId: string): Promise<PractitionerDto[]> {
    const apiInstance = api(Config.graphQlApi, this._accessToken);

    const response = await apiInstance.post<any>(``, {
      query: `
        query allPractitionersForCoach($userId: String) {
          allPractitionersForCoach(userId: $userId) {
            id
            userId
            programmeType
            timeline {
              consolidationMeetingColor
              consolidationMeetingDate
              consolidationMeetingStatus
              firstAidCourseColor
              firstAidCourseStatus
              firstAidDate
              pQARating1 {
                children {
                  sectionRating
                  sectionRatingColor
                  sectionScore
                  visitSection
                }
                overallRating
                overallRatingColor
                overallRatingStars
                overallScore
                plannedDate
                visitName
              }
              pQARating2 {
                children {
                  sectionRating
                  sectionRatingColor
                  sectionScore
                  visitSection
                }
                overallRating
                overallRatingColor
                overallRatingStars
                overallScore
                plannedDate
                visitName
              }
              pQARating3 {
                children {
                  sectionRating
                  sectionRatingColor
                  sectionScore
                  visitSection
                }
                overallRating
                overallRatingColor
                overallRatingStars
                overallScore
                plannedDate
                visitName
              }
              prePQAVisitDate1
              prePQAVisitDate1Color
              prePQAVisitDate1Status
              prePQAVisitDate2
              prePQAVisitDate2Color
              prePQAVisitDate2Status
              supportVisits {
                id
                plannedVisitDate
                attended
                comment
                visitType {
                  type
                  order
                  name
                  normalizedName
                  description
                }
                eventId
              }
              prePQASiteVisits {
                id
                plannedVisitDate
                attended
                comment
                dueDate
                insertedDate
                visitType {
                  type
                  order
                  name
                  normalizedName
                  description
                }
                eventId
              }
              pQASiteVisits {
                id
                plannedVisitDate
                attended
                comment
                insertedDate
                visitType {
                  type
                  order
                  name
                  normalizedName
                  description
                }
                eventId
              }
              reAccreditationVisits {
                id
                plannedVisitDate
                attended
                comment
                visitType {
                  type
                  order
                  name
                  normalizedName
                  description
                }
                eventId
              }
              reAccreditationRating1 {
                children {
                  sectionRating
                  sectionRatingColor
                  sectionScore
                  visitSection
                }
                overallRating
                overallRatingColor
                overallRatingStars
                overallScore
                plannedDate
                visitName
              }
              reAccreditationRating2 {
                children {
                  sectionRating
                  sectionRatingColor
                  sectionScore
                  visitSection
                }
                overallRating
                overallRatingColor
                overallRatingStars
                overallScore
                plannedDate
                visitName
              }
              reAccreditationRating3 {
                children {
                  sectionRating
                  sectionRatingColor
                  sectionScore
                  visitSection
                }
                overallRating
                overallRatingColor
                overallRatingStars
                overallScore
                plannedDate
                visitName
              }
              smartSpaceLicenseColor
              smartSpaceLicenseDate
              smartSpaceLicenseStatus
              starterLicenseColor
              starterLicenseDate
              starterLicenseStatus
              supportVisits {
                id
                plannedVisitDate
                insertedDate
                attended
                visitType {
                  description
                  id
                  isActive
                  name
                  normalizedName
                  order
                  type
                }
                eventId
              }
            }
          }
        }
      `,
      variables: {
        userId,
      },
    });

    if (response.status !== 200) {
      throw new Error(
        'Get Practitioners For Coach Failed - Server connection error'
      );
    }

    return response.data.data.allPractitionersForCoach;
  }

  async getPractitionerById(id: string): Promise<PractitionerDto> {
    const apiInstance = api(Config.graphQlApi, this._accessToken);
    const response = await apiInstance.post<any>(``, {
      query: `
        query GetPractitionerById($id: UUID) {
          GetPractitionerById(id: $id) {
            id
            userId
            user {
              gender {
                description
              }
              firstName
              surname
              fullName
              email
              isSouthAfricanCitizen
              verifiedByHomeAffairs
            }
            siteAddress {
              id
              province {
                id
                description
              }
              name
              addressLine1
              addressLine2
              addressLine3
              postalCode
              ward
            }
            programmeType
            isPrincipal
            isTrainee
            isRegistered
            isTrainee
            principalHierarchy
            coachHierarchy
            attendanceRegisterLink
            maxChildren
            consentForPhoto
            parentFees
            languageUsedInGroups
            signingSignature
            startDate
            monthSinceFranchisee
            shareInfo
            dateLinked
            dateAccepted
            dateToBeRemoved
            isLeaving
            progress
            attendedChildProgress
            usePhotoInReport
            setupTraineeInitiated
          }
        }
      `,
      variables: {
        id: id,
      },
    });

    if (response.status !== 200) {
      throw new Error('Get Practitioner Failed - Server connection error');
    }

    return response.data.data.GetPractitionerById;
  }

  async getPractitionerByUserId(userId: string): Promise<PractitionerDto> {
    const apiInstance = api(Config.graphQlApi, this._accessToken);
    const response = await apiInstance.post<any>(``, {
      query: `
        query GetPractitionerByUserId($userId: String) {
          practitionerByUserId(userId: $userId) {
            id
            userId
            user {
              id
              firstName
              surname
              fullName
              email
              isSouthAfricanCitizen
              verifiedByHomeAffairs
              gender {
                description
              }
            }
            siteAddress {
              id
              province {
                id
                description
              }
              name
              addressLine1
              addressLine2
              addressLine3
              postalCode
              ward
            }
            programmeType
            isPrincipal
            isRegistered
            principalHierarchy
            attendanceRegisterLink
            maxChildren
            consentForPhoto
            parentFees
            languageUsedInGroups
            signingSignature
            startDate
            monthSinceFranchisee
            shareInfo
            dateLinked
            dateAccepted
            dateToBeRemoved
            isLeaving
            progress
            attendedChildProgress
            usePhotoInReport
          }
        }
      `,
      variables: {
        userId,
      },
    });

    if (response.status !== 200) {
      throw new Error('Get Practitioner Failed - Server connection error');
    }

    return response.data.data.practitionerByUserId;
  }

  async getAllPractitioners(): Promise<PractitionerDto[]> {
    const apiInstance = api(Config.graphQlApi, this._accessToken);
    const response = await apiInstance.post<any>(``, {
      query: `
        query GetAllPractitioners {
          GetAllPractitioner {
            id
            userId
            isPrincipal
            isFundaAppAdmin
            isTrainee
            programmeType
            principalHierarchy
            isActive
            coachHierarchy
            isRegistered
            shareInfo
            signingSignature
            dateLinked
            dateAccepted
            dateToBeRemoved
            siteAddress {
              addressLine1
              addressLine2
              addressLine3
              area
              id
              municipality
              name
              postalCode
              province {
                id
                description
              }
              provinceId
              updatedBy
              updatedDate
              ward
            }
            isLeaving
            user {
              gender {
                description
              }
              emergencyContactFirstName
              emergencyContactSurname
              emergencyContactPhoneNumber
              idNumber
              fullName
              firstName
              surname
              id
              email
              phoneNumber
              profileImageUrl
              roles {
                id
                name
              }
            }
            dateLinked
            dateAccepted
            dateToBeRemoved
            isLeaving
            progress
            attendedChildProgress
            usePhotoInReport
          }
        }
      `,
    });

    if (response.status !== 200) {
      throw new Error('Get Practitioner Failed - Server connection error');
    }

    return response.data.data.GetAllPractitioner;
  }

  async getPractitionerByIdNumber(idNumber: string): Promise<UserDto> {
    const apiInstance = api(Config.graphQlApi, this._accessToken);
    const response = await apiInstance.post<any>(``, {
      query: `
       query GetPractitionerByIdNumber($idNumber: String) {
          practitionerByIdNumber(idNumber: $idNumber) {
            appUser {
              id
              idNumber
              firstName
              surname
              userName
              practitionerObjectData {
                isRegistered
                isPrincipal
                id
                shareInfo
                programmeType
                principalHierarchy
                dateLinked
                dateAccepted
                dateToBeRemoved
                isLeaving
                progress
                isTrainee
                attendedChildProgress
                usePhotoInReport
              }
            }
            note
          }
        }
      `,
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
      query: `
        mutation promotePractitionerToPrincipal($userId: String) {
          promotePractitionerToPrincipal(userId: $userId) {
            id
            isPrincipal
            user {
              roles {
                id
                name
              }
            }
          }
        }
      `,
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
  async getReportDetailsForPractitioner(
    userId: string
  ): Promise<ReportDetailsForPractitionerData> {
    const apiInstance = api(Config.graphQlApi, this._accessToken);
    const response = await apiInstance.post<any>(``, {
      query: `
      query reportDetailsForPractitioner($userId: String) {
          reportDetailsForPractitioner(userId: $userId) { 
          classroomGroupName
          name
          principalName
          classroomGroupId
          programmeTypeName
          idNumber
          insertedDate
          programmeDays
          phone classSiteAddress
          }     
        }
      `,
      variables: {
        userId,
      },
    });

    if (response.status !== 200) {
      throw new Error(
        'Get Practitioner by ID number Failed - Server connection error'
      );
    }

    return response.data.data.reportDetailsForPractitioner;
  }

  async getClassroomDetailsForPractitioner(
    userId: string
  ): Promise<{ principalName: string; name: string }> {
    const apiInstance = api(Config.graphQlApi, this._accessToken);
    const response = await apiInstance.post<any>(``, {
      query: `
        query classroomDetailsForPractitioner($userId: String) {
          classroomDetailsForPractitioner(userId: $userId) {
            principalName
            name
            classroomGroupName
            classroomGroupId
            insertedDate
          }
        }
      `,
      variables: {
        userId,
      },
    });

    if (response.status !== 200) {
      throw new Error(
        'Get Practitioner by ID number Failed - Server connection error'
      );
    }

    return response.data.data.classroomDetailsForPractitioner;
  }

  async getClassroomGroupClassroomsForPractitioner(
    userId: string
  ): Promise<ClassroomGroupDto[]> {
    const apiInstance = api(Config.graphQlApi, this._accessToken);
    const response = await apiInstance.post<any>(``, {
      query: `
      query GetClassroomGroupClassroomsForPractitioner($userId: String) {
        classroomGroupClassroomsForPractitioner(userId: $userId){
            id
            name
            programmeType {
                description
            }
            classroom {
                id
                siteAddress {
                    name
                    addressLine1
                    addressLine2
                    addressLine3
                    postalCode
                    province {
                        description
                    }
                }
                name
                numberPractitioners
                numberOfAssistants
                numberOfOtherAssistants
            }
            classProgrammes{
                id
                meetingDay
                isFullDay
                classroomGroup{
                    id
                    name
                }
            }
        }
    }
      `,
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

  async UpdatePractitionerShareInfo(
    practitionerId: string,
    principalId: string
  ): Promise<boolean> {
    const apiInstance = api(Config.graphQlApi, this._accessToken);
    const response = await apiInstance.post<any>(``, {
      query: `
        mutation updatePractitionerShareInfo(
          $practitionerId: String
        ) {
          updatePractitionerShareInfo(
            practitionerId: $practitionerId
          )
        }
      `,
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
      query: `
        mutation UpdatePractitionerRegistered(
          $practitionerId: String
          $status: Boolean
        ) {
          updatePractitionerRegistered(
            practitionerId: $practitionerId
            status: $status
          )
        }
      `,
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
      query: `
        mutation updatePractitionerProgress(
          $practitionerId: String
          $progress: Decimal!
        ) {
          updatePractitionerProgress(
            practitionerId: $practitionerId
            progress: $progress
          )
        }
      `,
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
      query: `
        mutation updatePractitionerUsePhotoInReport(
          $practitionerId: String
          $usePhotoInReport: String
        ) {
          updatePractitionerUsePhotoInReport(
            practitionerId: $practitionerId
            usePhotoInReport: $usePhotoInReport
          )
        }
      `,
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
      query: `
        mutation addPractitionerToPrincipal ($firstName: String, $idNumber: String, $lastName: String, $userId: String) {
          addPractitionerToPrincipal(
            firstName: $firstName
            idNumber: $idNumber
            lastName: $lastName
            userId: $userId
          ) {
            userId
            isActive
          }
        }
      `,
      variables: {
        userId: input.userId,
        idNumber: input.idNumber,
        firstName: input.firstName,
        lastName: input.lastName,
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
      query: `
      mutation updatePractitionerContactInfo($practitionerId: String, $firstName: String, $lastName: String, $phoneNumber: String, $email: String) {
        updatePractitionerContactInfo(practitionerId: $practitionerId, firstName: $firstName, lastName: $lastName, phoneNumber: $phoneNumber, email: $email) {
            id
            idNumber
            firstName
            nickFirstName
            nickSurname
              email
            phoneNumber
        }
      }
      `,
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
  ): Promise<boolean> {
    const apiInstance = api(Config.graphQlApi, this._accessToken);
    const response = await apiInstance.post<any>(``, {
      query: `
      mutation updatePrincipalInvitation(
        $practitionerId: String
        $principalId: String
        $accepted: Boolean!
      ) {
        updatePrincipalInvitation(
          practitionerId: $practitionerId
          principalId: $principalId
          accepted: $accepted
        ) {
          leavingDate
          acceptedDate
          linkedDate
          leaving
        }
      }  
      `,
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

    return response.data.data.updatePractitionerRegistered;
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
      query: `
      mutation removePractitioner(
        $practitionerUserId: String
        $reasonForPractitionerLeavingId: String
        $reasonDetails: String
        $newPrincipalId: String
        $classroomGroupReassignments: [ClassroomGroupReassignmentsInput]
      ) {
        removePractitioner(
          practitionerUserId: $practitionerUserId
          reasonForPractitionerLeavingId: $reasonForPractitionerLeavingId
          reasonDetails: $reasonDetails
          newPrincipalId: $newPrincipalId
          classroomGroupReassignments: $classroomGroupReassignments
        ) {
        }
      }  
      `,
      variables: {
        practitionerUserId,
        reasonForPractitionerLeavingId,
        reasonDetails,
        newPrincipalId,
        classroomGroupReassignments,
      },
    });

    if (response.status !== 200) {
      throw new Error(
        'Get Practitioner by ID number Failed - Server connection error'
      );
    }

    return response.data.data.updatePractitionerRegistered;
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
      query: `
      mutation removeFromProgramme(
        $practitionerUserId: String
        $reasonForPractitionerLeavingProgrammeId: String
        $reasonDetails: String
        $classroomId: String
        $dateOfRemoval: DateTime!
        $classroomGroupReassignments: [ClassroomGroupReassignmentsInput]
      ) {
        removeFromProgramme(
          practitionerUserId: $practitionerUserId
          reasonForPractitionerLeavingProgrammeId: $reasonForPractitionerLeavingProgrammeId
          reasonDetails: $reasonDetails
          classroomId: $classroomId
          dateOfRemoval: $dateOfRemoval
          classroomGroupReassignments: $classroomGroupReassignments
        ) {
        }
      }  
      `,
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

  async displayMetrics(type: string): Promise<PractitionerDto[]> {
    const apiInstance = api(Config.graphQlApi, this._accessToken);
    const response = await apiInstance.post<any>(``, {
      query: `
      query displayMetrics($type: String) {
        displayMetrics(type: $type) {
      subject icon color message notes userId userType 
      
        }
      }
      `,
      variables: {
        type,
      },
    });

    if (response.status !== 200) {
      throw new Error('Display metrics Failed - Server connection error');
    }

    return response.data.data.displayMetrics;
  }

  async classroomActionItems(
    practitionerId: string
  ): Promise<PractitionerDto[]> {
    const apiInstance = api(Config.graphQlApi, this._accessToken);
    const response = await apiInstance.post<any>(``, {
      query: `
      query classroomActionItems($practitionerId: String) {
        classroomActionItems(practitionerId: $practitionerId) {
          subject icon color message notes userId userType
        }
      }
      `,
      variables: {
        practitionerId,
      },
    });

    if (response.status !== 200) {
      throw new Error('Display metrics Failed - Server connection error');
    }

    return response.data.data.displayMetrics;
  }

  async practitionerColleagues(
    userId: string
  ): Promise<PractitionerColleagues[]> {
    const apiInstance = api(Config.graphQlApi, this._accessToken);
    const response = await apiInstance.post<any>(``, {
      query: `
      query practitionerColleagues($userId: String) {
        practitionerColleagues(userId: $userId) {
          name title nickName contactNumber classroomNames profilePhoto
        }
      }
      `,
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
      query: `
        mutation updatePractitionerEmergencyContact(
          $userId: String
          $firstname: String
          $surname: String
          $contactno: String
        ) {
          updatePractitionerEmergencyContact(
            userId: $userId
            firstname: $firstname
            surname: $surname
            contactno: $contactno
          )
        }
      `,
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
      query: `
      mutation updatePractitioner($input: PractitionerInput, $id: UUID) {
        updatePractitioner(input: $input, id: $id) {
          id
        }
      }
      `,
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

  async getMoodleSessionForUserId(userId: string): Promise<string> {
    const apiInstance = api(Config.graphQlApi, this._accessToken);

    const response = await apiInstance.post<any>(``, {
      query: `
      query getMoodleSessionForUserId($userId: String) {
        getMoodleSessionForUserId(userId: $userId) {
        }
      }
      `,
      variables: {
        userId,
      },
    });
    if (response.status !== 200) {
      throw new Error('Get Practitioner Failed - Server connection error');
    }

    return response.data.data.getMoodleSessionForUserId;
  }

  async GetPractitionerInviteCount(userId: string): Promise<string> {
    const apiInstance = api(Config.graphQlApi, this._accessToken);

    const response = await apiInstance.post<any>(``, {
      query: `
      query GetPractitionerInviteCount($userId: String) {
        practitionerInviteCount(userId: $userId) {}
    }
      `,
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
      query: `
      query GetLastPractitionerInviteDate($userId: String) {
        lastPractitionerInviteDate(userId: $userId) {
        }
    }
      `,
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

  async GetAllPractitionerInvites(userId: string): Promise<string> {
    const apiInstance = api(Config.graphQlApi, this._accessToken);

    const response = await apiInstance.post<any>(``, {
      query: `
      query GetAllPractitionerInvites($userId: String) {
        allPractitionerInvites(userId: $userId) {}
    }
      `,
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
      query: `
      mutation SendPractitionerInviteToApplication($userId: String) {
        sendPractitionerInviteToApplication(userId: $userId) {}
      }
      `,
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
      query: `
      mutation DeActivatePractitioner($userId: String, $leavingComment: String, $reasonForPractitionerLeavingId: String, $reasonDetails: String) {          
        deActivatePractitioner(userId: $userId, leavingComment: $leavingComment, reasonForPractitionerLeavingId: $reasonForPractitionerLeavingId, reasonDetails: $reasonDetails) {          
      }        
      }
      `,
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

  async delicensePractitioner(input: LicenseModelInput): Promise<boolean> {
    const apiInstance = api(Config.graphQlApi, this._accessToken);

    const response = await apiInstance.post<{
      data: { delicensePractitioner: boolean };
      errors?: {};
    }>(``, {
      query: `
      mutation delicensePractitioner($input: LicenseModelInput) {          
        delicensePractitioner(input: $input) {          
      }        
      }
      `,
      variables: {
        input,
      },
    });
    if (response.status !== 200 || response.data.errors) {
      throw new Error(
        'Delicense Practitioner Failed - Server connection error'
      );
    }

    return response.data.data.delicensePractitioner;
  }

  async getRemovalForPractitioner(
    userId: string
  ): Promise<PractitionerRemovalHistory | undefined> {
    const apiInstance = api(Config.graphQlApi, this._accessToken);
    const response = await apiInstance.post<any>(``, {
      query: `
      query removalDetailsForPractitioner($userId: String) {
        removalDetailsForPractitioner(userId: $userId) {
          dateOfRemoval
          id
          reasonDetails
          reasonForPractitionerLeavingProgrammeId
          removedByUserId,
          classReassignments {
            id,
            reassignedClass,
            reassignedToPractitioner
          }
        }
      }
      `,
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

  async updateRemovePractitionerFromProgramme(
    removalId: string,
    reasonForPractitionerLeavingProgrammeId: string | undefined = undefined,
    reasonDetails: string | undefined = undefined,
    dateOfRemoval: Date,
    classroomGroupReassignments: ClassroomGroupReassignmentsInput[]
  ): Promise<boolean> {
    const apiInstance = api(Config.graphQlApi, this._accessToken);
    const response = await apiInstance.post<any>(``, {
      query: `
      mutation updateRemovalFromProgramme(
        $removalId: String
        $reasonForPractitionerLeavingProgrammeId: String
        $reasonDetails: String
        $dateOfRemoval: DateTime!
        $classroomGroupReassignments: [ClassroomGroupReassignmentsInput]
      ) {
        updateRemovalFromProgramme(
          removalId: $removalId
          reasonForPractitionerLeavingProgrammeId: $reasonForPractitionerLeavingProgrammeId
          reasonDetails: $reasonDetails
          dateOfRemoval: $dateOfRemoval
          classroomGroupReassignments: $classroomGroupReassignments
        ) {
        }
      }  
      `,
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
      query: `
      mutation cancelRemovalFromProgramme(
        $removalId: String
      ) {
        cancelRemovalFromProgramme(
          removalId: $removalId
        ) {
        }
      }  
      `,
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
}

export default PractitionerService;
