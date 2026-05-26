import { useMemo } from 'react';
import { classroomsSelectors } from '@/store/classroom';
import { practitionerSelectors } from '@/store/practitioner';
import { useSelector } from 'react-redux';

export const usePractitionerReportDetails = () => {
  const classroom = useSelector(classroomsSelectors.getClassroom);
  const groups = useSelector(classroomsSelectors.getClassroomGroups);
  const practitioner = useSelector(practitionerSelectors.getPractitioner);
  const practitioners = useSelector(practitionerSelectors.getPractitioners);

  const classHeaders = useMemo(() => {
    if (!classroom || !practitioner || groups.length === 0) {
      return [];
    }

    const principal = classroom.principal;
    const address = classroom.siteAddress;

    // Reusable address string (same for all groups)
    const addressStr = address
      ? [
          address.name,
          address.addressLine1,
          address.addressLine2,
          address.addressLine3,
          address.province?.description,
          address.postalCode,
        ]
          .filter(Boolean)
          .join(', ')
      : '-';

    const principalName = principal
      ? [principal.firstName, principal.surname]
          .filter(Boolean)
          .join(' ')
          .trim()
      : '';

    // Day name mapping
    const dayNames = [
      '', // 0 - unused
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
    ];

    // Generate one report entry per group
    return groups.map((group) => {
      // programmeDays are numbers: 1 = Monday, 2 = Tuesday, ..., 5 = Friday
      const programmeDays = group.classProgrammes
        .map((x) => x.meetingDay)
        .sort((a, b) => a - b);

      let programmeDayNames: string;

      if (
        programmeDays.length === 5 &&
        programmeDays.every((day, i) => day === i + 1)
      ) {
        programmeDayNames = 'Monday to Friday';
      } else if (programmeDays.length === 0) {
        programmeDayNames = 'No programme days';
      } else {
        const names = programmeDays.map((day) => dayNames[day]).filter(Boolean);

        if (names.length === 1) {
          programmeDayNames = names[0];
        } else if (names.length === 2) {
          programmeDayNames = names.join(' and ');
        } else {
          const last = names.pop();
          programmeDayNames = `${names.join(', ')} and ${last}`;
        }
      }
      const linkedPractitioner = practitioners?.find(
        (x) => x.userId === group.userId
      );

      return {
        classroomGroupId: group.id,
        classroomGroupName: group.name ?? '',
        idNumber:
          linkedPractitioner?.user?.idNumber ??
          practitioner.user?.idNumber ??
          '',
        insertedDate: '',
        name:
          linkedPractitioner?.user?.fullName ??
          practitioner.user?.fullName ??
          '',
        phone:
          linkedPractitioner?.user?.fullName ??
          practitioner.user?.phoneNumber ??
          '',
        principalName: principalName,
        programmeDays: programmeDayNames,
        programmeTypeName: '',
        classSiteAddress: addressStr,
      };
    });
  }, [classroom, groups, practitioner]);

  return { classHeaders };
};
