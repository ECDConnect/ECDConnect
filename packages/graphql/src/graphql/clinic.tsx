import { gql } from '@apollo/client';

export const GetAllPortalClinics = gql`
  query GetAllPortalClinics {
    allPortalClinics {
      id
      name
      phoneNumber
      insertedDate
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
      siteAddressId
      teamLeads {
        teamLead {
          id
          user {
            firstName
            surname
          }
        }
      }
      subDistrict {
        id
        name
        district {
          id
          name
          province {
            id
            description
          }
        }
      }
      leagues {
        league {
          id
          startDate
          endDate
          leagueType {
            id
            name
          }
        }
      }
      isActive
      healthCareWorkers {
        id
      }
    }
  }
`;

export const GetFilterClinic = gql`
  query GetAllClinic($isActive: Boolean = true) {
    GetAllClinic(where: { isActive: { eq: $isActive } }) {
      id
      name
    }
  }
`;

export const CreateClinic = gql`
  mutation AddClinic($input: PortalClinicInputModelInput) {
    addClinic(input: $input) {
      id
      name
      phoneNumber
      insertedDate
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
      teamLeads {
        teamLead {
          id
          user {
            firstName
            surname
          }
        }
      }
      subDistrict {
        id
        name
        district {
          id
          name
          province {
            id
            description
          }
        }
      }
    }
  }
`;

export const EditClinic = gql`
  mutation EditClinic($input: PortalClinicInputModelInput) {
    editClinic(input: $input) {
      id
      name
      phoneNumber
      insertedDate
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
      teamLeads {
        teamLead {
          id
          user {
            firstName
            surname
          }
        }
      }
      subDistrict {
        id
        name
        district {
          id
          name
          province {
            id
            description
          }
        }
      }
    }
  }
`;

export const DeleteClinic = gql`
  mutation DeleteClinic($clinicId: UUID!) {
    deleteClinic(clinicId: $clinicId) {
      id
      name
      isActive
    }
  }
`;

export const DeleteClinicById = gql`
  mutation DeleteClinicById($clinicId: UUID!) {
    deleteClinicById(clinicId: $clinicId) {
      id
      name
      isActive
    }
  }
`;

export const GetClinicPointsData = gql`
  query GetClinicPointsData($clinicId: UUID!) {
    clinicPointsData(clinicId: $clinicId) {
      totalHCWs
      leagueRanking
      pointsTotal
      momsTargetPerc
      momsTargetPercColor
      momsTopLeagueTeamPerc
      momsRankingPerc
      childrenTargetPerc
      childrenTargetPercColor
      childrenTopLeagueTeamPerc
      childrenRankingPerc
    }
  }
`;

export const GetClinicVisitReportData = gql`
  query GetClinicVisitReportData(
    $clinicId: UUID!
    $startDate: DateTime!
    $endDate: DateTime!
  ) {
    clinicVisitReportData(
      clinicId: $clinicId
      startDate: $startDate
      endDate: $endDate
    ) {
      clientRegistration {
        totalChildFoldersOpened
        totalMotherFoldersOpened
        totalMotherFoldersBefore20WeeksOpened
      }
      pregnantMoms {
        totalMaternalDistress
        totalMaternalMalnutrition
        totalAlcoholAbuse
      }
      childClients {
        totalSupportGrant
        totalGrowthMonitored
        totalUpToDateImmunisations
        totalUpToDateVitaminA
        totalUpToDateDeworming
      }
      breastFeedingClub {
        totalClubsHeld
        totalCaregiversAttended
      }
    }
  }
`;
