import { useTheme } from '@ecdlink/core';
import {
  Alert,
  BannerWrapper,
  ComponentBaseProps,
  Typography,
} from '@ecdlink/ui';
import { ContactPerson } from '../../../../components/contact-person/contact-person';
import { ChildRegistrationDetails } from '../caregiver-child-registration.types';

export interface CompletedCaregiverChildRegistrationProps
  extends ComponentBaseProps {
  childDetails: ChildRegistrationDetails;
}

export const CompletedCaregiverChildRegistration: React.FC<
  CompletedCaregiverChildRegistrationProps
> = ({ childDetails }) => {
  const theme = useTheme();

  return (
    <BannerWrapper
      size="normal"
      showBackground={true}
      backgroundUrl={theme.theme?.images.graphicOverlayUrl}
      className="p-4"
      renderOverflow
      titleOverrideRender={() => (
        <div className="-ml-6">
          <Typography
            type="h1"
            text={`Welcome to ${childDetails.child.groupName} ${childDetails.child.firstname} and family!`}
            color="white"
            align="left"
            lineHeight="snug"
          />
        </div>
      )}
    >
      <Typography
        type="unspecified"
        hasMarkup
        text={`${childDetails.child.firstname} has been registered to attend the SmartStart programme: <b>${childDetails.child.groupName}</b>`}
      />
      <Typography
        type="unspecified"
        className="mt-4"
        hasMarkup
        text={`Please reach out to ${childDetails.practitoner.firstname} if you have any questions.`}
      />

      <ContactPerson
        className="mt-4"
        displayHeader={false}
        name={childDetails.practitoner.firstname}
        surname={childDetails.practitoner.surname}
        contactNumber={childDetails.practitoner.phoneNumber}
      />
      <Alert
        type="info"
        className="mt-4"
        message="WhatsApps and phone calls will be charged at your standard carrier rates."
      />
    </BannerWrapper>
  );
};
