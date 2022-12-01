import { gql } from '@apollo/client';

export const GetAllClinic = gql`
  {
    GetAllClinic {
      id
      name
      phoneNumber
      isActive
    }
  }
`;

export const CreateClinic = gql`
  mutation addClinic($input: ClinicModelInput) {
    addClinic(input: $input) {
      id
    }
  }
`;
