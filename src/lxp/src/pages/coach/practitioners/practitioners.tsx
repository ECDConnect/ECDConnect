import { StackedList, BannerWrapper } from '@ecdlink/ui';
import { format } from 'date-fns';
import { useHistory } from 'react-router-dom';
import * as styles from './practitioner.styles';
import ROUTES from '@routes/routes';
import { useSelector } from 'react-redux';
import { practitionerForCoachSelectors } from '@/store/practitionerForCoach';
import { practitionerSelectors } from '@/store/practitioner';
import { IconInformationIndicator } from '../../classroom/programme-planning/components/icon-information-indicator/icon-information-indicator';

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
  const practitionersForCoach = useSelector(
    practitionerForCoachSelectors.getPractitionersForCoach
  );
  const practitioners = useSelector(practitionerSelectors.getPractitioners);
  const practitionersList = practitioners?.filter((item) =>
    practitionersForCoach?.find((item2) => item.id === item2.id)
  );
  const practitionersForCoachListItems = practitionersList?.map((item) => {
    return {
      title: item.user?.firstName + ' ' + item?.user?.surname,
      subtitle: 'Progress report overdue',
      avatarColor: '#6974af',
      alertSeverity: 'none',
      profileText:
        item?.user?.firstName.substring(0, 1)! +
        item?.user?.surname.substring(0, 1),
      onActionClick: () => handleClick(item.userId!),
    };
  });

  const handleClick = (practitionerId: string) => {
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
  // const mockedData = [
  //   {
  //     id: 1,
  //     title: 'John Buffalo',
  //     subTitle: 'Progress report overdue',
  //     avatarColor: '#6974af',
  //     profileText: 'Jb',
  //     alertSeverity: 'error',
  //     onActionClick: () => handleClick(1),
  //   },
  //   {
  //     id: 2,
  //     title: 'Pedro Machado',
  //     subTitle: 'Progress report overdue',
  //     avatarColor: '#6974af',
  //     profileText: 'Pm',
  //     alertSeverity: 'error',
  //     onActionClick: () => handleClick(2),
  //   },
  //   {
  //     id: 3,
  //     title: 'Carlos Vieira',
  //     subTitle: 'Progress report overdue',
  //     avatarColor: '#6974af',
  //     profileText: 'Cv',
  //     alertSeverity: 'error',
  //     onActionClick: () => handleClick(3),
  //   },
  // ];

  return (
    <>
      <BannerWrapper
        size={'small'}
        renderBorder={true}
        title={`SmartStarters`}
        subTitle={format(new Date(), 'dd MMM yyyy')}
        color={'primary'}
        onBack={() => history.push(ROUTES.DASHBOARD)}
        // displayOffline={!isOnline}
      >
        {practitionersForCoachListItems?.length! > 0 ? (
          <div className="flex justify-center">
            <StackedList
              className={styles.stackedList}
              listItems={practitionersForCoachListItems!}
              type={'UserAlertList'}
            ></StackedList>
          </div>
        ) : (
          <IconInformationIndicator
            title="This practitioner doesn't have any children yet!"
            subTitle="Check with the practitioner!"
          />
        )}
      </BannerWrapper>
    </>
  );
};

export default Practitioners;
