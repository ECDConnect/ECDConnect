import { useTheme } from '@ecdlink/core';
import {
  BannerWrapper,
  Button,
  ComponentBaseProps,
  StatusChip,
  Typography,
} from '@ecdlink/ui';
import { ChildRegistrationDetails } from '../caregiver-child-registration.types';
import { CustomSuccessCard } from '@/components/custom-success-card/custom-success-card';
import { ReactComponent as EmojiYellowSmile } from '@/assets/ECD_Connect_emoji3.svg';
import { ReactComponent as Balloons } from '@/assets/balloons_bg_blue.svg';
import TransparentLayer from '../../../../assets/TransparentLayer.png';

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
      size="large"
      title={`${childDetails.child.firstname}'s registration`}
      showBackground={true}
      backgroundUrl={TransparentLayer}
      className="flex h-full flex-col p-4"
      renderOverflow
      titleOverrideRender={() => (
        <Typography
          className="-ml-20"
          type="h1"
          text={`${childDetails.child.firstname}'s registration`}
          color="white"
          align="left"
          lineHeight="snug"
        />
      )}
    >
      <div className="bg-uiBg relative z-50 mb-8 flex flex-col items-center gap-4 rounded-2xl p-6 shadow-md">
        <Balloons className="h-24 w-24" />
        <Typography type="h3" text="Congratulations!" color="textDark" />
        <Typography
          type="markdown"
          color="textMid"
          text={`<b>${childDetails?.practitoner?.firstname}</b> added your child <b>${childDetails?.child?.firstname} ${childDetails?.child?.surname}</b> to their early learning programme, <b>${childDetails?.child?.groupName}</b>.`}
        />
      </div>
      <CustomSuccessCard
        text={`You are taking a first step to giving ${childDetails.child.firstname} the best start in life!`}
        textColour="white"
        color="tertiary"
        customIcon={<EmojiYellowSmile className="h-14 w-14" />}
      />
      <Typography
        className="mt-4"
        type="unspecified"
        color="textMid"
        text="Children who receive quality early education tend to be more successful later in life and have higher earnings."
      />

      <div className="my-4 flex flex-col items-start">
        <Typography
          type="h4"
          text="Please have your personal information ready:"
          color="textDark"
        />
        <StatusChip
          className="my-2"
          backgroundColour="infoBb"
          textColour={'infoDark'}
          borderColour="infoBb"
          text="ID number"
          icon="IdentificationIcon"
          iconPosition="start"
        />
        <StatusChip
          backgroundColour="infoBb"
          textColour={'infoDark'}
          borderColour="infoBb"
          text="Contact details"
          icon="PhoneIcon"
          iconPosition="start"
        />
      </div>
      <Button
        icon="ArrowCircleRightIcon"
        text="Start"
        type="filled"
        color="quatenary"
        textColor="white"
        onClick={handleNextClick}
        className="mb-4 mt-auto w-full"
      />
    </BannerWrapper>
  );
};
