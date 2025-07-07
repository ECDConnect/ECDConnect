import { useTheme } from '@ecdlink/core';
import {
  Alert,
  BannerWrapper,
  ComponentBaseProps,
  Divider,
  Typography,
} from '@ecdlink/ui';
import { ContactPerson } from '../../../../components/contact-person/contact-person';
import { ChildRegistrationDetails } from '../caregiver-child-registration.types';
import { ReactComponent as Balloons } from '@/assets/balloons_bg_blue.svg';
import TransparentLayer from '../../../../assets/TransparentLayer.png';

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
      size="large"
      showBackground={true}
      backgroundUrl={TransparentLayer}
      backgroundImageColour={'primary'}
      className="p-4"
      renderOverflow
      titleOverrideRender={() => (
        <Typography
          className="-ml-20"
          type="h1"
          text={`Welcome to ${childDetails.child.groupName} ${childDetails.child.firstname} and family!`}
          color="white"
          align="left"
          lineHeight="snug"
        />
      )}
    >
      <div className="bg-uiBg relative z-50 mb-8 flex flex-col items-center gap-4 rounded-2xl p-6 shadow-md">
        <Balloons className="h-24 w-24" />
        <Typography type="h3" text="Well done!" color="textDark" />
        <Typography
          type="markdown"
          color="textMid"
          text={`${childDetails.child.firstname} has been registered to attend ${childDetails.practitoner.firstname}'s programme: <b>${childDetails.child.groupName}</b>`}
        />
      </div>
      <Typography
        type="unspecified"
        color="textMid"
        hasMarkup
        text={`Please reach out to ${childDetails.practitoner.firstname} if you have any questions.`}
      />
      <Typography
        type="unspecified"
        color="textMid"
        hasMarkup
        text="Thank you!"
      />
      <Divider className="mt-4" dividerType="dashed" />
      <ContactPerson
        className="mt-4"
        displayHeader={false}
        name={childDetails.practitoner.firstname}
        surname={''}
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
