import { gql } from '@apollo/client';

export const GetAllClassroom = gql`
  {
    GetAllClassroom {
      id
      name
      classroomImageUrl
      classroomGroups {
        id
        classroomId
        name
        programType {
          id
          description
        }
        classProgrammes {
          id
          classroomGroupId
          meetingDay
          isFullDay
        }
        learners {
          classroomGroupId
          startedAttendance
          user {
            id
            dateOfBirth
            firstName
            surname
            genderId
          }
        }
      }
      userId
      isPrinciple
      numberPractitioners
      numberOfAssistants
      numberOfOtherAssistants
      doesOwnerTeach
      insertedDate
      siteAddressId
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
    }
  }
`;

export const GetClassroomById = gql`
  query GetClassroomById($id: UUID) {
    GetClassroomById(id: $id) {
      id
      name
      classroomImageUrl
      classroomGroups {
        id
        classroomId
        name
        programType {
          id
          description
        }
        classProgrammes {
          id
          classroomGroupId
          meetingDay
          isFullDay
        }
        learners {
          classroomGroupId
          startedAttendance
          user {
            id
            dateOfBirth
            firstName
            surname
            genderId
          }
        }
      }
      userId
      isPrinciple
      numberPractitioners
      numberOfAssistants
      numberOfOtherAssistants
      doesOwnerTeach
      insertedDate
    }
  }
`;

export const CreateClassroom = gql`
  mutation createClassroom($input: ClassroomInput) {
    createClassroom(input: $input) {
      id
      name
      userId
      isPrinciple
      numberPractitioners
      numberOfAssistants
      numberOfOtherAssistants
      doesOwnerTeach
    }
  }
`;

export const UpdateClassroom = gql`
  mutation updateClassroom($input: ClassroomInput, $id: UUID) {
    updateClassroom(input: $input, id: $id) {
      id
    }
  }
`;

export const DeleteClassroom = gql`
  mutation deleteClassroom($id: UUID!) {
    deleteClassroom(id: $id)
  }
`;
