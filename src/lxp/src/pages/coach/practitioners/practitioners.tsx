import {
  Button,
  StackedList,
  Typography,
  classNames,
  renderIcon,
  BannerWrapper,
} from '@ecdlink/ui';
import { format } from 'date-fns';
import { useHistory } from 'react-router-dom';
import * as styles from './practitioner.styles';

// const mockedData = [
//   {
//     title: 'John Buffalo',
//     subTitle: 'Progress report overdue',
//     avatarColor: '#6974af',
//     profileText: 'Jb',
//     alertSeverity: 'error',
//     onActionClick: () handleClick => {}
//   },
//   {
//     title: 'Pedro Machado',
//     subTitle: 'Progress report overdue',
//     avatarColor: '#6974af',
//     profileText: 'Pm',
//     alertSeverity: 'error',
//   },
//   {
//     title: 'Carlos Vieira',
//     subTitle: 'Progress report overdue',
//     avatarColor: '#6974af',
//     profileText: 'Cv',
//     alertSeverity: 'error',
//   },
// ];

export const Practitioners: React.FC = () => {
  const history = useHistory();
  const isCoach = true;

  const handleClick = (practitionerId: number) => {
    if (isCoach) {
      history.push('practitioner-profile-info', {
        practitionerId,
      });
    } else {
      history.push('practitioner-info-dashboard', {
        practitionerId,
      });
    }
  };
  const mockedData = [
    {
      id: 1,
      title: 'John Buffalo',
      subTitle: 'Progress report overdue',
      avatarColor: '#6974af',
      profileText: 'Jb',
      alertSeverity: 'error',
      onActionClick: () => handleClick(1),
    },
    {
      id: 2,
      title: 'Pedro Machado',
      subTitle: 'Progress report overdue',
      avatarColor: '#6974af',
      profileText: 'Pm',
      alertSeverity: 'error',
      onActionClick: () => handleClick(2),
    },
    {
      id: 3,
      title: 'Carlos Vieira',
      subTitle: 'Progress report overdue',
      avatarColor: '#6974af',
      profileText: 'Cv',
      alertSeverity: 'error',
      onActionClick: () => handleClick(3),
    },
  ];

  return (
    <>
      <BannerWrapper
        size={'small'}
        renderBorder={true}
        title={`SmartStarters`}
        subTitle={format(new Date(), 'dd MMM yyyy')}
        color={'primary'}
        onBack={history.goBack}
        // displayOffline={!isOnline}
      >
        {mockedData ? (
          <div className="flex justify-center">
            <StackedList
              className={styles.stackedList}
              listItems={mockedData}
              type={'UserAlertList'}
            ></StackedList>
          </div>
        ) : null}

        {/* {mockedData
          ? mockedData.map((practitioner) => {
              return <PractitionersListItem />;
            })
          : null} */}
      </BannerWrapper>
    </>
  );
};

export default Practitioners;
