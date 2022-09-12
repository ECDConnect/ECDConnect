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
} from '@ecdlink/ui';
import { getAvatarColor } from '@ecdlink/core';
// import SearchHeader from '../../../../../components/search-header/search-header';
// import { format } from 'date-fns';
import { useHistory } from 'react-router-dom';
import * as styles from './practitioners-list.styles';
import ROUTES from '@routes/routes';
import { useSelector } from 'react-redux';
// import { practitionerForCoachSelectors } from '@/store/practitionerForCoach';
import { practitionerSelectors } from '@/store/practitioner';
import { EmptyPractitioners } from './components/empty-practitioners/empty-practitioners';
import { PractitionerDto } from '@/../../../packages/core/lib';

export const PractitionersList: React.FC = () => {
  const history = useHistory();
  // const isCoach = true;
  // const practitionersForCoach = useSelector(
  //   practitionerForCoachSelectors.getPractitionersForCoach
  // );
  const practitioners = useSelector(practitionerSelectors.getPractitioners);
  // const practitionersList = practitioners?.filter((item) =>
  //   practitionersForCoach?.find((item2) => item.id === item2.id)
  // );

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [childUserListData, setChildUserListData] =
    useState<UserAlertListDataItem[]>();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [addChildButtonExpanded, setAddChildButtonExpanded] =
    useState<boolean>(true);
  const [searchTextActive, setSearchTextActive] = useState(false);
  // const [activeFilters, setActiveFilters] = useState<any[]>([]);
  const [activeSort, setActiveSort] = useState<any[]>([]);
  const [filteredChildData, setFilteredChildData] = useState<
    UserAlertListDataItem[]
  >([]);

  const practitionersList: PractitionerDto[] = [
    {
      id: '4efb5692-11fe-4c39-967c-a02670551406',
      userId: '59c4b252-b42e-4c9a-892c-214830a2c1b9',
      isPrincipal: true,
      isFundaAppAdmin: false,
      isTrainee: false,
      principalHierarchy: '',
      isActive: true,
      coachHierarchy: '23afbf4f-d5f5-473a-943c-67f674ea7f1e',
      isRegistered: true,
      shareInfo: true,
      languageUsedInGroups: '',
      attendanceRegisterLink: '',
      user: {
        idNumber: '8707255800080',
        fullName: 'Practitioner00001 Test0001',
        firstName: 'Practitioner00001',
        surname: 'Test0001',
        id: '59c4b252-b42e-4c9a-892c-214830a2c1b9',
        email: 'practitioner00001@gmail.com',
        phoneNumber: '+27875502599',
        profileImageUrl: '',
        isSouthAfricanCitizen: true,
        verifiedByHomeAffairs: true,
        contactPreference: '',
      },
    },
    {
      id: '974e06ab-c3d0-4520-8d8d-bb9aed891176',
      userId: '81d0da8a-9089-4f28-b734-71e9b7803180',
      isPrincipal: false,
      isFundaAppAdmin: false,
      isTrainee: false,
      principalHierarchy: '59c4b252-b42e-4c9a-892c-214830a2c1b9',
      isActive: true,
      coachHierarchy: '23afbf4f-d5f5-473a-943c-67f674ea7f1e',
      isRegistered: true,
      shareInfo: true,
      languageUsedInGroups: '',
      attendanceRegisterLink: '',
      user: {
        idNumber: '9011255800086',
        fullName: 'Practitioner00002 Test00002',
        firstName: 'Practitioner00002',
        surname: 'Test00002',
        id: '81d0da8a-9089-4f28-b734-71e9b7803180',
        email: 'practitioner00002@gmail.com',
        phoneNumber: '+27875502599',
        profileImageUrl: '',
        isSouthAfricanCitizen: true,
        verifiedByHomeAffairs: true,
        contactPreference: '',
      },
    },
    {
      id: 'f7bbea13-af5d-4180-8c35-cdb797ccc419',
      userId: '3c1036b5-8ffa-4a42-a13c-79ccd7a56aa6',
      isPrincipal: false,
      isFundaAppAdmin: false,
      isTrainee: false,
      principalHierarchy: '59c4b252-b42e-4c9a-892c-214830a2c1b9',
      isActive: true,
      coachHierarchy: '23afbf4f-d5f5-473a-943c-67f674ea7f1e',
      isRegistered: true,
      shareInfo: true,
      languageUsedInGroups: '',
      attendanceRegisterLink: '',
      user: {
        idNumber: '9204155800088',
        fullName: 'Practitioner00003 Test00003',
        firstName: 'Practitioner00003',
        surname: 'Test00003',
        id: '3c1036b5-8ffa-4a42-a13c-79ccd7a56aa6',
        email: 'practitioner00003@gmail.com',
        phoneNumber: '+27875502599',
        profileImageUrl: '',
        isSouthAfricanCitizen: true,
        verifiedByHomeAffairs: true,
        contactPreference: '',
      },
    },
  ];

  const handleClick = (practitionerId: string) => {
    console.log('heellooooo');
    history.push(ROUTES.PRINCIPAL.PRACTITIONER_PROFILE, {
      practitionerId,
    });
  };

  // const sortOptions: SearchSortOptions = {
  //   columns: [
  //     {
  //       id: '1',
  //       label: 'Priority',
  //       value: 'priority',
  //     },
  //     {
  //       id: '2',
  //       label: 'First Name',
  //       value: 'firstName',
  //     },
  //     {
  //       id: '3',
  //       label: 'Surname',
  //       value: 'surname',
  //     },
  //   ],
  //   defaultSort: {
  //     column: 'priority',
  //     dir: 'asc',
  //   },
  // };

  useEffect(() => {
    if (practitionersList && practitionersList?.length > 0) {
      const practitionerListItem: UserAlertListDataItem[] = [];
      for (const practitioner of practitionersList) {
        practitionerListItem.push(mapUserListDataItem(practitioner));
      }
      setChildUserListData(practitionerListItem);
      setFilteredChildData(practitionerListItem);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // const handleListScroll = (scrollTop: number) => {
  //   if (scrollTop < 30) {
  //     setAddChildButtonExpanded(true);
  //   } else {
  //     setAddChildButtonExpanded(false);
  //   }
  // };

  // const onSearchChange = (value: string) => {
  //   setFilteredChildData(
  //     childUserListData?.filter((x) =>
  //       x.title.toLowerCase().includes(value.toLowerCase())
  //     ) || []
  //   );
  // };

  const onSortItemsChanges = (column: string) => {
    if (practitionersList && practitionersList.length > 0) {
      // const filteredPractitioners = practitionersList.filter((practitioner) =>
      //   childUserListData?.some((x) => x.id === practitioner.id)
      // );
      const sorted = [...practitionersList].sort(
        (a: PractitionerDto, b: PractitionerDto) => {
          const practitionerOne = practitioners?.find(
            (x) => x.userId === a.userId
          );
          const practitionerTwo = practitioners?.find(
            (x) => x.userId === b.userId
          );

          switch (column) {
            // case 'priority': {
            //   const childUserDocumentsOne = documents?.filter(
            //     (x) => x.userId === a.userId
            //   );
            //   const childReportsOne = childReportSummaries?.filter(
            //     (x) => x.childId === a?.id
            //   );
            //   const childAlertOne = getChildAlertModel(
            //     childLearnerOne,
            //     pendingStatusId,
            //     childUserOne,
            //     a,
            //     childUserDocumentsOne,
            //     attendanceData,
            //     classroomGroups,
            //     classroomGroupProgrammes,
            //     childReportsOne
            //   );
            //   const childUserDocumentsTwo = documents?.filter(
            //     (x) => x.userId === b.userId
            //   );
            //   const childReportsTwo = childReportSummaries?.filter(
            //     (x) => x.childId === b?.id
            //   );
            //   const childAlertTwo = getChildAlertModel(
            //     childLearnerTwo,
            //     pendingStatusId,
            //     childUserTwo,
            //     b,
            //     childUserDocumentsTwo,
            //     attendanceData,
            //     classroomGroups,
            //     classroomGroupProgrammes,
            //     childReportsTwo
            //   );
            //   return childAlertOne.severity > childAlertTwo.severity ? 1 : -1;
            // }
            case 'surname':
              return (practitionerOne !== undefined &&
                practitionerOne?.user?.surname!) >
                (practitionerTwo !== undefined &&
                  practitionerTwo?.user?.surname!)
                ? 1
                : -1;
            case 'firstName':
            default:
              return (practitionerOne !== undefined &&
                practitionerOne.user?.firstName!) >
                (practitionerTwo !== undefined &&
                  practitionerTwo.user?.firstName!)
                ? 1
                : -1;
          }
        }
      );

      const practitionerListItem: UserAlertListDataItem[] = [];
      for (const practitioner of sorted) {
        practitionerListItem.push(mapUserListDataItem(practitioner));
      }
      console.log({ practitionerListItem });
      setChildUserListData(practitionerListItem || []);
    }
  };

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

    return {
      id: practitioner?.id,
      profileDataUrl: practitioner?.user?.profileImageUrl!,
      title: `${practitioner?.user?.firstName} ${practitioner?.user?.surname}`,
      subTitle: '',
      profileText: `${
        practitioner?.user?.firstName && practitioner?.user?.firstName[0]
      }${practitioner?.user?.surname && practitioner?.user?.surname[0]}`,
      alertSeverity: 'none',
      avatarColor: getAvatarColor() || '',
      onActionClick: () => handleClick(practitioner?.userId!),
    };
  };

  return (
    <>
      {/* <SearchHeader<UserAlertListDataItem>
        searchItems={filteredChildData || []}
        onScroll={handleListScroll}
        onSearchChange={onSearchChange}
        isTextSearchActive={searchTextActive}
        onBack={() => setSearchTextActive(false)}
        onSearchButtonClick={() => setSearchTextActive(true)}
      > */}
      {/* <SearchDropDown<string>
          displayMenuOverlay={true}
          menuItemClassName={styles.dropdownStyles}
          options={sortOptions.columns}
          selectedOptions={activeSort}
          onChange={(selectedColumns) => {
            setActiveSort(selectedColumns);
            onSortItemsChanges(selectedColumns[0].value);
          }}
          placeholder={'Sort'}
          multiple={false}
          color={'secondary'}
          info={{
            name: `Sort`,
          }}
        /> */}
      {/* </SearchHeader> */}
      {practitionersList?.length! > 0 || practitionersList !== undefined ? (
        <div className="flex justify-center flex-wrap">
          <div className="w-11/12">
            <StackedList
              className={styles.stackedList}
              listItems={childUserListData ? childUserListData : []}
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
                  onClick={() => {}}
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
              onClick={() => {}}
              disabled={true}
            >
              {renderIcon(
                'UsersIcon',
                'w-5 h-5 color-primary text-primary mr-2'
              )}
              <Typography
                type="body"
                className="mr-4"
                color="primary"
                text={'Add or remove practitioners'}
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
