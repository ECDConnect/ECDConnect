import { useTheme } from '@ecdlink/core';
import { BannerWrapper, Button, Typography, Divider } from '@ecdlink/ui';
import { useOnlineStatus } from '@hooks/useOnlineStatus';
import { useHistory } from 'react-router-dom';
import * as styles from './infant-register.styles';
import momImage from '../../../assets/momImage.png';
import {
  BellIcon,
  ClipboardCheckIcon,
  CurrencyDollarIcon,
  EmojiHappyIcon,
  FolderOpenIcon,
  HeartIcon,
  PresentationChartLineIcon,
  UserIcon,
} from '@heroicons/react/solid';
import ROUTES from '@routes/routes';

export const InfantRegister: React.FC = () => {
  const { isOnline } = useOnlineStatus();
  const history = useHistory();
  const { theme } = useTheme();

  return (
    <div className={'h-full overflow-y-auto'}>
      <BannerWrapper
        showBackground={true}
        backgroundUrl={theme?.images.graphicOverlayUrl}
        backgroundImageColour={'primary'}
        title={'Child registration'}
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
          text={'Register a new child!'}
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
                  text={'Please share this information with the caregiver:'}
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
                <PresentationChartLineIcon color="white" className="w-5 h-5" />
              </div>
              <Typography
                type="body"
                color={'textMid'}
                text={
                  "Track your child's weight and length to see how they are growing"
                }
                className="z-50 w-9/12"
              />
            </div>
            <div className="flex gap-2 items-center pt-4">
              <div className="w-12 h-12 flex items-center justify-center bg-secondary rounded-full mr-2">
                <UserIcon color="white" className="w-5 h-5" />
              </div>
              <Typography
                type="body"
                color={'textMid'}
                text={
                  'Support with breastfeeding and when and how to start solid foods'
                }
                className="z-50 w-9/12"
              />
            </div>
            <div className="flex gap-2 items-center pt-4">
              <div className="w-12 h-12 flex items-center justify-center bg-secondary rounded-full mr-2">
                <BellIcon color="white" className="w-5 h-5" />
              </div>
              <Typography
                type="body"
                color={'textMid'}
                text={'Immunisation, vitamin A and deworming reminders'}
                className="z-50 w-9/12"
              />
            </div>
            <div className="flex gap-2 items-center pt-4">
              <div className="w-12 h-12 flex items-center justify-center bg-secondary rounded-full mr-2">
                <EmojiHappyIcon color="white" className="w-5 h-5" />
              </div>
              <Typography
                type="body"
                color={'textMid'}
                text={'Fun developmental activities for you and baby'}
                className="z-50 w-9/12"
              />
            </div>
            <div className="flex gap-2 items-center pt-4">
              <div className="w-12 h-12 flex items-center justify-center bg-secondary rounded-full mr-2">
                <CurrencyDollarIcon color="white" className="w-5 h-5" />
              </div>
              <Typography
                type="body"
                color={'textMid'}
                text={'Support with accessing a child support grant early   '}
                className="z-50 w-9/12"
              />
            </div>
            <div className="flex justify-center w-11/12 text-red-400">
              <Divider dividerType="dashed" />
            </div>
            <Typography
              type="h2"
              color={'textMid'}
              text={'Why should you participate?'}
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
                  'Be supported during the first thousand days of your babies life'
                }
                className="z-50 w-9/12"
              />
            </div>
            <div className="flex gap-2 items-center pt-4">
              <div className="w-12 h-12 flex items-center justify-center bg-secondary rounded-full mr-2">
                <FolderOpenIcon color="white" className="w-5 h-5" />
              </div>
              <Typography
                type="body"
                color={'textMid'}
                text={
                  'Access information and support to help your baby grow great and healthy'
                }
                className="z-50 w-9/12"
              />
            </div>
            <div className="flex gap-2 items-center pt-4">
              <div className="w-12 h-12 flex items-center justify-center bg-secondary rounded-full mr-2">
                <ClipboardCheckIcon color="white" className="w-5 h-5" />
              </div>
              <Typography
                type="body"
                color={'textMid'}
                text={
                  'Regular follow up visits from your community health worker'
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
                onClick={() => history.push(ROUTES.INFANT_REGISTER_FORM)}
              />
            </div>
          </div>
        </div>
      </BannerWrapper>
    </div>
  );
};
