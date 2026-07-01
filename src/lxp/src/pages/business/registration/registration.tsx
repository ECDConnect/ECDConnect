import { WelcomeRegistration } from './welcome-registration/welcome-registration';
import { BusinessTabItems } from '../business.types';
import ROUTES from '@/routes/routes';
import { useHistory } from 'react-router-dom';
import { WelcomeMessageModel } from './welcome-registration/welcome-registration-types';
import {
  practitionerSelectors,
  practitionerThunkActions,
} from '@/store/practitioner';
import { useAppDispatch } from '@/store/config/config';
import { useSelector } from 'react-redux';
import {
  ChallengeType,
  EcdRegistrationInputModelInput,
  NonSubsidyRegistrationType,
  SubsidyStatus,
} from '@ecdlink/graphql/lib/graphql/generatedGraphql';
import { useSnackbar } from '@ecdlink/core/lib/services/snackbar';
import { useRemoveNotifications } from '@/hooks/useRemoveNotifications';
import { notificationTagConfig } from '@/constants/notifications';

const mapChallengeToEnum = (challenge: string | undefined): ChallengeType => {
  switch (challenge) {
    case `I don't know where to start`:
      return ChallengeType.DontKnowWhereToStart;
    case 'The process takes too long or is too complicated':
      return ChallengeType.ProcessTooLongOrComplicated;
    case `I don't understand what requirements or documents I need`:
      return ChallengeType.MissingRequirements;
    case `I don't have or cannot get the right documents`:
      return ChallengeType.MissingDocuments;
    case `I cannot reach the officials who can help`:
      return ChallengeType.UnreachableOfficials;
    case `I don't have the infrastructure or resources to meet requirements`:
      return ChallengeType.LackOfInfrastructureOrResources;
    default:
      return ChallengeType.Other;
  }
};

const mapRegistrationToEnum = (
  registration: string | undefined
): NonSubsidyRegistrationType | undefined => {
  switch (registration) {
    case 'Yes - fully registered':
      return NonSubsidyRegistrationType.FullyRegistered;
    case 'Yes - conditionally registered':
      return NonSubsidyRegistrationType.PartiallyRegistered;
    case 'No - I started the process of registering':
      return NonSubsidyRegistrationType.StartedRegistration;
    case 'No - I have not started the process of registering':
      return NonSubsidyRegistrationType.NotStartedRegistration;
    case `I'm not sure`:
      return NonSubsidyRegistrationType.NotSure;
    default:
      return undefined;
  }
};

export const Registration: React.FC = () => {
  const history = useHistory();
  const dispatch = useAppDispatch();
  const practitioner = useSelector(practitionerSelectors.getPractitioner);
  const { showMessage } = useSnackbar();

  const removeNotifications = useRemoveNotifications({
    cta: notificationTagConfig?.DbeRegistration?.cta ?? '',
  });

  const onSubmit = async (data: WelcomeMessageModel) => {
    const registrationDto: EcdRegistrationInputModelInput = {
      practitionerId: practitioner?.id as string,
      subsidy:
        data.subsidy === 'true'
          ? SubsidyStatus.Yes
          : data.subsidy === 'false'
          ? SubsidyStatus.No
          : SubsidyStatus.NotSure,
      registrationType: mapRegistrationToEnum(data.registration),
      challenges: mapChallengeToEnum(data.challenge),
      challengesOtherReason: data.otherDetail || '',
      hasBronzeCertificate: data.certificates?.includes('Bronze') || false,
      hasSilverCertificate: data.certificates?.includes('Silver') || false,
      hasGoldCertificate: data.certificates?.includes('Gold') || false,
      problemDescription: data.problem || '',
      eCaresStatus:
        data.eCaresStatus === 'true'
          ? SubsidyStatus.Yes
          : data.eCaresStatus === 'false'
          ? SubsidyStatus.No
          : data.eCaresStatus === 'unsure'
          ? SubsidyStatus.NotSure
          : undefined,
    };

    try {
      await dispatch(
        practitionerThunkActions.createPractitionerEcdRegistration({
          data: registrationDto,
        })
      ).unwrap();

      removeNotifications();

      showMessage({
        message: 'Information added',
        type: 'success',
        duration: 3000,
      });

      history.push(ROUTES.BUSINESS, {
        activeTabIndex: BusinessTabItems.REGISTRATION,
      });
    } catch {
      showMessage({
        message: 'Failed to save. Please try again.',
        type: 'error',
        duration: 3000,
      });
    }
  };

  return <WelcomeRegistration onSubmit={onSubmit} />;
};
