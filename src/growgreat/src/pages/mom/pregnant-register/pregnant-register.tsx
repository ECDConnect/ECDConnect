import { useTheme } from '@ecdlink/core';
import { useHistory } from 'react-router-dom';
import { useOnlineStatus } from '@/hooks/useOnlineStatus';
import { BannerWrapper, Button, Typography } from '@ecdlink/ui';
import {
  HeartIcon,
  LightBulbIcon,
  ClipboardListIcon,
} from '@heroicons/react/solid';
import ROUTES from '@/routes/routes';
import * as styles from '@/pages/mom/pregnant-register/pregnant-register.styles';
import momImage from '@/assets/momImage.png';

export const PregnantRegister: React.FC = () => {
  const { isOnline } = useOnlineStatus();
  const history = useHistory();
  const { theme } = useTheme();

  return (
    <div className={'h-full overflow-y-auto'}>
      <BannerWrapper
        showBackground={true}
        backgroundUrl={theme?.images.graphicOverlayUrl}
        backgroundImageColour={'primary'}
        title={'Pregnant mom registration'}
        subTitle={'Welcome'}
        color={'primary'}
        size="large"
        renderBorder={true}
        renderOverflow={false}
        onBack={() => history.goBack()}
        displayOffline={!isOnline}
        className={styles.bannerContent}
      >
        <Typography
          type="h1"
          color={'white'}
          text={'Register a new pregnant client!'}
          className="w-ful z-50 pt-6"
        />

        <div className="text-textMid bg-uiBg mt-7  flex  w-full flex-wrap justify-center rounded-2xl py-6 px-4 shadow-xl">
          <div className="bg-tertiary flex h-24 w-24 items-center justify-center rounded-full">
            <img src={momImage} alt="momImage" className="h-26 w-29" />
          </div>
          <div className="flex w-full justify-center">
            <Typography
              type="h3"
              color={'textDark'}
              text={'Please share this information with the new client:'}
              className="pt-2"
              align="center"
            />
          </div>
        </div>
        <div className={styles.wrapper}>
          <div className="w-8/11 flex flex-col flex-wrap">
            <Typography
              type="h2"
              color={'textDark'}
              text={'What you can expect from these visits'}
            />
            <div className="flex gap-2 pt-4">
              <div className="bg-secondary mr-2 flex h-12 w-12 items-center justify-center rounded-full">
                <HeartIcon color="white" className="h-5 w-5" />
              </div>
              <Typography
                type="body"
                color={'textMid'}
                text={
                  'Support for your health and wellbeing during your pregnancy and beyond'
                }
                className="z-50 w-9/12"
              />
            </div>
            <div className="flex gap-2 pt-4">
              <div className="bg-secondary mr-2 flex h-12 w-12 items-center justify-center rounded-full">
                <LightBulbIcon color="white" className="h-5 w-5" />
              </div>
              <Typography
                type="body"
                color={'textMid'}
                text={
                  'Tips and information on how to have a safe pregnancy and start planning for labour'
                }
                className="z-50 w-9/12"
              />
            </div>
            <div className="flex gap-2 pt-4">
              <div className="bg-secondary mr-2 flex h-12 w-12 items-center justify-center rounded-full">
                <ClipboardListIcon color="white" className="h-5 w-5" />
              </div>
              <Typography
                type="body"
                color={'textMid'}
                text={
                  'Follow up visits and regular support with challenges like mental health, nutrition and danger signs'
                }
                className="z-50 w-9/12"
              />
            </div>
            <div className={'mt-9 w-full'}>
              <Button
                type={'filled'}
                color={'primary'}
                className={'mt-2 w-full'}
                textColor={'white'}
                text={`Start`}
                icon={'ArrowCircleRightIcon'}
                iconPosition={'start'}
                onClick={() => history.push(ROUTES.MOM_REGISTER_FORM)}
              />
            </div>
          </div>
        </div>
      </BannerWrapper>
    </div>
  );
};
