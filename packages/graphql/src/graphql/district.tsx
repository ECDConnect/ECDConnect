import { gql } from '@apollo/client';

export const GetAllDistrict = gql`
  {
    GetAllDistrict {
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
    }
  }
`;

export const GetDistrictByName = gql`
  query GetDistrictByName($name: String!) {
    districtByName(name: $name) {
      id
      name
    }
  }
`;

export const GetDistrictStats = gql`
  query GetDistrictStats($districtId: UUID!) {
    districtStats(districtId: $districtId) {
      totalSubDistricts
      totalClinics
      totalTeamLeads
      totalHCWs
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
