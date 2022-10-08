import { useState, useEffect } from 'react';
import {
  StackedList,
  SearchSortOptions,
  UserAlertListDataItem,
  SearchDropDown,
  Card,
  Typography,
  renderIcon,
  Button,
  AlertSeverityType,
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
import { getPractitionerAlertModel } from '@/utils/practitioner/practitioner-alert-message-util';

export const PractitionersList: React.FC = () => {
  const appDispatch = useAppDispatch();
  const history = useHistory();
  // const isCoach = true;
  // const practitionersForCoach = useSelector(
  //   practitionerForCoachSelectors.getPractitionersForCoach
  // );
  const practitioner = useSelector(practitionerSelectors.getPractitioner);
  const practitioners = useSelector(practitionerSelectors.getPractitioners);
  const practitionersList = practitioners?.filter(
    (item) => item.userId !== practitioner?.userId
  );
  const redirectedFromPractitionersList = true;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [practitionerListData, setPractitionerListData] =
    useState<UserAlertListDataItem[]>();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [addChildButtonExpanded, setAddChildButtonExpanded] =
    useState<boolean>(true);

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
    if (practitionersList && practitionersList?.length > 0) {
      const practitionerListItem: UserAlertListDataItem[] = [];
      for (const practitioner of practitionersList) {
        practitionerListItem.push(mapUserListDataItem(practitioner));
      }
      setPractitionerListData(practitionerListItem);
      // setFilteredChildData(practitionerListItem);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const mapUserListDataItem = (
    practitionerRecord: PractitionerDto
  ): UserAlertListDataItem => {
    const practitioner = practitionersList?.find(
      (x) => x.userId === practitionerRecord.userId
    );

    // const childAlert = getChildAlertModel(
    //   childLearner,
    //   pendingStatusId,
    //   childUser,
    //   childRecord,
    //   childDocuments,
    //   attendanceData,
    //   classroomGroups,
    //   classroomGroupProgrammes,
    //   reports
    // );

    const practitionerAlert = getPractitionerAlertModel(
      practitionerRecord,
      practitioners
    );

    return {
      id: practitioner?.id,
      profileDataUrl: practitioner?.user?.profileImageUrl!,
      title: `${practitioner?.user?.firstName} ${practitioner?.user?.surname}`,
      subTitle: practitionerAlert?.message || '',
      profileText: `${
        practitioner?.user?.firstName && practitioner?.user?.firstName[0]
      }${practitioner?.user?.surname && practitioner?.user?.surname[0]}`,
      alertSeverity: practitionerAlert.status as AlertSeverityType,
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
        <div className="flex justify-center flex-wrap">
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
                  className={'w-11/12 mt-6 mb-6'}
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
          <div className="flex justify-center w-11/12">
            <Button
              type="outlined"
              color="primary"
              className={'w-full mt-6 mb-6'}
              onClick={() => history.push(ROUTES.PRINCIPAL.ADD_PRACTITIONER)}
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
        </div>
      ) : (
        <EmptyPractitioners />
      )}
    </>
  );
};

export default PractitionersList;
