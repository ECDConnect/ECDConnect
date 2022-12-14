import { useTheme } from '@ecdlink/core';
import {
  BannerWrapper,
  Divider,
  Typography,
  Button,
  ActionListDataItem,
  StackedList,
  Dialog,
  DialogPosition,
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
import { OtherPractitionerProfile } from './other-practitioner-view/other-practitioner';
import ROUTES from '@routes/routes';

export const PractitionerList: React.FC<PractitionerListProps> = ({
  setPractitionerList,
}) => {
  const history = useHistory();
  const { theme } = useTheme();
  const user = useSelector(userSelectors.getUser);
  const userAuth = useSelector(authSelectors.getAuthUser);
  const { isOnline } = useOnlineStatus();
  // const classroom = useSelector(classroomsSelectors.getClassroom);
  // const classroomGroups = useSelector(classroomsSelectors.getClassroomGroups);
  const [practitionerInfo, setPractitionerInfo] = useState(false);
  const practitioner = useSelector(practitionerSelectors.getPractitioner);
  const practitioners = useSelector(practitionerSelectors.getPractitioners);
  const isPrincipal = practitioner?.isPrincipal === true;
  const practitionersList = practitioners?.filter(
    (item) => item.userId !== practitioner?.userId
  );
  const practitionerId = practitioner?.user?.id;
  const [editPractitionerVisible, setEditiPractitionerVisible] =
    useState(false);
  const [otherColleagues, setOtherColleagues] = useState<any[]>([]);
  const [otherColleaguesFiltered, setOtherColleaguesFiltered] = useState<any>(
    []
  );
  const [colleagueProfile, setColleagueProfile] = useState({});

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
    if (practitioner?.isPrincipal !== true) {
      getPractitionerColleagues();
    }
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
        classroomNames: item?.classroomNames,
        contactNumber: item?.contactNumber,
        profilePhoto: item?.profilePhoto,
        nickName: item?.nickName,
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
            actionName: 'Remove',
            actionIcon: 'PencilIcon',
            onActionClick: () => {}, // Disabled the editPractitioner view state
          };
        })
      : otherColleaguesFiltered?.map((item: any) => {
          return {
            title: item?.name,
            subTitle: item?.title,
            switchTextStyles: true,
            actionName: 'View',
            actionIcon: 'PencilIcon',
            onActionClick: () => {
              setPractitionerInfo(true);
              setColleagueProfile({
                name: item?.name,
                classroomNames: item?.classroomNames,
                contactNumber: item?.contactNumber,
                profilePhoto: item?.profilePhoto,
                title: item?.title,
                nickName: item?.nickName,
              });
            },
          };
        });

  return (
    <div>
      <>
        <Dialog
          fullScreen
          visible={editPractitionerVisible}
          position={DialogPosition.Top}
        >
          <EditPractitioner
            setEditiPractitionerVisible={setEditiPractitionerVisible}
          />
        </Dialog>
        <Dialog
          fullScreen
          visible={practitionerInfo}
          position={DialogPosition.Top}
        >
          <OtherPractitionerProfile
            practitionerId={practitionerId!}
            setPractitionerInfo={setPractitionerInfo}
            colleagueProfile={colleagueProfile}
          />
        </Dialog>
        <>
          <div className={styles.container}>
            <BannerWrapper
              showBackground={true}
              backgroundUrl={theme?.images.graphicOverlayUrl}
              backgroundImageColour={'primary'}
              title={isPrincipal ? `Edit Practitioners` : `View Practitioners`}
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
            {isPrincipal && (
              <div>
                <Button
                  size="small"
                  type="filled"
                  color="primary"
                  text="Add practitioner"
                  textColor="white"
                  icon="PlusIcon"
                  className="mt-8"
                  onClick={() =>
                    history.push(ROUTES.PRINCIPAL.ADD_PRACTITIONER)
                  }
                />
              </div>
            )}
          </div>
          <div className="absolute bottom-0 left-0 right-0 max-h-20 p-4">
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
      </>
    </div>
  );
};
