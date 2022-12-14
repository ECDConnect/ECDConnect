import { useState, useEffect } from 'react';
import {
  StackedList,
  UserAlertListDataItem,
  Card,
  Typography,
  renderIcon,
  Button,
  LoadingSpinner,
} from '@ecdlink/ui';
import { getAvatarColor } from '@ecdlink/core';
// import SearchHeader from '../../../../../components/search-header/search-header';
// import { format } from 'date-fns';
import { useHistory } from 'react-router-dom';
import * as styles from './practitioners-list.styles';
import ROUTES from '@routes/routes';
import { useSelector } from 'react-redux';
// import { practitionerForCoachSelectors } from '@/store/practitionerForCoach';
import {
  practitionerSelectors,
  practitionerThunkActions,
} from '@/store/practitioner';
import { EmptyPractitioners } from './components/empty-practitioners/empty-practitioners';
import { PractitionerDto } from '@/../../../packages/core/lib';
import { useAppDispatch } from '@store';
// import { getPractitionerAlertModel } from '@/utils/practitioner/practitioner-alert-message-util';
// import { childrenSelectors } from '@store/children';
// import { classroomsSelectors } from '@store/classroom';
// import { contentReportSelectors } from '@store/content/report';
import { authSelectors } from '@/store/auth';
import { PractitionerService } from '@/services/PractitionerService';

