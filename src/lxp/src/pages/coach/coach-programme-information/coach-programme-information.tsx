import { useHistory, useLocation } from 'react-router';
import { useTheme, useDialog } from '@ecdlink/core';
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
import { getLogo, LogoSvgs } from '@utils/common/svg.utils';
import { formatPhonenumberInternational } from '@utils/common/contact-details.utils';
import { PractitionerProfileRouteState } from './coach-programme-information.types';
import { useOnlineStatus } from '@hooks/useOnlineStatus';
import * as styles from './coach-programme-information.styles';
import ROUTES from '@routes/routes';
import { PhoneIcon } from '@heroicons/react/solid';
import { useSelector } from 'react-redux';
import { practitionerSelectors } from '@/store/practitioner';
import { useEffect, useState } from 'react';
import { PractitionerService } from '@/services/PractitionerService';
import { authSelectors } from '@store/auth';
import { getClassroomGroupSchoolDays } from '@/utils/classroom/attendance/track-attendance-utils';
import { userSelectors } from '@store/user';
import { classroomsForCoachSelectors } from '@/store/classroomForCoach';
import { classroomsSelectors } from '@/store/classroom';
import OnlineOnlyModal from '../../../modals/offline-sync/online-only-modal';

export const CoachProgrammeInformation: React.FC = () => {
  const history = useHistory();
  const { isOnline } = useOnlineStatus();
  const dialog = useDialog();
  const userData = useSelector(userSelectors.getUser);
  const isCoach = userData?.roles?.some((role) => role.name === 'Coach');
  const location = useLocation<PractitionerProfileRouteState>();
  const practitionerId = location.state.practitionerId;
  const practitioners = useSelector(practitionerSelectors.getPractitioners);
  const isFromProgrammeView = true;
  const [practitionerClassroomDetails, setPractitionerClassroomDetails] =
    useState<any>();
  const userAuth = useSelector(authSelectors.getAuthUser);
  const coachClassrooms = useSelector(
    classroomsForCoachSelectors.getClassroomForCoach
  );
  const practitionerClassroom = coachClassrooms?.find(
    (item) => item.userId === practitionerId
  );
  const classroomGroups = useSelector(classroomsSelectors.getClassroomGroups);
  const practitionerClassroomGroups = practitionerClassroom
    ? classroomGroups.filter(
        (item) => item.classroomId === practitionerClassroom?.id
      )
    : practitionerClassroomDetails
    ? classroomGroups.filter(
        (item) =>
          item.classroomId === practitionerClassroomDetails?.[0].classroom?.id
      )
    : [];

  const practitionersOnSite = practitioners?.filter((el) => {
    return practitionerClassroomGroups.some((f) => {
      return f.userId === el.userId;
    });
  });

  const weekday = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
  ];

  const practitioner = practitioners?.find(
    (practitioner) => practitioner?.userId === practitionerId
  );
  const isPrincipal = practitioner?.isPrincipal === true;

  const practitionersForCoachListItems = practitionersOnSite?.map((item) => {
    const titleStyle = 'text-textMid';
    const [userRole] = item?.user?.roles || [];

    const roleName =
      userRole?.name === 'Practitioner' ? 'SmartStarter' : userRole?.name;

    return {
      title: item.user?.firstName + ' ' + item?.user?.surname,
      titleStyle,
      subTitle: item?.isPrincipal ? 'Principal / owner' : roleName,
      avatarColor: '#6974af',
      alertSeverity: 'none',
      profileText:
        item?.user?.firstName?.substring(0, 1)! +
        item?.user?.surname?.substring(0, 1),
      onActionClick: () => handleClick(item.userId!),
      id: item?.userId,
    };
  });

  const call = () => {
    window.open(`tel:${practitioner?.user?.phoneNumber}`);
  };

  const whatsapp = () => {
    window.open(
      `https://wa.me/${formatPhonenumberInternational(
        practitioner?.user?.phoneNumber ?? ''
      )}`
    );
  };

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

  const classroomsDetailsForPractitioner = async () => {
    const classroomDetails = await new PractitionerService(
      userAuth?.auth_token!
    ).getClassroomGroupClassroomsForPractitioner(practitioner?.userId!);
    setPractitionerClassroomDetails(classroomDetails);
    return classroomDetails;
  };

  useEffect(() => {
    classroomsDetailsForPractitioner();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getPractitionerColleagues = async () => {
    // Check if the practitioner exists
    let practitionerColleagues: PractitionerColleagues[] = [];

    if (userAuth) {
      practitionerColleagues = await new PractitionerService(
        userAuth?.auth_token
      ).practitionerColleagues(practitioner?.userId!);
    }

    return practitionerColleagues;
  };

  useEffect(() => {
    if (practitioner) {
      getPractitionerColleagues();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
        backgroundUrl={theme?.images.graphicOverlayUrl}
        title={'Programme information'}
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
            dataUrl={practitioner?.user?.profileImageUrl || ''}
            size={'header'}
            // eslint-disable-next-line @typescript-eslint/no-empty-function
            onPressed={() => {}}
          />
        </div>

        <div className={styles.chipsWrapper}>
          <StatusChip
            backgroundColour="primary"
            borderColour="primary"
            text={isPrincipal ? 'Principal/Owner' : 'SmartStarter'}
            textColour={'white'}
            className={'mr-2 px-3 py-1.5'}
          />
        </div>
        <div className={styles.contactButtons}>
          <Button
            color={'primary'}
            type={'outlined'}
            className={'rounded-2xl'}
            size={'small'}
            onClick={call}
          >
            <PhoneIcon className="text-primary h-5 w-5" aria-hidden="true" />
          </Button>
          <Button
            color={'primary'}
            type={'outlined'}
            className={'rounded-2xl'}
            size={'small'}
            onClick={whatsapp}
          >
            <img
              src={getLogo(LogoSvgs.whatsapp)}
              alt="whatsapp"
              className={styles.buttonIconStyle}
            />
          </Button>
        </div>
      </BannerWrapper>
      <div className="my-6 flex justify-center">
        <Button
          type="outlined"
          color="primary"
          className={'w-11/12'}
          onClick={() => {}}
        >
          {renderIcon('EyeIcon', styles.buttonIcon)}
          <Typography
            type="help"
            className="mx-2"
            color="primary"
            text={'View SmartSpace Licence '}
          ></Typography>
        </Button>
      </div>
      <>
        {practitionerClassroomDetails?.length > 0 && (
          <>
            <div className={styles.infoWrapper}>
              <div>
                <Typography
                  text={'Programme name'}
                  type="h5"
                  color="textMid"
                  className={'mt-4'}
                />
                <Typography
                  text={practitionerClassroomDetails[0].classroom?.name || ''}
                  type="h4"
                  color="textDark"
                  className={'mt-1'}
                />
              </div>
            </div>
            <Divider dividerType="dashed" className="my-4" />
          </>
        )}
        <div className={styles.infoWrapper}>
          <div>
            <Typography
              text={'Programme location'}
              type="h5"
              color="textMid"
              className={'mt-1'}
            />
            <Typography
              text={practitionerClassroomDetails?.siteAddress || ''}
              type="h4"
              color="textDark"
              className={'mt-1'}
            />
          </div>
        </div>
        <Divider dividerType="dashed" className="my-4" />
        <div>
          {practitionerClassroomDetails?.map((item: any, index: number) => {
            const meetingDays = getClassroomGroupSchoolDays(
              item?.classProgrammes
            );

            const weekMeetingDays = meetingDays
              .sort()
              .map((item) => weekday[item]);
            const stringMeetingDays = weekMeetingDays.join(', ').toString();
            const halfOrFullDayMeeting =
              item?.classProgrammes.length > 0 &&
              item?.classProgrammes[0].isFullDay === true
                ? 'Full day'
                : 'Half day';

            return (
              <div key={index}>
                <div className={styles.infoWrapper}>
                  <div>
                    <Typography
                      text={'Type of ECD service'}
                      type="h5"
                      color="textMid"
                      className={'mt-1'}
                    />
                    <Typography
                      text={item?.programmeType?.description || ''}
                      type="h4"
                      color="textDark"
                      className={'mt-1'}
                    />
                  </div>
                </div>
                <div className={styles.infoWrapper}>
                  <div className="ml-6">
                    <Typography
                      text={stringMeetingDays + ', ' + halfOrFullDayMeeting}
                      type="h5"
                      color="textMid"
                      className={'mt-1'}
                    />
                    <Typography
                      text={`Class ${index + 1}: ${item?.name}`}
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
          <div className={styles.infoWrapper}>
            <div>
              <Typography
                text={'Number of non-SmartStart assistants'}
                type="h5"
                color="textMid"
                className={'mt-1'}
              />
              <Typography
                text={
                  practitionerClassroomDetails?.length > 0
                    ? String(
                        practitionerClassroomDetails[0].classroom
                          ?.numberOfOtherAssistants
                      )
                    : ''
                }
                type="h4"
                color="textDark"
                className={'mt-1'}
              />
            </div>
          </div>
          <Divider dividerType="dashed" className="my-4" />
          <div className={styles.infoWrapper}>
            <div>
              <Typography
                text={'Other assistants'}
                type="h5"
                color="textMid"
                className={'mt-1'}
              />
              <Typography
                text={
                  practitionerClassroomDetails?.length > 0
                    ? String(
                        practitionerClassroomDetails[0].classroom
                          ?.numberPractitioners
                      )
                    : ''
                }
                type="h4"
                color="textDark"
                className={'mt-1'}
              />
            </div>
          </div>
          <Divider dividerType="dashed" className="my-4" />
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
                text={'SmartStart practitioners on site'}
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
