import {
  BannerWrapper,
  MenuListDataItem,
  ProfileAvatar,
  StackedList,
} from '@ecdlink/ui';
import { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { useOnlineStatus } from '@hooks/useOnlineStatus';
import { useAppDispatch } from '@store';
import { analyticsActions } from '@store/analytics';
import TransparentLayer from '../../../assets/TransparentLayer.png';
import ROUTES from '@/routes/routes';
import iconRobotImage from '@/assets/iconRobot.svg';
import { useSelector } from 'react-redux';
import { practitionerSelectors } from '@/store/practitioner';
import { VideoCameraIcon, DocumentTextIcon } from '@heroicons/react/solid';
import { useTenant } from '@/hooks/useTenant';
import { DownloadAppCard } from '@/components/download-app-card/download-app-card';
import { getLogo, LogoSvgs } from '@/utils/common/svg.utils';

export const HelpTypes = {
  videos: 'Watch videos',
  download: 'Download guide',
  chat: 'Chat on WhatsApp',
};

export const PractitionerHelp: React.FC = () => {
  const appDispatch = useAppDispatch();
  const { isOnline } = useOnlineStatus();
  const history = useHistory();
  const practitioner = useSelector(practitionerSelectors.getPractitioner);
  const tenant = useTenant();

  const whatsapp = () => {
    window.open(
      `https://wa.me/${tenant.tenant?.organisationHelpWhatsAppNumber}`
    );
  };

  const videos = () => {
    window.open(`https://www.youtube.com/@ECDConnect/playlists`);
  };

  const download = () => {
    if (practitioner?.isPrincipal) {
      window.open(
        `https://docs.google.com/document/d/1JvVeIiiGhd4Qz9yNBvBxQAW-lttI8J0u6ACK9q7_Zc8/edit?usp=sharing`
      );
    } else {
      window.open(
        `https://docs.google.com/document/d/1F_7OWm300KIhpIezsFyUxRPPpnGfHH3DQsl_62rgcic/edit?usp=sharing`
      );
    }
  };

  useEffect(() => {
    if (!isOnline) {
      appDispatch(
        analyticsActions.createViewTracking({
          pageView: window.location.pathname,
          title: 'Practitioner About',
        })
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOnline]);

  const getStackedMenuList = (): MenuListDataItem[] => {
    const titleStyle = 'text-textDark font-semibold text-base leading-snug';
    const subTitleStyle = 'text-sm font-h1 font-normal text-textMid';

    const stackedMenuList: MenuListDataItem[] = [
      {
        title: 'Watch videos',
        titleStyle,
        subTitle: 'Learn with short clips',
        subTitleStyle,
        customIcon: (
          <div className="bg-quatenary mr-2 rounded-full p-3">
            <VideoCameraIcon className="h-8 w-8 text-white" />
          </div>
        ),
        showIcon: true,
        iconBackgroundColor: 'quatenary',
        iconColor: 'white',
        backgroundColor: 'uiBg',
        onActionClick: () => {
          videos();
        },
      },
      {
        title: 'Download guide',
        titleStyle,
        subTitle: 'Step-by-step instructions',
        subTitleStyle,
        customIcon: (
          <div className="bg-quatenary mr-2 rounded-full p-3">
            <DocumentTextIcon className="h-8 w-8 text-white" />
          </div>
        ),
        showIcon: true,
        iconBackgroundColor: 'quatenary',
        iconColor: 'white',
        backgroundColor: 'uiBg',
        onActionClick: () => {
          download();
        },
      },
      {
        title: 'Chat on WhatsApp',
        titleStyle,
        subTitle: 'Send us a message',
        subTitleStyle,
        customIcon: (
          <div className="bg-quatenary mr-2 rounded-full p-3">
            <img
              alt=""
              src={getLogo(LogoSvgs.whatsappWhite)}
              className="h-8 w-8 text-white"
            />
          </div>
        ),
        showIcon: true,
        iconBackgroundColor: 'quatenary',
        iconColor: 'white',
        backgroundColor: 'uiBg',
        onActionClick: () => {
          whatsapp();
        },
      },
    ];

    return stackedMenuList;
  };

  return (
    <BannerWrapper
      showBackground
      backgroundImageColour={'primary'}
      title={'Get help'}
      color={'primary'}
      backgroundUrl={TransparentLayer}
      size="medium"
      renderBorder
      displayOffline={!isOnline}
      onBack={() => history.push(ROUTES.PRACTITIONER.PROFILE.ROOT)}
    >
      <div className="">
        <div className={'inline-flex w-full justify-center pt-8'}>
          <ProfileAvatar
            dataUrl={iconRobotImage}
            size={'header'}
            canChangeImage={false}
            onPressed={() => {}}
            hasConsent={true}
          />
        </div>
        <StackedList
          listItems={getStackedMenuList()}
          type={'MenuList'}
          className={'-mt-0.5 flex flex-col gap-1 px-4'}
        ></StackedList>
        <DownloadAppCard className="w-12/12 ml-4 mr-4 mt-5 shadow" />
      </div>
    </BannerWrapper>
  );
};
