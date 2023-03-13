import { useTheme } from '@ecdlink/core';
import { BannerWrapper, Button, Typography, Divider } from '@ecdlink/ui';
import { useOnlineStatus } from '@hooks/useOnlineStatus';
import { useHistory, useLocation } from 'react-router-dom';
import * as styles from './infant-register.styles';
import momImage from '@/assets/momImage.png';
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
import { InfantRouteState } from '../infant.types';

export const InfantRegister: React.FC = () => {
  const { isOnline } = useOnlineStatus();
  const history = useHistory();
  const location = useLocation<InfantRouteState>();
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
          className="w-ful mb-7 pt-6"
        />

        <div className="text-textMid bg-uiBg ml-1/2 relative z-40 flex justify-center rounded-2xl py-4 shadow-md">
          <div className="flex w-11/12 flex-wrap items-center justify-center">
            <div className="bg-tertiary mt-1 mb-3 flex h-24 w-24 justify-center rounded-full">
              <img src={momImage} alt="cebisa" className="h-24 w-24" />
            </div>
            <div className="flex w-full justify-center">
              <Typography
                type="h3"
                color={'textDark'}
                text={'Please share this information with the caregiver:'}
                className="w-10/12"
                align="center"
              />
            </div>
          </div>
        </div>

        <div className={styles.wrapper}>
          <div className="flex flex-col">
            <Typography
              type="h2"
              color="textDark"
              text={'What you can expect from these visits'}
              className="pt-4"
            />

            <div className="flex items-center gap-2 pt-4">
              <div className="bg-secondary mr-2 flex h-12 w-12 items-center justify-center rounded-full">
                <PresentationChartLineIcon color="white" className="h-5 w-5" />
              </div>
              <Typography
                type="body"
                color={'textMid'}
                text={
                  "Track your child's weight and length to see how they are growing"
                }
                className="w-9/12"
              />
            </div>
            <div className="flex items-center gap-2 pt-4">
              <div className="bg-secondary mr-2 flex h-12 w-12 items-center justify-center rounded-full">
                <UserIcon color="white" className="h-5 w-5" />
              </div>
              <Typography
                type="body"
                color={'textMid'}
                text={
                  'Support with breastfeeding and when and how to start solid foods'
                }
                className="w-9/12"
              />
            </div>
            <div className="flex items-center gap-2 pt-4">
              <div className="bg-secondary mr-2 flex h-12 w-12 items-center justify-center rounded-full">
                <BellIcon color="white" className="h-5 w-5" />
              </div>
              <Typography
                type="body"
                color={'textMid'}
                text={'Immunisation, vitamin A and deworming reminders'}
                className="w-9/12"
              />
            </div>
            <div className="flex items-center gap-2 pt-4">
              <div className="bg-secondary mr-2 flex h-12 w-12 items-center justify-center rounded-full">
                <EmojiHappyIcon color="white" className="h-5 w-5" />
              </div>
              <Typography
                type="body"
                color={'textMid'}
                text={'Fun developmental activities for you and baby'}
                className="w-9/12"
              />
            </div>
            <div className="flex items-center gap-2 pt-4">
              <div className="bg-secondary mr-2 flex h-12 w-12 items-center justify-center rounded-full">
                <CurrencyDollarIcon color="white" className="h-5 w-5" />
              </div>
              <Typography
                type="body"
                color={'textMid'}
                text={'Support with accessing a child support grant early   '}
                className="w-9/12"
              />
            </div>
            <div className="flex w-11/12 justify-center text-red-400">
              <Divider dividerType="dashed" />
            </div>
            <Typography
              type="h2"
              color="textDark"
              text={'Why should you participate?'}
              className="border-primaryAccent1 mt-3 border-t border-dashed pt-4"
            />
            <div className="flex items-center gap-2 pt-4">
              <div className="bg-secondary mr-2 flex h-12 w-12 items-center justify-center rounded-full">
                <HeartIcon color="white" className="h-5 w-5" />
              </div>
              <Typography
                type="body"
                color={'textMid'}
                text={
                  "Be supported during the first thousand days of your baby's life"
                }
                className="w-9/12"
              />
            </div>
            <div className="flex items-center gap-2 pt-4">
              <div className="bg-secondary mr-2 flex h-12 w-12 items-center justify-center rounded-full">
                <FolderOpenIcon color="white" className="h-5 w-5" />
              </div>
              <Typography
                type="body"
                color={'textMid'}
                text={
                  'Access information and support to help your baby grow great and healthy'
                }
                className="w-9/12"
              />
            </div>
            <div className="flex items-center gap-2 pt-4">
              <div className="bg-secondary mr-2 flex h-12 w-12 items-center justify-center rounded-full">
                <ClipboardCheckIcon color="white" className="h-5 w-5" />
              </div>
              <Typography
                type="body"
                color={'textMid'}
                text={
                  'Regular follow up visits from your community health worker'
                }
                className="w-9/12"
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
                onClick={() =>
                  history.push(ROUTES.INFANT_REGISTER_FORM, {
                    motherId: location.state?.motherId,
                    bornEventId: location.state?.bornEventId,
                  })
                }
              />
            </div>
          </div>
        </div>
      </BannerWrapper>
    </div>
  );
};
