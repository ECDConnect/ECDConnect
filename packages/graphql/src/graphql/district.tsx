import { gql } from '@apollo/client';

export const GetDistrictsAndStats = gql`
  query GetDistrictsAndStats {
    districtsAndStats {
      id
      name
      insertedDate
      province {
        id
        description
      }
      subDistricts {
        id
        name
      }
      totalSubDistricts
      totalClinics
      totalTeamLeads
      totalHCWs
    }
  }
`;

export const GetFilterDistricts = gql`
  query GetAllDistrict($isActive: Boolean = true) {
    GetAllDistrict(where: { isActive: { eq: $isActive } }) {
      id
      name
    }
  }
`;

export const AddDistrict = gql`
  mutation AddDistrict($input: DistrictModelInput) {
    addDistrict(input: $input) {
      id
      name
      provinceId
    }
  }
`;

export const EditDistrict = gql`
  mutation EditDistrict($input: DistrictModelInput) {
    editDistrict(input: $input) {
      id
      name
      provinceId
    }
  }
`;
