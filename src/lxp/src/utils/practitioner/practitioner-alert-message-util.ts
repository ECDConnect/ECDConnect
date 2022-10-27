// import { NoPlaygroupClassroomType } from './../../enums/ProgrammeType';
import { childrenSelectors } from '@/store/children';
import {
  ChildDto,
  ChildProgressObservationReport,
  PractitionerDto,
} from '@ecdlink/core';
import { format } from 'date-fns';

export const getPractitionerAlertModel = (
  practitioner: PractitionerDto,
  practitioners?: PractitionerDto[],
  childrenForPractitioner?: ChildDto[],
  practitionerChildrenReports?: ChildProgressObservationReport[],
  children?: ChildDto[]
) => {
  let alert = 'success';
  let alertMessage = 'All information captured';
  let childrenMissingInfo = 0;

  const practitionerFilteredChildren = children?.filter((el) => {
    return childrenForPractitioner?.some((f) => {
      return f.userId === el.userId;
    });
  });

  if (practitionerFilteredChildren) {
    practitionerFilteredChildren.map((item) => {
      if (
        !item?.caregiverId ||
        !item?.user?.firstName ||
        !item?.user?.surname
      ) {
        childrenMissingInfo++;
      }
      return childrenMissingInfo;
    });
  }

  if (childrenForPractitioner) {
    if (
      childrenMissingInfo > 0 &&
      childrenMissingInfo / childrenForPractitioner?.length <= 0.7
    ) {
      alert = 'error';
      alertMessage = 'Child information missing';

      return { status: alert, message: alertMessage, severity: 2 };
    }
  }

  if (practitioners) {
    const practitionerRecord = practitioners?.find(
      (x) => x?.id === practitioner?.id
    );

    if (childrenForPractitioner && practitionerChildrenReports) {
      if (
        practitionerChildrenReports?.length / childrenForPractitioner?.length <=
          0.7 &&
        practitionerChildrenReports?.length !== 0
      ) {
        alert = 'error';
        alertMessage = 'Progress reports overdue';
        return { status: alert, message: alertMessage, severity: 2 };
      }
    }

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
