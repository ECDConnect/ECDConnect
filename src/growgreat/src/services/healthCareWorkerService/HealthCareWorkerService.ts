import { api } from '../axios.helper';
import { Config, PractitionerDto, HealthCareWorkerDto } from '@ecdlink/core';
import {
  HealthCareWorkerModelInput,
  MutationUpdateHealthCareWorkerArgs,
} from '@ecdlink/graphql';

class HealthCareWorkerService {
  _accessToken: string;

  constructor(accessToken: string) {
    this._accessToken = accessToken;
  }

  async getHealthCareWorkerByUserId(
    userId: string
  ): Promise<HealthCareWorkerDto> {
    const apiInstance = api(Config.graphQlApi, this._accessToken);
    const response = await apiInstance.post<any>(``, {
      query: `
      query getHealthCareWorkerByUserId($userId: String) {
        healthCareWorkerByUserId(userId: $userId) {
          user {
              id
              userName
              email
              isSouthAfricanCitizen
              verifiedByHomeAffairs
              dateOfBirth
              idNumber
              firstName
              surname
              fullName
              contactPreference
              genderId
              phoneNumber
              profileImageUrl
              emailConfirmed
              phoneNumberConfirmed
              twoFactorEnabled
              isActive
              lastSeen
          }
          teamLead {
            jobTitle
            user {
              firstName
              surname
              phoneNumber
            }
            clinic {
              name
              phoneNumber
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
            }
          }
          id
          isRegistered
          languageId
          clickedDashboardClientsTab
          clickedDashboardVisitsTab
          clickedDashboardHighlightsTab
          clickedVisitTab
          clickedProgressTab
          clickedReferralsTab
          clickedContactTab
          pointsEngineData {
            pointsLibrary {
              activity
              subActivity
              points
              maxPointsIndividualMonthly
              calculatedAtMonthEnd
              calculatedAtYearEnd
            }
            pointsUserSummary {
              pointsTotal
              pointsYTD
              month
              year
              pointsLibrary {
                activity
                subActivity
                points
                maxPointsIndividualMonthly
                calculatedAtMonthEnd
                calculatedAtYearEnd
              }
            }
          }
        }
      }
      `,
      variables: {
        userId: userId,
      },
    });

    if (response.status !== 200) {
      throw new Error('Get Practitioner Failed - Server connection error');
    }

    return response.data.data.healthCareWorkerByUserId;
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
            isPrincipal
            isRegistered
            principalHierarchy
            attendanceRegisterLink
            maxChildren
            consentForPhoto
            parentFees
            languageUsedInGroups
            startDate
            monthSinceFranchisee
            shareInfo
            dateLinked
            dateAccepted
            dateToBeRemoved
            isLeaving
            progress
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

  async UpdateHealthCareWorker(
    userId: string,
    input: MutationUpdateHealthCareWorkerArgs
  ): Promise<HealthCareWorkerDto> {
    const apiInstance = api(Config.graphQlApi, this._accessToken);
    const response = await apiInstance.post<any>(``, {
      query: `
      mutation updateHealthCareWorker(
        $userId: String,
        $input: HealthCareWorkerModelInput
    ) {
      updateHealthCareWorker(
          userId: $userId,
          input: $input
        ) {
            id
            language {
                description
            }
            isRegistered
            user {
                firstName
                surname
                email
                phoneNumber
                emailConfirmed
            }
            teamLead {
              jobTitle
                clinic {
                  name
                  phoneNumber
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
                }
            }
      }
    }
      `,
      variables: {
        userId,
        input,
      },
    });
    if (response.status !== 200) {
      throw new Error(
        'Update Practitioner by ID number Failed - Server connection error'
      );
    }

    return response.data.data.updateHealthCareWorker;
  }

  async updateHealthCareWorkerTabs(
    input: HealthCareWorkerModelInput,
    userId: string
  ): Promise<HealthCareWorkerDto> {
    const apiInstance = api(Config.graphQlApi, this._accessToken);
    const response = await apiInstance.post<{
      data: { updateHealthCareWorkerTabs: HealthCareWorkerDto };
    }>(``, {
      query: `
        mutation UpdateHealthCareWorkerTabs($input: HealthCareWorkerModelInput, $userId: String) {
          updateHealthCareWorkerTabs(input: $input, userId: $userId) {
            user {
              id
              userName
              email
              isSouthAfricanCitizen
              verifiedByHomeAffairs
              dateOfBirth
              idNumber
              firstName
              surname
              fullName
              contactPreference
              genderId
              phoneNumber
              profileImageUrl
              emailConfirmed
              phoneNumberConfirmed
              twoFactorEnabled
              isActive
              lastSeen
          }
          teamLead {
            jobTitle
            user {
              firstName
              surname
              phoneNumber
            }
            clinic {
              name
              phoneNumber
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
            }
          }
          id
          isRegistered
          languageId
          clickedDashboardClientsTab
          clickedDashboardVisitsTab
          clickedDashboardHighlightsTab
          clickedVisitTab
          clickedProgressTab
          clickedReferralsTab
          clickedContactTab
          }
        }
      `,
      variables: {
        input,
        userId,
      },
    });

    if (response.status !== 200) {
      throw new Error(
        'Updating health careworker failed - Server connection error'
      );
    }

    return response.data.data.updateHealthCareWorkerTabs;
  }
}

export default HealthCareWorkerService;
