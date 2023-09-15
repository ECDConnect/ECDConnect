import AlienImage from '@/assets/ECD_Connect_alien.svg';
import ROUTES from '@/routes/routes';
import {
  EmptyPage,
  FADButton,
  StackedList,
  StackedListType,
  UserAlertListDataItem,
} from '@ecdlink/ui';
import { useHistory } from 'react-router';

export const ClubsTab = () => {
  const history = useHistory();
  // TODO: replace mockedClubs with real data
  const mockedClubs: UserAlertListDataItem[] = [
    {
      id: '01',
      avatarColor: '#D7D1E6',
      iconColor: 'primary',
      alertSeverity: 'success',
      title: 'Club 1',
      subTitle: 'status',
      onActionClick() {
        history.push(ROUTES.COMMUNITY.CLUB.ROOT.replace(':clubId', '01'));
      },
    },
  ];

  // TODO: replace isEmptyState with real data
  const isEmptyState = !mockedClubs.length;

  return (
    <div className="p-4 text-black">
      {isEmptyState ? (
        <EmptyPage
          image={AlienImage}
          title="You don’t have any clubs yet!"
          subTitle="Add a new club or, if you already have clubs, please reach out to your franchisor to make sure they have been assigned to you on Funda App."
        />
      ) : (
        <StackedList
          type={'UserAlertList' as StackedListType}
          listItems={mockedClubs}
        />
      )}
      <FADButton
        title="Add a new club"
        icon="PlusIcon"
        iconDirection="left"
        textToggle
        type="filled"
        color="primary"
        shape="round"
        className="absolute bottom-1 right-1 z-10 m-3 px-3.5 py-2.5"
        // TODO: add onClick
        click={() => {}}
      />
    </div>
  );
};
