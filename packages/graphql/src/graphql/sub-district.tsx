import { gql } from '@apollo/client';

export const GetSubDistrictsAndStats = gql`
  query GetSubDistrictsAndStats() {
    subDistrictsAndStats() {
        id
        name
        insertedDate
        district {
            id
            name 
            province {
                id
                description
            }
        }
        totalClinics
        totalTeamLeads
        totalHCWs
    }
  }
`;

export const GetFilterSubDistricts = gql`
  query GetAllSubDistrict($isActive: Boolean = true) {
    GetAllSubDistrict(where: { isActive: { eq: $isActive } }) {
      id
      name
    }
  }
`;

export const AddSubDistrict = gql`
  mutation AddSubDistrict($input: SubDistrictModelInput) {
    addSubDistrict(input: $input) {
      id
      name
      districtId
    }
  }
`;

export const EditSubDistrict = gql`
  mutation EditSubDistrict($input: SubDistrictModelInput) {
    editSubDistrict(input: $input) {
      id
      name
      districtId
    }
  }
`;