export const PractitionersList: React.FC = () => {
  const userAuth = useSelector(authSelectors.getAuthUser);
  const appDispatch = useAppDispatch();
  const history = useHistory();
  // const progressReports = useSelector(
  //   contentReportSelectors?.getAllChildProgressObservationReports
  // );

  const practitioner = useSelector(practitionerSelectors.getPractitioner);
  const practitioners = useSelector(practitionerSelectors.getPractitioners);
  const practitionersList = practitioners?.filter(
    (item) => item.userId !== practitioner?.userId
  );
  // const children = useSelector(childrenSelectors.getChildren);
  // const classroomGroups = useSelector(classroomsSelectors.getClassroomGroups);
  // const classroomGroupLearners = useSelector(
  //   classroomsSelectors.getClassroomGroupLearners
  // );

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [practitionerListData, setPractitionerListData] =
    useState<UserAlertListDataItem[]>();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [addChildButtonExpanded, setAddChildButtonExpanded] =
    useState<boolean>(true);
  const [practitionersMessages, setPractitionersMessages] = useState<any[]>();
  const [loading, setLoading] = useState(false);

  const handleClick = (practitionerId: string) => {
    history.push(ROUTES.PRINCIPAL.PRACTITIONER_PROFILE, {
      practitionerId,
    });
  };

  useEffect(() => {
    (async () =>
      await appDispatch(
        practitionerThunkActions.getAllPractitioners({})
      ).unwrap())();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (
      practitionersList &&
      practitionersList?.length > 0 &&
      practitionersMessages?.length! > 0
    ) {
      const practitionerListItem: UserAlertListDataItem[] = [];
      for (const practitioner of practitionersList) {
        practitionerListItem.push(mapUserListDataItem(practitioner));
      }
      setPractitionerListData(practitionerListItem);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [practitionersMessages]);

  const classroomsDetailsForPractitioner = async () => {
    setLoading(true);
    const practitionersMessageData = await new PractitionerService(
      userAuth?.auth_token!
    ).displayMetrics('practitioner');

    setPractitionersMessages(practitionersMessageData);
    setLoading(false);
    return practitionersMessageData;
  };

  useEffect(() => {
    classroomsDetailsForPractitioner();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const mapUserListDataItem = (
    practitionerRecord: PractitionerDto
  ): UserAlertListDataItem => {
    const practitioner = practitionersList?.find(
      (x) => x.userId === practitionerRecord.userId
    );

    const currentPractitionerMessage = practitionersMessages?.find((item) => {
      return item?.userId === practitionerRecord?.userId;
    });

    // const practitionerClassroomGroups = classroomGroups?.filter((item: any) => {
    //   return item?.userId === practitioner?.userId;
    // });
    // const practitionerLearners = classroomGroupLearners.filter((el) => {
    //   return practitionerClassroomGroups.some((f) => {
    //     return f.id === el.classroomGroupId;
    //   });
    // });
    // const childrenForPractitioner = practitionerLearners.filter((el) => {
    //   return children?.some((f) => {
    //     return f.userId === el.userId;
    //   });
    // });

    // const practitionerChildrenReports = progressReports?.filter((item) => {
    //   return childrenForPractitioner?.some((f) => {
    //     return f.id === item?.childId;
    //   });
    // });

    // const practitionerAlert = getPractitionerAlertModel(
    //   practitionerRecord,
    //   practitioners,
    //   childrenForPractitioner,
    //   practitionerChildrenReports,
    //   children
    // );

    return {
      id: practitioner?.id,
      profileDataUrl: practitioner?.user?.profileImageUrl!,
      title: `${practitioner?.user?.firstName} ${practitioner?.user?.surname}`,
      subTitle: `${currentPractitionerMessage?.subject}`,
      profileText: `${
        practitioner?.user?.firstName && practitioner?.user?.firstName[0]
      }${practitioner?.user?.surname && practitioner?.user?.surname[0]}`,
      alertSeverity:
        currentPractitionerMessage?.color === 'Success'
          ? 'success'
          : currentPractitionerMessage?.color === 'Warning'
          ? 'warning'
          : 'error',
      avatarColor: getAvatarColor() || '',
      onActionClick: () => handleClick(practitioner?.userId!),
    };
  };

  const handleReassignClass = () => {
    history.push('principal/practitioner-reassign-class');
  };

  return (
    <>
      {practitionersList?.length! > 0 || practitionersList !== undefined ? (
        <div className="flex flex-wrap justify-center">
          {loading ? (
            <LoadingSpinner
              className="mt-6"
              size={'medium'}
              spinnerColor={'primary'}
              backgroundColor={'uiLight'}
            />
          ) : (
            <>
              <div className="w-11/12">
                <StackedList
                  className={styles.stackedList}
                  listItems={practitionerListData ? practitionerListData : []}
                  type={'UserAlertList'}
                ></StackedList>
              </div>
              <Card className={styles.absentCard}>
                <div className={styles.absentCardTitle}>
                  <Typography
                    type={'h1'}
                    color="textDark"
                    text={'Is someone absent today?'}
                    className={styles.absentCardTitle}
                  />
                  <Typography
                    type={'body'}
                    color="textMid"
                    text={
                      'You can reassign a class to another practitioner for the day.'
                    }
                    className={styles.absentCardSubTitle}
                  />
                  <div className="flex justify-center">
                    <Button
                      type="filled"
                      color="primary"
                      className={'mt-6 mb-6 w-11/12'}
                      onClick={handleReassignClass}
                    >
                      {renderIcon(
                        'PencilAltIcon',
                        'w-5 h-5 color-white text-white mr-1'
                      )}
                      <Typography
                        type="body"
                        className="mr-4"
                        color="white"
                        text={'Reassign a class'}
                      ></Typography>
                    </Button>
                  </div>
                </div>
              </Card>
              <div className="flex w-11/12 justify-center">
                <Button
                  type="outlined"
                  color="primary"
                  className={'mt-6 mb-6 w-full'}
                  onClick={() =>
                    history.push(ROUTES.PRINCIPAL.ADD_PRACTITIONER)
                  }
                >
                  {renderIcon(
                    'UsersIcon',
                    'w-5 h-5 color-primary text-primary mr-2'
                  )}
                  <Typography
                    type="body"
                    className="mr-4"
                    color="primary"
                    text={'Add practitioners'}
                  ></Typography>
                </Button>
              </div>
            </>
          )}
        </div>
      ) : (
        <EmptyPractitioners />
      )}
    </>
  );
};

export default PractitionersList;
