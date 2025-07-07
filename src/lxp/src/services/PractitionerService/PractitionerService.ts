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
  MutationAddPractitionerToPrincipalArgs,
  MutationUpdatePractitionerContactInfoArgs,
  NotificationDisplay,
  PractitionerInput,
  PractitionerRemovalHistory,
  PractitionerReportDetails,
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
              pQARatings {
                visitId
                linkedVisitId
                sections {
                  sectionRating
                  sectionRatingColor
                  sectionScore
                  visitSection
                }
                overallRating
                overallRatingColor
                overallRatingStars
                overallScore
                visitName
                visitTypeName
              }
              pQASiteVisits {
                id
                hasAnswerData
                delicenseQuestionAnswered
                plannedVisitDate
                attended
                comment
                insertedDate
                overallRatingColor
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
                hasAnswerData
                delicenseQuestionAnswered
                plannedVisitDate
                attended
                comment
                insertedDate
                overallRatingColor
                visitType {
                  type
                  order
                  name
                  normalizedName
                  description
                }
                eventId
              }
              reAccreditationRatings {
                visitId
                linkedVisitId
                sections {
                  sectionRating
                  sectionRatingColor
                  sectionScore
                  visitSection
                }
                overallRating
                overallRatingColor
                overallRatingStars
                overallScore
                visitName
                visitTypeName
              }
              requestedCoachVisits {
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
              }
              selfAssessmentVisits {
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
              idNumber
              phoneNumber
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
            coachHierarchy
            attendanceRegisterLink
            consentForPhoto
            parentFees
            languageUsedInGroups
            signingSignature
            startDate
            shareInfo
            dateLinked
            dateAccepted
            dateToBeRemoved
            isLeaving
            progress
            usePhotoInReport
            isCompletedBusinessWalkThrough
          }
        }
      `,
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
      query: `
        query GetPractitionerByUserId($userId: String) {
          practitionerByUserId(userId: $userId) {
            id
            userId
            user {
              gender {
                description
              }
              firstName
              surname
              fullName
              userName
              email
              isSouthAfricanCitizen
              verifiedByHomeAffairs
              idNumber
              phoneNumber
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
            coachHierarchy
            coachName
            coachProfilePic
            attendanceRegisterLink
            consentForPhoto
            parentFees
            languageUsedInGroups
            signingSignature
            startDate
            shareInfo
            dateLinked
            dateAccepted
            dateToBeRemoved
            isLeaving
            progress
            usePhotoInReport
            isCompletedBusinessWalkThrough
            clickedCommunityTab
            communitySectionViewDate
            progressWalkthroughComplete
            absentees {
              absentDate
              absentDateEnd
              className
              classroomGroupId
              reason
              reassignedToPerson
              reassignedToUserId
              absenteeId
              loggedByPerson
              loggedByUserId
            }
            permissions {
              id
              userId
              permissionId
              isActive
              permissionName
              permissionNormalizedName
              permissionGrouping
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
        'Get Practitioner by user id Failed - Server connection error'
      );
    }

    return response.data.data.practitionerByUserId;
  }

  async getPractitionerPermissions(userId: string): Promise<PractitionerDto> {
    const apiInstance = api(Config.graphQlApi, this._accessToken);
    const response = await apiInstance.post<any>(``, {
      query: `
        query GetPractitionerPermissions($userId: String) {
          practitionerPermissions(userId: $userId) {
            id
            permissions {
              id
              userId
              permissionId
              isActive
              permissionName
              permissionNormalizedName
              permissionGrouping
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
        'Get Practitioner by user id Failed - Server connection error'
      );
    }

    return response.data.data.practitionerPermissions;
  }

  async getAllPractitioners(): Promise<PractitionerDto[]> {
    const apiInstance = api(Config.graphQlApi, this._accessToken);
    const response = await apiInstance.post<any>(``, {
      query: `
        query GetAllPractitioners {
          allPractitioners {
            id
            userId
            isPrincipal
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
            daysAbsentLastMonth
            permissions {
              id
              isActive
              permissionId
              permissionName
              permissionNormalizedName
              permissionGrouping
            }
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
              userName
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
            usePhotoInReport
            isCompletedBusinessWalkThrough
            absentees {
              absentDate
              absentDateEnd
              className
              classroomGroupId
              reason
              reassignedToPerson
              reassignedToUserId
              absenteeId
          }
          }
        }
      `,
    });

    if (response.status !== 200 || !!response.data.errors) {
      throw new Error('Get All Practitioners Failed - Server connection error');
    }

    return response.data.data.allPractitioners;
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
                usePhotoInReport
                isCompletedBusinessWalkThrough
              }
                userPermissions {
                id
                isActive
                permissionId
               permission {
                id
                name
               }
            }
            }
            isRegistered
            belongsToPreschool
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
  ): Promise<PractitionerReportDetails> {
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

  // Used only by coach stuff, we should refactor and remove this when we work on coach functionality
  // Already removed on the BE
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

  async UpdatePractitionerShareInfo(practitionerId: string): Promise<boolean> {
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
        mutation addPractitionerToPrincipal ($firstName: String, $idNumber: String, $lastName: String, $userId: String, $preschoolCode: String) {
          addPractitionerToPrincipal(
            firstName: $firstName
            idNumber: $idNumber
            lastName: $lastName
            userId: $userId
            preschoolCode: $preschoolCode
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
  ): Promise<PrincipalInvitationStatus> {
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

  async displayMetrics(type: string): Promise<NotificationDisplay[]> {
    const apiInstance = api(Config.graphQlApi, this._accessToken);
    const response = await apiInstance.post<any>(``, {
      query: `
      query displayMetrics($type: String) {
        displayMetrics(type: $type) {
          subject
          icon
          color
          message
          notes
          userId
          userType 
          groupingName     
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

  // Can we remove this now?
  async classroomActionItems(
    practitionerId: string
  ): Promise<NotificationDisplay[]> {
    const apiInstance = api(Config.graphQlApi, this._accessToken);
    const response = await apiInstance.post<any>(``, {
      query: `
      query classroomActionItems($practitionerId: String) {
        classroomActionItems(practitionerId: $practitionerId) {
          subject
          icon
          color
          message
          notes
          userId
          userType
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

    return response.data.data.classroomActionItems;
  }

  async practitionerColleagues(
    userId: string
  ): Promise<PractitionerColleagues[]> {
    const apiInstance = api(Config.graphQlApi, this._accessToken);
    const response = await apiInstance.post<any>(``, {
      query: `
      query practitionerColleagues($userId: String) {
        practitionerColleagues(userId: $userId) {
          name title nickName contactNumber classroomNames profilePhoto userId
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

  async getMoodleSessionForCurrentUser(): Promise<string> {
    const apiInstance = api(Config.graphQlApi, this._accessToken);

    const response = await apiInstance.post<any>(``, {
      query: `
      query getMoodleSessionForCurrentUser {
        getMoodleSessionForCurrentUser {
        }
      }
      `,
    });
    if (response.status !== 200) {
      throw new Error('Get Practitioner Failed - Server connection error');
    }

    return response.data.data.getMoodleSessionForCurrentUser;
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

  async GetAllPractitionerInvites(userId: string): Promise<Date[]> {
    const apiInstance = api(Config.graphQlApi, this._accessToken);

    const response = await apiInstance.post<{
      data: { allPractitionerInvites: Date[] };
      errors?: {};
    }>(``, {
      query: `query GetAllPractitionerInvites($userId: String) {
          allPractitionerInvites(userId: $userId) {}
        }`,
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

  async getRemovalsForPractitioners(
    userIds: string[]
  ): Promise<PractitionerRemovalHistory[] | undefined> {
    const apiInstance = api(Config.graphQlApi, this._accessToken);
    const response = await apiInstance.post<any>(``, {
      query: `
      query removalDetailsForPractitioners($userIds: [String]) {
        removalDetailsForPractitioners(userIds: $userIds) {
          dateOfRemoval
          id
          userId
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

  async switchPrincipal(
    oldPrincipalUserId: string,
    newPrincipalUserId: string
  ): Promise<boolean> {
    const apiInstance = api(Config.graphQlApi, this._accessToken);
    const response = await apiInstance.post<any>(``, {
      query: `
      mutation switchPrincipal(
        $oldPrincipalUserId: String
        $newPrincipalUserId: String
      ) {
        switchPrincipal(
          oldPrincipalUserId: $oldPrincipalUserId
          newPrincipalUserId: $newPrincipalUserId
        ) {
        }
      }  
      `,
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

  async UpdatePractitionerBusinessWalkthrough(
    userId: string
  ): Promise<boolean> {
    const apiInstance = api(Config.graphQlApi, this._accessToken);
    const response = await apiInstance.post<any>(``, {
      query: `
      mutation UpdatePractitionerBusinessWalkthrough($userId: String) {
        updatePractitionerBusinessWalkthrough(userId: $userId) {
          
        }
      }
      `,
      variables: {
        userId,
      },
    });

    if (response.status !== 200) {
      throw new Error(
        'Update practitioner business walk through Failed - Server connection error'
      );
    }

    return response.data.data.updatePractitionerBusinessWalkthrough;
  }

  async UpdatePractitionerProgressWalkthrough(
    userId: string
  ): Promise<boolean> {
    const apiInstance = api(Config.graphQlApi, this._accessToken);
    const response = await apiInstance.post<any>(``, {
      query: `
      mutation UpdatePractitionerProgressWalkthrough($userId: String) {
        updatePractitionerProgressWalkthrough(userId: $userId) {
          
        }
      }
      `,
      variables: {
        userId,
      },
    });

    if (response.status !== 200) {
      throw new Error(
        'Update practitioner progress walk through Failed - Server connection error'
      );
    }

    return response.data.data.updatePractitionerProgressWalkthrough;
  }

  async practitionerInvitePrincipal(
    principalPhoneNumber: string,
    practitionerUserId: string
  ): Promise<boolean> {
    const apiInstance = api(Config.graphQlApi, this._accessToken);
    const response = await apiInstance.post<any>(``, {
      query: `
        mutation SendPrincipalInviteToApplication($principalPhoneNumber: String, $practitionerUserId: UUID!) {
  sendPrincipalInviteToApplication(principalPhoneNumber: $principalPhoneNumber, practitionerUserId: $practitionerUserId)
}
      `,
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
    principalUserId: string
  ): Promise<boolean> {
    const apiInstance = api(Config.graphQlApi, this._accessToken);
    const response = await apiInstance.post<any>(``, {
      query: `
        mutation SendPractitionerInviteToPreSchool($practitionerPhoneNumber: String!, $preSchoolNameCode: String!, $preSchoolName: String!, $principalUserId: UUID!) {
    sendPractitionerInviteToPreSchool(practitionerPhoneNumber: $practitionerPhoneNumber, preSchoolNameCode: $preSchoolNameCode, preSchoolName: $preSchoolName, principalUserId: $principalUserId) {
    }
}
      `,
      variables: {
        practitionerPhoneNumber,
        preSchoolNameCode,
        preSchoolName,
        principalUserId,
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
      query: `
        mutation UpdatePractitionerCommunityTabStatus($practitionerUserId: UUID!) {
    updatePractitionerCommunityTabStatus(practitionerUserId: $practitionerUserId) {
        id
        clickedCommunityTab
    }
}
      `,
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
      query: `
        mutation UpdateClickedECDHeros($userId: UUID!) {
    updateClickedECDHeros(userId: $userId) {
        
    }
}
      `,
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
}

export default PractitionerService;
