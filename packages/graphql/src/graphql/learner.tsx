import { gql } from '@apollo/client';

export const GetAllLearner = gql`
  {
    GetAllLearner {
      user {
        id
        firstName
        surname
        userName
        email
        isSouthAfricanCitizen
        verifiedByHomeAffairs
        dateOfBirth
        idNumber
        fullName
        contactPreference
        genderId
        phoneNumber
      }
      classProgramme {
        name
        meetingDay
        isFullDay
      }
      reasonForAttendance {
        id
        reason
      }
      otherAttendanceReason
    }
  }
`;

export const CreateLearner = gql`
  mutation createLearner($learner: LearnerInput) {
    createLearner(learner: $learner) {
      userId
    }
  }
`;

export const UpdateLearner = gql`
  mutation updateLearner($learner: LearnerInput) {
    updateLearner(learner: $learner) {
      userId
    }
  }
`;

export const DeleteLearner = gql`
  mutation deleteLearner($id: UUID!) {
    deleteLearner(id: $id)
  }
`;
