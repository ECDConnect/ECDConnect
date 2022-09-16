import { useTheme } from '@ecdlink/core';
import { BannerWrapper, Button, Typography } from '@ecdlink/ui';
import { useOnlineStatus } from '@hooks/useOnlineStatus';
import { useHistory } from 'react-router-dom';
import * as styles from './pregnant-register.styles';
import momImage from '../../../assets/momImage.png';
import {
  LightBulbIcon,
  ClipboardListIcon,
  HeartIcon,
} from '@heroicons/react/solid';
import ROUTES from '@routes/routes';

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
          className="z-50 w-ful pt-6"
        />

        <div className="flex justify-center pt-6">
          <div className="text-textMid relative pt-4 z-40 w-11/12 h-60 bg-uiBg ml-1/2 rounded-2xl flex justify-center">
            <div className="w-11/12 flex justify-center flex-wrap mt-8">
              <div className="flex justify-center items-center w-24 h-24 bg-tertiary rounded-full">
                <img src={momImage} alt="cebisa" className="h-28 w-28 mb-2" />
              </div>
              <div className="flex justify-center w-full">
                <Typography
                  type="h3"
                  color={'textDark'}
                  text={'Please share this information with the new client:'}
                  className="z-50 pt-2 w-10/12"
                  align="center"
                />
              </div>
            </div>
          </div>
        </div>
        <div className={styles.wrapper}>
          <div className="flex flex-wrap w-10/12">
            <Typography
              type="h2"
              color={'textMid'}
              text={'What you can expect from these visits'}
              className="z-50 pt-4"
            />
            <div className="flex gap-2 items-center pt-4">
              <div className="w-12 h-12 flex items-center justify-center bg-secondary rounded-full mr-2">
                <HeartIcon color="white" className="w-5 h-5" />
              </div>
              <Typography
                type="body"
                color={'textMid'}
                text={
                  'Support for your health and wellbeing during your pregnancy and beyond    '
                }
                className="z-50 w-9/12"
              />
            </div>
            <div className="flex gap-2 items-center pt-4">
              <div className="w-12 h-12 flex items-center justify-center bg-secondary rounded-full mr-2">
                <LightBulbIcon color="white" className="w-5 h-5" />
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
            <div className="flex gap-2 items-center pt-4">
              <div className="w-12 h-12 flex items-center justify-center bg-secondary rounded-full mr-2">
                <ClipboardListIcon color="white" className="w-5 h-5" />
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
            <div className={'mt-10 w-full'}>
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
