import { useTheme } from '@ecdlink/core';
import {
  BannerWrapper,
  Divider,
  Typography,
  Button,
  ActionListDataItem,
  StackedList,
} from '@ecdlink/ui';
import { PractitionerColleagues } from '@ecdlink/graphql';
import { useOnlineStatus } from '@hooks/useOnlineStatus';
import { useHistory } from 'react-router-dom';
// import ROUTES from '@routes/routes';
import * as styles from './practitioner-list.styles';
import { classroomsSelectors } from '@store/classroom';
import { useSelector } from 'react-redux';
import { useState, useEffect } from 'react';
import { PractitionerListProps } from './practitioner-list.types';
import { renderIcon } from '@ecdlink/ui';
import { practitionerSelectors } from '@/store/practitioner';
import { EditPractitioner } from './edit-practitioner/edit-practitioner';
import { userSelectors } from '@store/user';
import { PractitionerService } from '@/services/PractitionerService';
import { authSelectors } from '@/store/auth';
// import { PractitionerInfo } from './practitioner-info/practitioner-info';

const mockedPractitioners = [
  {
    name: 'Joao da Silva',
    id: 1,
    role: 'Principal/Owner',
  },
  {
    name: 'Robson Barros',
    id: 2,
    role: 'Practitioner',
  },
  {
    name: 'Carlos Heitor',
    id: 3,
    role: 'Practitioner',
  },
];

export const PractitionerList: React.FC<PractitionerListProps> = ({
  setPractitionerList,
}) => {
  const history = useHistory();
  const { theme } = useTheme();
  const user = useSelector(userSelectors.getUser);
  const userAuth = useSelector(authSelectors.getAuthUser);
  const { isOnline } = useOnlineStatus();
  const classroom = useSelector(classroomsSelectors.getClassroom);
  const classroomName = classroom?.name;
  const classroomGroups = useSelector(classroomsSelectors.getClassroomGroups);
  const [practitionerInfo, setPractitionerInfo] = useState(false);
  const [practitionerId, setPractitionerId] = useState(0);
  const practitioner = useSelector(practitionerSelectors.getPractitioner);
  const practitioners = useSelector(practitionerSelectors.getPractitioners);
  const isPrincipal = practitioner?.isPrincipal === true;
  const practitionersList = practitioners?.filter(
    (item) => item.userId !== practitioner?.userId
  );
  const [editPractitionerVisible, setEditiPractitionerVisible] =
    useState(false);
  const [otherColleagues, setOtherColleagues] = useState<any[]>([]);
  const [otherColleaguesFiltered, setOtherColleaguesFiltered] = useState<any>(
    []
  );

  const getPractitionerColleagues = async () => {
    // Check if the practitioner exists
    let practitionerColleagues: PractitionerColleagues[] = [];

    if (userAuth) {
      practitionerColleagues = await new PractitionerService(
        userAuth?.auth_token
      ).practitionerColleagues(user?.id!);
    }

    setOtherColleagues(practitionerColleagues);
    return practitionerColleagues;
  };

  useEffect(() => {
    getPractitionerColleagues();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (otherColleagues && user?.firstName) {
      const filteredColleagues = otherColleagues?.filter(
        (item) => !item?.name.includes(user?.firstName)
      );
      const firstNameFilteredColleagues = filteredColleagues.map((item) => ({
        name: item?.name.split(' ')[0],
        title: item?.title,
      }));
      setOtherColleaguesFiltered(firstNameFilteredColleagues);
    }
  }, [otherColleagues, user?.firstName]);

  const stackedListItems: ActionListDataItem[] =
    practitionersList && practitionersList?.length! > 0
      ? practitionersList?.map((item) => {
          return {
            title: item?.user?.fullName ? item?.user?.fullName : '',
            subTitle: item?.isPrincipal
              ? 'Principal / owner'
              : item?.user?.roles
              ? item?.user?.roles[0]?.name
              : '',
            switchTextStyles: true,
            actionName: 'Edit',
            actionIcon: 'PencilIcon',
            onActionClick: () => setEditiPractitionerVisible(true),
          };
        })
      : otherColleaguesFiltered?.map((item: any) => {
          return {
            title: item?.name,
            subTitle: item?.title,
            switchTextStyles: true,
            // actionName: 'Edit',
            // actionIcon: 'PencilIcon',
            // onActionClick: () => setEditiPractitionerVisible(true),
          };
        });

  return (
    <div>
      {editPractitionerVisible ? (
        <EditPractitioner
          setEditiPractitionerVisible={setEditiPractitionerVisible}
        />
      ) : practitionerInfo ? null : (
        // <PractitionerInfo
        //   practitionerId={practitionerId}
        //   setPractitionerInfo={setPractitionerInfo}
        // />
        <>
          <div className={styles.container}>
            <BannerWrapper
              showBackground={true}
              backgroundUrl={theme?.images.graphicOverlayUrl}
              backgroundImageColour={'primary'}
              title={`Edit Practitioners`}
              color={'primary'}
              size="medium"
              renderBorder={true}
              renderOverflow={false}
              onBack={history.goBack}
              displayOffline={!isOnline}
            ></BannerWrapper>
          </div>
          <div className="ml-4 mt-4">
            <Typography
              type={'h2'}
              text={isPrincipal ? 'Edit Practitioners' : 'View Practitioners'}
              color={'textDark'}
            />
            {stackedListItems && (
              <StackedList
                className="pr-4"
                listItems={stackedListItems}
                type={'ActionList'}
              ></StackedList>
            )}
          </div>
          <div className="absolute bottom-0 left-0 right-0 p-4 max-h-20">
            <div className="flex justify-center">
              <Button
                type="filled"
                color="primary"
                className={'w-full'}
                onClick={() => {}}
                disabled={true}
              >
                {renderIcon('SaveIcon', styles.buttonIcon)}
                <Typography
                  type="h6"
                  className="mr-2 rounded-2xl"
                  color="white"
                  text={'Save'}
                ></Typography>
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
