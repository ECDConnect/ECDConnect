// import { NoPlaygroupClassroomType } from './../../enums/ProgrammeType';
import { PractitionerDto } from '@ecdlink/core';
import { format } from 'date-fns';

export const getPractitionerAlertModel = (
  practitioner: PractitionerDto,
  practitioners?: PractitionerDto[]
) => {
  let alert = 'success';
  let alertMessage = 'All information captured';

  if (practitioners) {
    const practitionerRecord = practitioners?.find(
      (x) => x?.id === practitioner?.id
    );

    if (practitionerRecord?.isLeaving && practitionerRecord?.dateToBeRemoved) {
      alert = 'error';
      alertMessage = `Leaving on ${format(
        new Date(practitionerRecord?.dateToBeRemoved),
        'LLL d'
      )}`;

      return { status: alert, message: alertMessage, severity: 1 };
    }

    if (
      practitionerRecord?.isRegistered === null ||
      practitionerRecord?.isRegistered === undefined
    ) {
      alert = 'error';
      alertMessage = `Invite not accepted yet`;
    }
  }

  //   if (classroomGroups && learner) {
  //     const classroomGroup = classroomGroups.find(
  //       (x) => x.id === learner?.classroomGroupId
  //     );

  //     if (classroomGroup?.name === NoPlaygroupClassroomType.name) {
  //       alert = 'error';
  //       alertMessage = 'No playgroup assigned';

  //       return { status: alert, message: alertMessage, severity: 1 };
  //     }
  //   }

  return { status: alert, message: alertMessage, severity: 3 };
};
