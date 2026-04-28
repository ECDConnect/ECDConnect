import { PractitionerDto } from '@ecdlink/core';
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
import { useState, useEffect, useRef } from 'react';
import {
  PractitionerListProps,
  PractitionerListRouteState,
} from './practitioner-list.types';
import {
  practitionerSelectors,
  practitionerThunkActions,
} from '@/store/practitioner';
import { userSelectors } from '@store/user';
import { authSelectors } from '@/store/auth';
import { OtherPractitionerProfile } from './other-practitioner-view/other-practitioner';
import ROUTES from '@routes/routes';
import { EditPractitionerModal } from './components/edit-practitioner-modal';
import TransparentLayer from '../../../../assets/TransparentLayer.png';
import { InviteDto } from '@ecdlink/core/src/models/dto/Invite/invite.dto';
import { InvitedPractitioner } from './invited-practitioner/invited-practitioner';
import { formatPhonenumberLocal } from '@utils/common/contact-details.utils';
import { useTenant } from '@/hooks/useTenant';
import { invitesThunkActions } from '@/store/invites';
import { useAppDispatch } from '@/store/config/config';

export const PractitionerList: React.FC<PractitionerListProps> = () => {
  const location = useLocation<PractitionerListRouteState>();

  const history = useHistory();
  const user = useSelector(userSelectors.getUser);
  const userAuth = useSelector(authSelectors.getAuthUser);
  const { isOnline } = useOnlineStatus();
  const [practitionerInfo, setPractitionerInfo] = useState(false);
  const practitioner = useSelector(practitionerSelectors.getPractitioner);
  const practitioners = useSelector(practitionerSelectors.getPractitioners);
  const isPrincipal = practitioner?.isPrincipal === true;
  const practitionerId = practitioner?.user?.id;
  const [otherColleagues, setOtherColleagues] = useState<any[]>([]); // FIX THIS
  const [otherColleaguesFiltered, setOtherColleaguesFiltered] = useState<any>( // FIX THIS
    []
  );
  const [colleagueProfile, setColleagueProfile] = useState({});
  const [practitionerEditModal, setEditPractitionerModal] = useState(false);
  const [practitionerInviteModal, setPractitionerInviteModal] = useState(false);
  const [selectedPractitioner, setSelectedPractitioner] =
    useState<PractitionerDto>();
  const [invites, setInvites] = useState<InviteDto[]>([]);
  const [selectedInvite, setSelectedInvite] = useState<InviteDto>();
  const [isLoading, setIsLoading] = useState(false);
  const tenant = useTenant();
  const appDispatch = useAppDispatch();
  const isOpenAccess = tenant?.isOpenAccess;
  const isMounted = useRef(true);

  const getPractitionerColleagues = async () => {
    // Check if the practitioner exists
    let practitionerColleagues: PractitionerColleagues[] = [];
    let practitionerInvites: PractitionerColleagues[] = [];

    if (userAuth) {
      setIsLoading(true);
      practitionerColleagues = await appDispatch(
        practitionerThunkActions.getPractitionerColleagues({
          userId: user?.id!,
        })
      ).unwrap();
      if (isOpenAccess) {
        const invites = await appDispatch(
          invitesThunkActions.getInvitesByPrincipalId({})
        ).unwrap();

        setInvites(invites || []);
      }
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
        contactNumber: formatPhonenumberLocal(principal?.contactNumber!!),
        profilePhoto: principal?.profilePhoto,
        title: 'Principal',
        nickName: principal?.nickName,
      });
    }

    return [...practitionerColleagues, ...practitionerInvites];
  };

  useEffect(() => {
    isMounted.current = true;

    getPractitionerColleagues();

    return () => {
      isMounted.current = false;
    };
  }, []);

  useEffect(() => {
    if (otherColleagues && user?.firstName) {
      const filteredColleagues = otherColleagues?.filter(
        (item) => !item?.name?.includes(user?.firstName)
      );

      const firstNameFilteredColleagues = filteredColleagues.map((item) => ({
        name:
          item?.name?.split(' ')[0] || item?.nickName || item?.contactNumber,
        title: item?.title === 'Practitioner' ? 'Practitioner' : 'Principal',
        classroomNames: item?.classroomNames,
        contactNumber: formatPhonenumberLocal(item?.contactNumber!!),
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

  const handleInvitedPractitioner = (id?: string) => {
    const selectedInvite = invites?.find((item) => item?.id === id);
    setSelectedInvite(selectedInvite);
    setPractitionerInviteModal(true);
  };

  const stackedListItems: ActionListDataItem[] = practitioner?.isPrincipal
    ? (() => {
        const existingUserIds = new Set(
          [practitioner, ...(practitioners || [])]
            .map((p) => p?.userId)
            .filter(Boolean)
        );

        const uniqueInvites = (invites || []).filter(
          (invite) => !existingUserIds.has(invite.practitionerId)
        );

        const rawItems = [
          practitioner,
          ...(practitioners || []),
          ...uniqueInvites.map((invite) => ({
            id: null,
            user: {
              id: invite.id,
              firstName: formatPhonenumberLocal(invite.user?.phoneNumber ?? ''),
              userName: formatPhonenumberLocal(invite.user?.phoneNumber ?? ''),
            },
            dateLinked: null,
            isPrincipal: false,
          })),
        ];

        return rawItems.map((item) => ({
          title: item?.user?.firstName || item?.user?.userName || '',
          subTitle: item?.isPrincipal
            ? 'Principal'
            : item.dateLinked === null
            ? 'Practitioner - invited'
            : 'Practitioner',
          switchTextStyles: false,
          actionName: 'Edit',
          buttonColor: 'quatenary',
          textColor: 'white',
          actionIcon: item.isPrincipal ? 'PencilIcon' : 'EyeIcon',
          buttonType: practitioners?.length ? 'filled' : 'ghost',
          onActionClick: () => {
            if (item.dateLinked === null && item.id === null) {
              handleInvitedPractitioner(item.user?.id);
            } else {
              handleEditPractitioner(item.id);
            }
          },
        }));
      })()
    : otherColleaguesFiltered?.map((item: any) => ({
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
      })) ?? [];

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
        visible={practitionerInviteModal}
        position={DialogPosition.Top}
      >
        <InvitedPractitioner
          setPractitionerInviteModal={setPractitionerInviteModal}
          userId={selectedInvite?.user.id || ''}
          phoneNumber={selectedInvite?.user.phoneNumber || ''}
          dateInvited={selectedInvite?.insertedDate}
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
