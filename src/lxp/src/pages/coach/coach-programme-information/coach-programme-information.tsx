import { useHistory, useLocation } from 'react-router';
import { useTheme } from '@ecdlink/core';
import {
  BannerWrapper,
  Button,
  Divider,
  ProfileAvatar,
  renderIcon,
  StatusChip,
  Typography,
  StackedList,
} from '@ecdlink/ui';
import { getLogo, LogoSvgs } from '@utils/common/svg.utils';
import { PractitionerProfileRouteState } from './coach-programme-information.types';
import { useOnlineStatus } from '@hooks/useOnlineStatus';
import * as styles from './coach-programme-information.styles';
import ROUTES from '@routes/routes';
import { PhoneIcon } from '@heroicons/react/solid';
import { useSelector } from 'react-redux';
import { practitionerSelectors } from '@/store/practitioner';
import { practitionerForCoachSelectors } from '@/store/practitionerForCoach';
import { classroomsSelectors } from '@/store/classroom';
import { classroomsForCoachSelectors } from '@/store/classroomForCoach';

export const CoachProgrammeInformation: React.FC = () => {
  const history = useHistory();
  const { isOnline } = useOnlineStatus();
  const isCoach = true;
  const location = useLocation<PractitionerProfileRouteState>();
  const practitionerId = location.state.practitionerId;
  const practitioners = useSelector(practitionerSelectors.getPractitioners);
  const practitionersForCoach = useSelector(
    practitionerForCoachSelectors.getPractitionersForCoach
  );
  const isFromProgrammeView = true;

  const listItems = [
    {
      title: 'Programme location updated',
      titleStyle: 'text-textDark font-semibold text-base leading-snug',
      subTitle: 'SmartSpace check required',
      subTitleStyle:
        'text-sm font-h1 font-normal text-textMid w-9/12 overflow-clip',
      menuIcon: 'ExclamationIcon',
      menuIconClassName: 'bg-secondary text-white',
      showIcon: true,
      iconBackgroundColor: 'alertMain',
      chipConfig: {
        colorPalette: {
          backgroundColour: 'white',
          borderColour: 'errorMain',
          textColour: 'errorMain',
        },
      },
      text: '1',
      onActionClick: () => {},
      classNames: 'bg-uiBg',
    },
    {
      title: 'Playgroups reassigned',
      titleStyle: 'text-textDark font-semibold text-base leading-snug',
      subTitle: 'Playgroups have been assigned to a different practitioner',
      subTitleStyle:
        'text-sm font-h1 font-normal text-textMid w-9/12 overflow-clip',
      menuIcon: 'ExclamationIcon',
      menuIconClassName: 'bg-secondary text-white',
      showIcon: true,
      iconBackgroundColor: 'alertMain',
      chipConfig: {
        colorPalette: {
          backgroundColour: 'white',
          borderColour: 'errorMain',
          textColour: 'errorMain',
        },
      },
      text: '1',
      onActionClick: () =>
        history.push(ROUTES.COACH.CLASSES_REASSIGNED, {
          practitionerId,
        }),
      classNames: 'bg-uiBg',
    },
  ];

  const practitionersList = practitioners?.filter((item) =>
    practitionersForCoach?.find((item2) => item.id === item2.id)
  );

  const practitioner = practitioners?.find(
    (practitioner) => practitioner?.userId === practitionerId
  );
  const practitionersForCoachListItems = practitionersList?.map((item) => {
    const titleStyle = 'text-textMid';
    return {
      title: item.user?.firstName + ' ' + item?.user?.surname,
      titleStyle,
      subTitle: 'Practitioner',
      avatarColor: '#6974af',
      alertSeverity: 'none',
      profileText:
        item?.user?.firstName.substring(0, 1)! +
        item?.user?.surname.substring(0, 1),
      onActionClick: () => handleClick(item.userId!),
      id: item?.userId,
    };
  });

  const otherPractitionersOnSite = practitionersForCoachListItems?.filter(
    (item) => item.id !== practitionerId
  );

  const coachClassrooms = useSelector(
    classroomsForCoachSelectors.getClassroomForCoach
  );
  const practitionerClassroom = coachClassrooms?.find(
    (item) => item.userId === practitionerId
  );
  const classroomGroups = useSelector(classroomsSelectors.getClassroomGroups);
  const practitionerClassroomGroups = classroomGroups.filter(
    (item) => item.classroomId === practitionerClassroom?.id
  );

  console.log({ practitionerClassroom });
  console.log({ practitionerClassroomGroups });

  const call = () => {
    window.open(`tel:${practitioner?.user?.phoneNumber}`);
  };

  const whatsapp = () => {
    window.open(`https://wa.me/${practitioner?.user?.phoneNumber}`);
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
            dataUrl={''}
            size={'header'}
            // eslint-disable-next-line @typescript-eslint/no-empty-function
            onPressed={() => {}}
          />
        </div>

        <div className={styles.chipsWrapper}>
          <StatusChip
            backgroundColour="primary"
            borderColour="primary"
            text={'SmartStarter'}
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
            <PhoneIcon className="h-5 w-5 text-primary" aria-hidden="true" />
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
      <div className="flex justify-center mt-4">
        <div className="w-11/12">
          <StackedList
            className="w-full rounded-2xl -mt-0.5 flex flex-col gap-1"
            type="MenuList"
            listItems={listItems}
          />
        </div>
      </div>
      <div className="flex justify-center my-6">
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
        <div className={styles.infoWrapper}>
          <div>
            <Typography
              text={'Programme name'}
              type="h5"
              color="textMid"
              className={'mt-4'}
            />
            <Typography
              text={practitionerClassroom?.name}
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
              text={'Programme location'}
              type="h5"
              color="textMid"
              className={'mt-1'}
            />
            <Typography
              text={'12 1st Avenue, Mamelodi, Gauteng, 77001'}
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
              text={'Type of ECD service'}
              type="h5"
              color="textMid"
              className={'mt-1'}
            />
            <Typography
              text={'Playgroups'}
              type="h4"
              color="textDark"
              className={'mt-1'}
            />
          </div>
        </div>
        <div className={styles.infoWrapper}>
          <div className="ml-6">
            <Typography
              text={'Monday & Wednesday, Half day'}
              type="h5"
              color="textMid"
              className={'mt-1'}
            />
            <Typography
              text={'Playgroup 1: Little Stars'}
              type="h4"
              color="textDark"
              className={'mt-1'}
            />
          </div>
        </div>
        <div className={styles.infoWrapper}>
          <div className="ml-6">
            <Typography
              text={'Tuesday, Full day'}
              type="h5"
              color="textMid"
              className={'mt-1'}
            />
            <Typography
              text={'Playgroup 2: Lions'}
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
              text={'Number of non-SmartStart assistants'}
              type="h5"
              color="textMid"
              className={'mt-1'}
            />
            <Typography
              text={'2'}
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
              text={'1'}
              type="h4"
              color="textDark"
              className={'mt-1'}
            />
          </div>
        </div>
        <Divider dividerType="dashed" className="my-4" />
        <div>
          <div className="flex my-4 ml-4">
            <div className="rounded-full bg-successMain mr-4 w-8 h-8 grid place-items-center">
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
          {practitionersForCoachListItems ? (
            <div className="flex justify-center">
              <div className="w-11/12 flex justify-center">
                <StackedList
                  className={styles.stackedList}
                  listItems={otherPractitionersOnSite!}
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
