import { useHistory, useLocation } from 'react-router';
import { useTheme, useDialog, RoleSystemNameEnum } from '@ecdlink/core';
import {
  BannerWrapper,
  Button,
  Divider,
  ProfileAvatar,
  renderIcon,
  StatusChip,
  Typography,
  StackedList,
  DialogPosition,
} from '@ecdlink/ui';
import { PractitionerColleagues } from '@ecdlink/graphql';
import { PractitionerProfileRouteState } from './coach-programme-information.types';
import { useOnlineStatus } from '@hooks/useOnlineStatus';
import * as styles from './coach-programme-information.styles';
import ROUTES from '@routes/routes';
import { useSelector } from 'react-redux';
import { practitionerSelectors } from '@/store/practitioner';
import { useEffect, useMemo, useState } from 'react';
import { authSelectors } from '@store/auth';
import { userSelectors } from '@store/user';
import { classroomsForCoachSelectors } from '@/store/classroomForCoach';
import OnlineOnlyModal from '../../../modals/offline-sync/online-only-modal';
import { PractitionerService } from '@/services/PractitionerService';
import TransparentLayer from '../../../assets/TransparentLayer.png';

export const CoachProgrammeInformation: React.FC = () => {
  const history = useHistory();
  const { isOnline } = useOnlineStatus();
  const dialog = useDialog();
  const userData = useSelector(userSelectors.getUser);
  const isCoach = userData?.roles?.some(
    (role) => role.systemName === RoleSystemNameEnum.Coach
  );

  const [otherColleagues, setOtherColleagues] = useState<any[]>([]);
  const [otherColleaguesFiltered, setOtherColleaguesFiltered] = useState<any>(
    []
  );

  const location = useLocation<PractitionerProfileRouteState>();
  const practitionerId = location.state.practitionerId;
  const practitioners = useSelector(practitionerSelectors.getPractitioners);
  const isFromProgrammeView = true;
  const userAuth = useSelector(authSelectors.getAuthUser);

  const practitioner = useSelector(
    practitionerSelectors.getPractitionerByUserId(practitionerId)
  );

  const isPrincipal = practitioner?.isPrincipal === true;

  const coachClassrooms = useSelector(
    classroomsForCoachSelectors.getClassroomForCoach
  );
  const coachClassroomGroups = useSelector(
    classroomsForCoachSelectors.getClassroomGroups
  );

  const practitionerClassroomGroups =
    coachClassroomGroups?.filter((item) => item.userId === practitionerId) ||
    [];

  const practitionerClassroom = isPrincipal
    ? coachClassrooms?.find((item) => item?.userId === practitionerId)
    : coachClassrooms?.find(
        (item) =>
          item?.id === practitionerClassroomGroups?.[0]?.classroomId || ''
      );

  const classroomGroups =
    coachClassroomGroups?.filter(
      (item) => item.classroomId === practitionerClassroom?.id
    ) || [];
  const siteName = practitionerClassroom?.name;

  const { addressLine1, addressLine2, addressLine3, postalCode } =
    practitionerClassroom?.siteAddress || {};

  const siteAddress = useMemo(
    () =>
      `${(addressLine1 && addressLine1 + ', ') || ''}${
        (addressLine2 && addressLine2 + ', ') || ''
      }${(addressLine3 && addressLine3 + ', ') || ''}${
        (postalCode && postalCode) || ''
      }`,
    [addressLine1, addressLine2, addressLine3, postalCode]
  );

  const practitionersOnSite = practitioners?.filter((el) => {
    return (
      otherColleagues?.some((f) => {
        return f.userId === el.userId;
      }) ||
      classroomGroups?.some((cg) => {
        return cg.userId === el.userId;
      })
    );
  });

  const classroomListItems = useMemo(() => {
    return classroomGroups?.map((item) => {
      const practitioner = practitionersOnSite?.find(
        (pract) => pract.userId == item.userId
      );
      return {
        name: item.name,
        practitioner:
          practitioner?.user?.firstName! + ' ' + practitioner?.user?.surname,
        id: item?.userId,
      };
    });
  }, [practitioner?.user?.firstName]);

  const practitionersForCoachListItems = practitionersOnSite?.map((item) => {
    const titleStyle = 'text-textMid';

    return {
      title: item.user?.firstName + ' ' + item?.user?.surname,
      titleStyle,
      subTitle: item?.isPrincipal ? 'Principal' : 'Practitioner',
      avatarColor: '#6974af',
      alertSeverity: 'none',
      profileText:
        item?.user?.firstName?.substring(0, 1)! +
        item?.user?.surname?.substring(0, 1),
      onActionClick: () => handleClick(item.userId!),
      id: item?.userId,
    };
  });

  const handleClick = (practitionerId: string) => {
    if (isCoach) {
      history.push('practitioner-profile-info', {
        practitionerId,
        isFromProgrammeView,
      });
    } else {
      history.push('practitioner-info-dashboard', {
        practitionerId,
      });
    }
  };

  const { theme } = useTheme();

  const getPractitionerColleagues = async () => {
    // Check if the practitioner exists
    let practitionerColleagues: PractitionerColleagues[] = [];

    if (userAuth) {
      practitionerColleagues = await new PractitionerService(
        userAuth?.auth_token
      ).practitionerColleagues(practitioner?.userId!);
    }

    setOtherColleagues(practitionerColleagues);
    return practitionerColleagues;
  };

  useEffect(() => {
    if (practitioner) {
      getPractitionerColleagues();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (otherColleagues && practitioner?.user?.firstName) {
      const filteredColleagues = otherColleagues?.filter(
        (item) =>
          !item?.name?.includes(practitioner?.user?.firstName) ||
          item?.username?.includes(practitioner?.user?.userName)
      );
      const firstNameFilteredColleagues = filteredColleagues.map((item) => ({
        name: item?.name?.split(' ')[0] || item?.username,
        title: item?.title,
        nickName: item?.nickName,
      }));
      setOtherColleaguesFiltered(firstNameFilteredColleagues);
    }
  }, [
    otherColleagues,
    practitioner?.user?.firstName,
    practitioner?.user?.userName,
  ]);

  useEffect(() => {
    if (!isOnline) {
      showOnlineOnly();
      history.push(ROUTES.COACH.PRACTITIONER_PROFILE_INFO, {
        practitionerId,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const showOnlineOnly = () => {
    dialog({
      position: DialogPosition.Middle,
      render: (onSubmit) => {
        return <OnlineOnlyModal onSubmit={onSubmit}></OnlineOnlyModal>;
      },
    });
  };

  return (
    <div className={styles.contentWrapper}>
      <BannerWrapper
        showBackground={true}
        backgroundUrl={TransparentLayer}
        title={'Preschool'}
        subTitle={`${practitioner?.user?.firstName} ${practitioner?.user?.surname}`}
        color={'primary'}
        size="medium"
        renderBorder={true}
        renderOverflow={false}
        onBack={() =>
          history.push(ROUTES.COACH.PRACTITIONER_PROFILE_INFO, {
            practitionerId,
          })
        }
        displayOffline={!isOnline}
      >
        <div className={styles.avatarWrapper}>
          <ProfileAvatar
            hasConsent={true}
            canChangeImage={false}
            dataUrl={practitionerClassroom?.classroomImageUrl || ''}
            size={'header'}
            // eslint-disable-next-line @typescript-eslint/no-empty-function
            onPressed={() => {}}
            isPreschoolImage={true}
          />
        </div>

        <div className={styles.chipsWrapper}>
          <StatusChip
            backgroundColour="primary"
            borderColour="primary"
            text={isPrincipal ? 'Principal' : 'Practitioner'}
            textColour={'white'}
            className={'mr-2 px-3 py-1.5'}
          />
        </div>
      </BannerWrapper>
      <>
        <>
          <div className={styles.infoWrapper}>
            <div>
              <Typography
                text={'Preschool name'}
                type="h5"
                color="textMid"
                className={'mt-4'}
              />
              <Typography
                text={siteName}
                type="h4"
                color="textDark"
                className={'mt-1'}
              />
            </div>
          </div>
          <Divider dividerType="dashed" className="my-4" />
        </>
        <div className={styles.infoWrapper}>
          <div>
            <Typography
              text={'Preschool location'}
              type="h5"
              color="textMid"
              className={'mt-1'}
            />
            {siteAddress && siteAddress.length && (
              <>
                <Typography
                  text={siteAddress}
                  type="h4"
                  color="textDark"
                  className={'mt-1'}
                />

                <Button
                  size="small"
                  shape="normal"
                  color="secondaryAccent2"
                  type="filled"
                  onClick={() => {
                    navigator?.clipboard?.writeText &&
                      navigator?.clipboard?.writeText(siteAddress);
                  }}
                >
                  <Typography
                    className={'mr-1'}
                    type="buttonSmall"
                    color="secondary"
                    text="Copy"
                  />
                  {renderIcon(
                    'DocumentDuplicateIcon',
                    'h-4 w-4 text-secondary'
                  )}
                </Button>
              </>
            )}
          </div>
        </div>
        <Divider dividerType="dashed" className="my-4" />
        <div>
          {classroomListItems?.map((item: any, index: number) => {
            return (
              <div key={index}>
                <div className={styles.infoWrapper}>
                  <div>
                    <Typography
                      text={`Class ${index + 1}: ${item?.name}`}
                      type="h5"
                      color="textMid"
                      className={'mt-1'}
                    />
                    <Typography
                      text={`${item?.practitioner}`}
                      type="h4"
                      color="textDark"
                      className={'mt-1'}
                    />
                  </div>
                </div>
                <Divider dividerType="dashed" className="my-4" />
              </div>
            );
          })}
          <div>
            <div className="my-4 ml-4 flex">
              <div className="bg-successMain mr-4 grid h-8 w-8 place-items-center rounded-full">
                <Typography
                  type={'body'}
                  weight={'bold'}
                  text={String(practitionersForCoachListItems?.length!)}
                  color={'white'}
                />
              </div>
              <Typography
                text={`Practitioners at ${siteName || 'this site'}`}
                type="h4"
                color="textDark"
                className={'mt-1'}
              />
            </div>
          </div>
          {practitionersForCoachListItems ? (
            <div className="flex justify-center">
              <div className="flex w-11/12 justify-center">
                <StackedList
                  className={styles.stackedList}
                  listItems={practitionersForCoachListItems}
                  type={'UserAlertList'}
                ></StackedList>
              </div>
            </div>
          ) : null}
        </div>
      </>
    </div>
  );
};
