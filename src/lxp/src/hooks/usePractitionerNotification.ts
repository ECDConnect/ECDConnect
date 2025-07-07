import ROUTES from '@/routes/routes';
import { PractitionerDto } from '@ecdlink/core';
import { Message } from '@/models/messages/messages';

export const usePractitionerNotification = () => {
  const getPractitionerProgressNotification = (
    appName?: String,
    practitioner?: PractitionerDto,
    classroomName?: String
  ) => {
    const addedToClass: Message = {
      reference: `practitioner-profile`,
      title: `You have been added to ${classroomName}`,
      message: 'Connect with your principal & manage your classes.',
      dateCreated: new Date().toISOString(),
      priority: 7,
      viewOnDashboard: true,
      isFromBackend: false,
      area: 'practitioner',
      icon: 'SwitchVerticalIcon',
      color: 'primary',
      actionText: 'Get started',
      viewType: 'Hub',
      routeConfig: {
        route: ROUTES.PRACTITIONER.PROFILE.EDIT,
      },
    };

    const joinAddSchool: Message = {
      reference: `practitioner-profile`,
      title: `Join or add a preschool!`,
      message: 'Set up your preschool or connect with your principal',
      dateCreated: new Date().toISOString(),
      priority: 7,
      viewOnDashboard: true,
      isFromBackend: false,
      area: 'practitioner',
      icon: 'SwitchVerticalIcon',
      color: 'primary',
      actionText: 'Get started',
      viewType: 'Hub',
      routeConfig: {
        route: ROUTES.PRACTITIONER.PROFILE.EDIT,
      },
    };

    const joinTeam: Message = {
      reference: `practitioner-profile`,
      title: `Join your preschool team!`,
      message: `Ask your principal to sign up for ${appName} and add you to the preschool, or fill in your preschool code now.`,
      dateCreated: new Date().toISOString(),
      priority: 7,
      viewOnDashboard: true,
      isFromBackend: false,
      area: 'practitioner',
      icon: 'SwitchVerticalIcon',
      color: 'primary',
      actionText: 'Get started',
      viewType: 'Hub',
      routeConfig: {
        route: ROUTES.PRACTITIONER.PROFILE.EDIT,
      },
    };

    const practitionerNotification: Message[] = [];
    if (practitioner?.principalHierarchy && !practitioner?.dateAccepted) {
      practitionerNotification.push(addedToClass);
    } else if (practitioner?.progress === 0) {
      practitionerNotification.push(joinAddSchool);
    } else if (practitioner?.progress === 1) {
      practitionerNotification.push(joinTeam);
    }

    return { practitionerNotification };
  };

  return {
    getPractitionerProgressNotification,
  };
};
