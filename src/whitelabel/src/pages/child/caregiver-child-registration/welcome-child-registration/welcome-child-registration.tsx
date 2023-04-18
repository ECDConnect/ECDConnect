import { useTheme } from '@ecdlink/core';
import {
  BannerWrapper,
  Button,
  ComponentBaseProps,
  Divider,
  StatusChip,
  Typography,
} from '@ecdlink/ui';
import { SuccessCard } from '../../../../components/success-card/success-card';
import { ChildRegistrationDetails } from '../caregiver-child-registration.types';

interface WelcomeChildRegistrationProps extends ComponentBaseProps {
  childDetails: ChildRegistrationDetails;
  onSubmit: (value: any) => void;
}

export const WelcomeChildRegistration: React.FC<
  WelcomeChildRegistrationProps
> = ({ childDetails, onSubmit }) => {
  const theme = useTheme();

  const handleNextClick = () => {
    onSubmit(null);
  };

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
            text={`${childDetails.child.firstname}'s`}
            color="white"
            align="left"
            lineHeight="snug"
          />
          <Typography
            type="h1"
            text={`registration`}
            color="white"
            align="left"
            lineHeight="snug"
          />
        </div>
      )}
    >
      <Typography
        hasMarkup
        type="unspecified"
        color="textMid"
        text={`<b>${childDetails.practitoner.firstname} ${childDetails.practitoner.surname}</b> from SmartStart added your child <b>${childDetails.child.firstname} ${childDetails.child.surname}</b> to their early learning programme, <b>${childDetails.child.groupName}</b>.`}
      />

      <SuccessCard
        className="my-4"
        text={`You are taking a first step to giving ${childDetails.child.firstname} the best start in life!`}
        icon={'SparklesIcon'}
      />

      <Typography
        type="unspecified"
        color="textMid"
        text="Children who receive quality early education tend to be more successful later in life and have higher earnings."
      />

      <div className="my-4 flex flex-col items-start">
        <Typography
          type="unspecified"
          text="Please have your personal information ready:"
        />
        <StatusChip
          className="my-2"
          backgroundColour="infoDark"
          textColour={'white'}
          borderColour="infoDark"
          text="ID number"
          icon="IdentificationIcon"
          iconPosition="start"
        />
        <StatusChip
          backgroundColour="infoDark"
          textColour={'white'}
          borderColour="infoDark"
          text="Contact details"
          icon="PhoneIcon"
          iconPosition="start"
        />
      </div>

      <div className="my-4 flex flex-col items-start">
        <Typography
          className="mb-2"
          type="unspecified"
          text={`Please also have ${childDetails.child.firstname}’s (if available):`}
        />
        <StatusChip
          backgroundColour="infoDark"
          textColour={'white'}
          borderColour="infoDark"
          text="Birth certificate or clinic card"
          icon={'IdentificationIcon'}
          iconPosition="start"
        />
      </div>

      <Divider dividerType="solid" className="my-4" />
      <Button
        icon="ArrowCircleRightIcon"
        text="Next"
        type="filled"
        color="primary"
        textColor="white"
        onClick={handleNextClick}
        className="mb-4 w-full"
      />
    </BannerWrapper>
  );
};
