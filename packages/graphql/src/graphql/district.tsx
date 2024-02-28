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
