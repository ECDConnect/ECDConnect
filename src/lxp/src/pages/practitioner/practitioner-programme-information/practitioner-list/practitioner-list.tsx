import { useTheme } from '@ecdlink/core';
import {
  BannerWrapper,
  Typography,
  Button,
  ActionListDataItem,
  StackedList,
  Dialog,
  DialogPosition,
  renderIcon,
} from '@ecdlink/ui';
import {
  PractitionerColleagues,
  PractitionerRemovalHistory,
} from '@ecdlink/graphql';
import { useOnlineStatus } from '@hooks/useOnlineStatus';
import { useHistory } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useState, useEffect } from 'react';
import { PractitionerListProps } from './practitioner-list.types';
import { practitionerSelectors } from '@/store/practitioner';
import { EditPractitioner } from './edit-practitioner/edit-practitioner';
import { userSelectors } from '@store/user';
import { PractitionerService } from '@/services/PractitionerService';
import { authSelectors } from '@/store/auth';
import { OtherPractitionerProfile } from './other-practitioner-view/other-practitioner';
import ROUTES from '@routes/routes';
import EditRemovePractitionerFromProgrammePrompt from '@/pages/classroom/class-dashboard/practitioners/principal-practitioner-profile/components/remove-practitioner-from-programme/edit-remove-practitioner-from-programme-prompt';
import { classroomsSelectors } from '@/store/classroom';

export const PractitionerList: React.FC<PractitionerListProps> = () => {
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
  const classroom = useSelector(classroomsSelectors?.getClassroom);

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
        (item) => !item?.name?.includes(user?.firstName)
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

  const [removingPractitionerId, setRemovingPractitionerId] = useState<
    string | undefined
  >(undefined);
  const [existingRemovals, setExisitingRemovals] = useState<
    PractitionerRemovalHistory[]
  >([]);

  const getRemovalsForPractitioners = async () => {
    if (practitioners) {
      const removalDetails = await new PractitionerService(
        userAuth?.auth_token!
      ).getRemovalsForPractitioners(
        practitioners!.map((x) => x.userId as string)
      );
      setExisitingRemovals(removalDetails || []);
      return removalDetails;
    }
  };

  useEffect(() => {
    getRemovalsForPractitioners();
  }, [practitioners]);

  const cancelPractitionerRemoval = async () => {
    const removalId = existingRemovals?.find(
      (x) => x.userId === removingPractitionerId
    )?.id;
    if (removalId) {
      await new PractitionerService(
        userAuth?.auth_token || ''
      ).cancelRemovePractitionerFromProgramme(removalId);
      setExisitingRemovals(
        existingRemovals.filter((x) => x.userId !== removingPractitionerId)
      );
      setRemovingPractitionerId(undefined);
    }
  };

  const stackedListItems: ActionListDataItem[] =
    practitioner?.isPrincipal || practitioner?.isFundaAppAdmin
      ? [practitioner, ...(practitioners || [])].map((item) => {
          return {
            title: item?.user?.fullName ? item?.user?.fullName : '',
            subTitle: item?.isPrincipal
              ? 'Principal / owner'
              : item?.user?.roles
              ? item?.user?.roles[0]?.name
              : '',
            switchTextStyles: true,
            actionName: !!practitioners && practitioners.length ? 'Remove' : '',
            actionIcon: 'PencilIcon',
            buttonType:
              !!practitioners && practitioners.length ? 'filled' : 'ghost',
            onActionClick: () => {
              const userId = item?.userId || '';
              if (item?.isPrincipal && userId === practitioner?.userId) {
                if (!!practitioners && practitioners.length) {
                  history.push(ROUTES.PRINCIPAL.SWAP_PRINCIPAL);
                }
              } else {
                const existingRemoval = existingRemovals?.find(
                  (x) => x.userId === userId
                );
                if (existingRemoval) {
                  setRemovingPractitionerId(userId);
                } else {
                  history.push(
                    ROUTES.PRINCIPAL.PRACTITIONER_REMOVE_FROM_PROGRAMME,
                    {
                      practitionerId: userId,
                    }
                  );
                }
              }
            },
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
    <>
      <BannerWrapper
        // showBackground={true}
        backgroundUrl={theme?.images.graphicOverlayUrl}
        backgroundImageColour={'primary'}
        title={isPrincipal ? `Edit Practitioners` : `View Practitioners`}
        color={'primary'}
        size="normal"
        renderBorder={true}
        renderOverflow={false}
        onBack={history.goBack}
        displayOffline={!isOnline}
      />
      <div className="h-screen overflow-y-scroll p-4">
        <Typography
          type={'h2'}
          text={isPrincipal ? 'Edit Practitioners' : 'View Practitioners'}
          color={'textDark'}
        />
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
                color="primary"
                text="Add practitioner"
                textColor="white"
                icon="PlusIcon"
                className="mt-8"
                onClick={() => history.push(ROUTES.PRINCIPAL.ADD_PRACTITIONER)}
              />
            </div>
            <div className="mb-8 flex justify-center">
              <Button
                type="outlined"
                color="primary"
                className={'mt-6 mb-6 w-11/12 rounded-2xl'}
                onClick={() =>
                  history.push('/principal/practitioner-reassign-class')
                }
              >
                {renderIcon(
                  'PencilAltIcon',
                  'w-5 h-5 color-primary text-primary mr-1'
                )}
                <Typography
                  type="body"
                  className="mr-4"
                  color="primary"
                  text={'Record absence/leave'}
                ></Typography>
              </Button>
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
          setPractitionerInfo={setPractitionerInfo}
          colleagueProfile={colleagueProfile}
        />
      </Dialog>
      <Dialog
        className={'mb-16 px-4'}
        stretch={true}
        visible={!!removingPractitionerId}
        position={DialogPosition.Bottom}
      >
        <EditRemovePractitionerFromProgrammePrompt
          practitioner={practitioner}
          classroomName={classroom?.name || ''}
          removalDetails={
            existingRemovals?.find(
              (x) => x.userId === removingPractitionerId
            ) as PractitionerRemovalHistory
          }
          onEdit={() => {
            history.push(ROUTES.PRINCIPAL.PRACTITIONER_REMOVE_FROM_PROGRAMME, {
              practitionerId: removingPractitionerId,
            });
          }}
          onCancel={() => {
            cancelPractitionerRemoval();
          }}
          onClose={() => {
            setRemovingPractitionerId(undefined);
          }}
        />
      </Dialog>
    </>
  );
};
