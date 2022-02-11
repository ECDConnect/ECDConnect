import { gql } from '@apollo/client';

export const TrackAttendance = gql`
  mutation trackAttendance($attendance: TrackAttendanceModelInput) {
    trackAttendance(attendance: $attendance)
  }
`;

export const GetAttendance = gql`
  query attendance($year: Int!, $monthOfYear: Int, $weekOfYear: Int) {
    attendance(
      year: $year
      monthOfYear: $monthOfYear
      weekOfYear: $weekOfYear
    ) {
      classProgrammeId
      classProgramme {
        classroomGroup {
          name
        }
      }
      user {
        firstName
        surname
      }
      attended
      attendanceDate
    }
  }
`;
