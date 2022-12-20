import {
  ChildDto,
  ChildProgressObservationReport,
  PractitionerDto,
} from '@ecdlink/core';
import { differenceInDays, format } from 'date-fns';

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
  let passedDaysGreaterThanThirty = 0;

  const practitionerFilteredChildren = children?.filter((el) => {
    return childrenForPractitioner?.some((f) => {
      return f.userId === el.userId;
    });
  });

  if (practitionerFilteredChildren) {
    practitionerFilteredChildren?.map((item) => {
      const daysSinceInsertedDate = differenceInDays(
        new Date(),
        new Date(item?.insertedDate || new Date())
      );
      if (daysSinceInsertedDate > 30) {
        passedDaysGreaterThanThirty++;
      }
      return passedDaysGreaterThanThirty;
    });
  }

  if (practitionerFilteredChildren) {
    practitionerFilteredChildren.forEach((item) => {
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
    if (childrenMissingInfo > 0) {
      alert = 'error';
      alertMessage = `${childrenMissingInfo} incomplete child registers`;

      return { status: alert, message: alertMessage, severity: 2 };
    }
  }

  if (practitioners) {
    const practitionerRecord = practitioners?.find(
      (x) => x?.id === practitioner?.id
    );

    if (childrenForPractitioner && practitionerChildrenReports) {
      if (
        practitionerChildrenReports?.length < passedDaysGreaterThanThirty &&
        practitionerChildrenReports?.length !== 0
      ) {
        alert = 'error';
        alertMessage = `${
          passedDaysGreaterThanThirty - practitionerChildrenReports?.length
        } Progress reports overdue`;
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

  return { status: alert, message: alertMessage, severity: 3 };
};
