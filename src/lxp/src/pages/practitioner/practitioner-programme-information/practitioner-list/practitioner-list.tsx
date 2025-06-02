import { PractitionerDto, useTheme } from '@ecdlink/core';
import {
  BannerWrapper,
  Typography,
  Button,
  ActionListDataItem,
  StackedList,
  Dialog,
  DialogPosition,
} from '@ecdlink/ui';
import { PractitionerColleagues } from '@ecdlink/graphql';
import { useOnlineStatus } from '@hooks/useOnlineStatus';
import { useHistory, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useState, useEffect } from 'react';
import {
  PractitionerListProps,
  PractitionerListRouteState,
} from './practitioner-list.types';
import { practitionerSelectors } from '@/store/practitioner';
import { EditPractitioner } from './edit-practitioner/edit-practitioner';
import { userSelectors } from '@store/user';
import { PractitionerService } from '@/services/PractitionerService';
import { authSelectors } from '@/store/auth';
import { OtherPractitionerProfile } from './other-practitioner-view/other-practitioner';
import ROUTES from '@routes/routes';
import { EditPractitionerModal } from './components/edit-practitioner-modal';
import TransparentLayer from '../../../../assets/TransparentLayer.png';

export const PractitionerList: React.FC<PractitionerListProps> = () => {
  const location = useLocation<PractitionerListRouteState>();

  const history = useHistory();
  const { theme } = useTheme();
  const user = useSelector(userSelectors.getUser);
  const userAuth = useSelector(authSelectors.getAuthUser);
  const { isOnline } = useOnlineStatus();
  const [practitionerInfo, setPractitionerInfo] = useState(false);
  const practitioner = useSelector(practitionerSelectors.getPractitioner);
  const practitioners = useSelector(practitionerSelectors.getPractitioners);
  const isPrincipal = practitioner?.isPrincipal === true;
  const practitionerId = practitioner?.user?.id;
  const [editPractitionerVisible, setEditiPractitionerVisible] =
    useState(false);
  const [otherColleagues, setOtherColleagues] = useState<any[]>([]); // FIX THIS
  const [otherColleaguesFiltered, setOtherColleaguesFiltered] = useState<any>( // FIX THIS
    []
  );
  const [colleagueProfile, setColleagueProfile] = useState({});
  const [practitionerEditModal, setEditPractitionerModal] = useState(false);
  const [selectedPractitioner, setSelectedPractitioner] =
    useState<PractitionerDto>();
  const [isLoading, setIsLoading] = useState(false);

  const getPractitionerColleagues = async () => {
    // Check if the practitioner exists
    let practitionerColleagues: PractitionerColleagues[] = [];

    if (userAuth) {
      setIsLoading(true);
      practitionerColleagues = await new PractitionerService(
        userAuth?.auth_token
      ).practitionerColleagues(user?.id!);
      setIsLoading(false);
    }

    setOtherColleagues(practitionerColleagues);

    if (location.state?.isToShowPrincipal) {
      const principal = practitionerColleagues.find((item) =>
        item?.title?.toLocaleLowerCase().includes('principal')
      );
      setPractitionerInfo(true);
      setColleagueProfile({
        name: principal?.name,
        classroomNames: principal?.classroomNames,
        contactNumber: principal?.contactNumber,
        profilePhoto: principal?.profilePhoto,
        title: 'Principal',
        nickName: principal?.nickName,
      });
    }

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
        (item) => !item?.name?.includes(user?.firstName)
      );

      const firstNameFilteredColleagues = filteredColleagues.map((item) => ({
        name: item?.name?.split(' ')[0] || item?.nickName,
        title: item?.title === 'Practitioner' ? 'Practitioner' : 'Principal',
        classroomNames: item?.classroomNames,
        contactNumber: item?.contactNumber,
        profilePhoto: item?.profilePhoto,
        nickName: item?.nickName,
      }));
      setOtherColleaguesFiltered(firstNameFilteredColleagues);
    }
  }, [otherColleagues, user?.firstName]);

  const handleEditPractitioner = (id?: string) => {
    const selectedPract = practitioners?.find((item) => item?.id === id);
    setSelectedPractitioner(selectedPract || practitioner);
    setEditPractitionerModal(true);
  };

  const stackedListItems: ActionListDataItem[] = practitioner?.isPrincipal
    ? [practitioner, ...(practitioners || [])].map((item) => {
        return {
          title: item?.user?.firstName || item?.user?.userName || '',
          subTitle: item?.isPrincipal ? 'Principal' : 'Practitioner',
          switchTextStyles: false,
          actionName: !!practitioners && practitioners.length ? 'Edit' : '',
          buttonColor: 'quatenary',
          textColor: 'white',
          actionIcon: 'PencilIcon',
          buttonType:
            !!practitioners && practitioners.length ? 'filled' : 'ghost',
          onActionClick: () => {
            handleEditPractitioner(item?.id);
          },
        };
      })
    : otherColleaguesFiltered?.map((item: any) => {
        return {
          title: item?.name,
          subTitle: item?.title,
          switchTextStyles: false,
          actionName: 'View',
          actionIcon: 'PencilIcon',
          onActionClick: () => {
            setPractitionerInfo(true);
            setColleagueProfile({
              name: item?.name,
              classroomNames: item?.classroomNames,
              contactNumber: item?.contactNumber,
              profilePhoto: item?.profilePhoto,
              title:
                item?.title === 'Practitioner' ? 'Practitioner' : 'Principal',
              nickName: item?.nickName,
            });
          },
        };
      });

  return (
    <>
      <BannerWrapper
        // showBackground={true}
        isLoading={isLoading}
        showBackground={true}
        backgroundUrl={TransparentLayer}
        backgroundImageColour={'primary'}
        title={isPrincipal ? `Edit Practitioners` : `View Practitioners`}
        color={'primary'}
        size="normal"
        renderBorder={true}
        renderOverflow={false}
        onBack={() =>
          location?.state?.returnRoute
            ? history.push(location.state.returnRoute)
            : history.goBack()
        }
        displayOffline={!isOnline}
      />
      <div className="h-screen overflow-y-scroll p-4">
        {!isLoading && (
          <Typography
            type={'h2'}
            text={isPrincipal ? 'Edit Practitioners' : 'View Practitioners'}
            color={'textDark'}
          />
        )}
        {stackedListItems && (
          <div>
            <StackedList
              className="pr-4"
              listItems={stackedListItems}
              type={'ActionList'}
            ></StackedList>
          </div>
        )}
        {isPrincipal && (
          <div className="mb-24">
            <div>
              <Button
                size="small"
                type="filled"
                color="quatenary"
                text="Add practitioner"
                textColor="white"
                icon="PlusIcon"
                className="my-8"
                onClick={() => history.push(ROUTES.PRINCIPAL.ADD_PRACTITIONER)}
              />
            </div>
          </div>
        )}
      </div>
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
          setPractitionerInfo={(value: boolean) =>
            location.state.isToShowPrincipal && location.state?.returnRoute
              ? history.push(location.state.returnRoute)
              : setPractitionerInfo(value)
          }
          colleagueProfile={colleagueProfile}
        />
      </Dialog>
      <Dialog
        className={'mb-16 px-4'}
        stretch={true}
        visible={practitionerEditModal}
        position={DialogPosition.Middle}
      >
        <EditPractitionerModal
          setEditPractitionerModal={setEditPractitionerModal}
          practitioner={selectedPractitioner}
        />
      </Dialog>
    </>
  );
};
