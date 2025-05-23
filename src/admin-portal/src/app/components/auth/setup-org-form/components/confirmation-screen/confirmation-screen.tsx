import { useTheme } from '@ecdlink/core';
import { Alert, BannerWrapper, Divider, Typography } from '@ecdlink/ui';
import joinCOmmunity from '../../../../../../assets/joinCommunity.svg';

interface ConfirmationScreenProps {
  orgName?: string;
}

export const ConfirmationScreen: React.FC<ConfirmationScreenProps> = ({
  orgName,
}) => {
  const { theme } = useTheme();

  return (
    <BannerWrapper
      size={'normal'}
      renderBorder={true}
      showBackground={false}
      color={'primary'}
      menuLogoUrl={theme?.images?.logoUrl}
      backgroundColour={'white'}
    >
      <div className="flex items-center justify-center p-40">
        <div className="flex items-center justify-center gap-24">
          <img src={joinCOmmunity} alt="community" className="h-48 w-48" />
          <div className="w-6/12">
            <Typography
              type={'unspecified'}
              fontSize="72"
              className="font-semibold"
              text={'Confirmed!'}
              color={'textDark'}
            />
            <Typography
              type={'h3'}
              text={`Happy days! Halalala! And just like that... whooosh and technical wizardry! .... you've done everything that's needed to create ${orgName}'s own ECD Connect application. Congratulations!`}
              color={'textDark'}
            />
            <Divider dividerType="dashed" className="my-4" />
            <Typography
              type={'h4'}
              text={`And now it's our turn.`}
              color={'textDark'}
            />
            <Typography
              type={'body'}
              text={`There are some bits of heavy lifting we still to do in the back end to make sure this works well for you. `}
              color={'textMid'}
            />
            <Alert
              className={'my-8 rounded-xl'}
              title={
                'You will receive a confirmation email soon to the super administrator addresses given before with more information on next steps.'
              }
              type={'info'}
            />
          </div>
        </div>
      </div>
    </BannerWrapper>
  );
};
