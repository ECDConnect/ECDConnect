import CompleteProfile from '../edit-coach-profile/components/complete-profile/complete-profile';
import { useOnlineStatus } from '@hooks/useOnlineStatus';
import { useDocuments } from '@hooks/useDocuments';
import { useHistory } from 'react-router-dom';
import { userSelectors } from '@store/user';
import { useSelector } from 'react-redux';
import ROUTES from '@routes/routes';
import {
  BannerWrapper,
  MenuListDataItem,
  StackedList,
  TabItem,
  TabList,
} from '@ecdlink/ui';

export const CoachProfile: React.FC = () => {
  const user = useSelector(userSelectors.getUser);
  const { userProfilePicture } = useDocuments();
  const { isOnline } = useOnlineStatus();
  const history = useHistory();

  const getStackedMenuList = (): MenuListDataItem[] => {
    const stackedMenuList: MenuListDataItem[] = [
      {
        title: `${user?.firstName} ${user?.surname}`,
        subTitle: 'About me',
        menuIconUrl: userProfilePicture?.file,
        menuIcon: 'UserIcon',
        iconBackgroundColor: 'primary',
        iconColor: 'white',

        showIcon: userProfilePicture?.file === undefined,
        onActionClick: () => {
          history.push(ROUTES.COACH.ABOUT);
        },
      },
      {
        title: 'Account',
        subTitle: 'Password',
        menuIcon: 'ShieldCheckIcon',
        menuIconClassName: 'text-white bg-primary',
        iconBackgroundColor: 'primary',
        showIcon: true,
        iconColor: 'white',
        onActionClick: () => {
          history.push(ROUTES.PRACTITIONER.ACCOUNT);
        },
      },
    ];

    return stackedMenuList;
  };

  const tabItem: TabItem[] = [
    {
      title: 'Profile',
      initActive: true,
      child: (
        <div>
          <CompleteProfile />
          <StackedList
            listItems={getStackedMenuList()}
            type={'MenuList'}
          ></StackedList>
        </div>
      ),
    },
  ];

  return (
    <BannerWrapper
      size="normal"
      renderBorder={true}
      title={`${user?.firstName} ${user?.surname}`}
      color={'primary'}
      onBack={() => history.push(ROUTES.ROOT)}
      backgroundColour="uiBg"
      displayOffline={!isOnline}
    >
      <div className="bg-white">
        <TabList tabItems={tabItem} />
      </div>
    </BannerWrapper>
  );
};
