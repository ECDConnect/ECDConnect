import { useHistory, useLocation } from 'react-router';
import { useState } from 'react';
import { renderIcon } from '@ecdlink/ui';
import { useTheme } from '@ecdlink/core';
import { BannerWrapper, Button, Typography, Alert } from '@ecdlink/ui';
import { PhoneIcon } from '@heroicons/react/solid';
import { PractitionerProfileRouteState } from './coach-classes-reassigned.types';
import { useOnlineStatus } from '@hooks/useOnlineStatus';
import * as styles from './coach-classes-reassigned.styles';
import ROUTES from '@routes/routes';
import { childrenSelectors } from '@store/children';
import { practitionerSelectors } from '@/store/practitioner';
import { useSelector } from 'react-redux';
import { getLogo, LogoSvgs } from '@utils/common/svg.utils';

// import { CreateNote } from '../components/create-note/create-note';
// import { NoteTypeEnum } from '@ecdlink/graphql';
// import { getLastNoteDate } from '@utils/child/child-profile-utils';
// import { notesSelectors } from '@store/notes';
// import { useSelector } from 'react-redux';

export const CoachClassesReassigned: React.FC = () => {
  const mockedData = [
    {
      id: 1,
      title: '75% attendance rate',
      subTitle: 'Coming soon',
      avatarColor: '#FF5C00',
      profileText: 'CS',
      alertSeverity: 'none',
      phoneNumber: '2138471324',
      email: 'johnbf@gmail.com',
    },
    {
      id: 2,
      title: '5 overdue progress reports',
      subTitle: 'Coming soon',
      avatarColor: '#FF5C00',
      profileText: 'CS',
      alertSeverity: 'none',
      phoneNumber: '23984123490',
      email: 'pedroM@gmail.com',
    },
    {
      id: 3,
      title: "5 children haven't progressed",
      subTitle: 'Coming soon',
      avatarColor: '#FF5C00',
      profileText: 'CS',
      alertSeverity: 'none',
      phoneNumber: '314874393',
      email: 'carlosvieira1234@gmail.com',
    },
  ];

  const history = useHistory();
  const { isOnline } = useOnlineStatus();
  const children = useSelector(childrenSelectors.getChildren);
  const location = useLocation<PractitionerProfileRouteState>();
  const practitionerId = location.state.practitionerId;
  const practitioners = useSelector(practitionerSelectors.getPractitioners);
  const practitioner = practitioners?.find(
    (practitioner) => practitioner?.id === practitionerId
  );
  const reassignedGroups = false;
  const { theme } = useTheme();

  return (
    <div className={styles.contentWrapper}>
      <BannerWrapper
        title={`Classes reassigned`}
        color={'primary'}
        size="small"
        renderOverflow={false}
        onBack={() =>
          history.push(ROUTES.COACH.PROGRAMME_INFORMATION, {
            practitionerId,
          })
        }
        displayOffline={!isOnline}
      ></BannerWrapper>
      <div className="flex w-full items-center mt-4 ml-4">
        <div className="rounded-full bg-alertMain mr-4 w-8 h-6 grid place-items-center">
          <Typography
            type={'body'}
            weight={'bold'}
            text={'0'}
            color={'white'}
          />
        </div>
        <div>
          <Typography
            text={'Classes reassigned'}
            type="h4"
            color="textDark"
            className={'mt-1'}
          />
        </div>
      </div>
      {!reassignedGroups && (
        <div>
          <Typography
            text={`${practitioner?.user?.firstName} doesn't reassigned any classes`}
            type="h3"
            color="textDark"
            className={'m-4'}
          />
        </div>
      )}
      <div>
        <div>
          <div>
            <Typography
              text={`Contact ${practitioner?.user?.firstName}`}
              type="h3"
              color="textDark"
              className={'m-4'}
            />
          </div>
          <div>
            <Typography
              text={`${practitioner?.user?.phoneNumber}`}
              type="h2"
              weight="skinny"
              color="primary"
              className={'ml-4 mt-2'}
            />
          </div>
        </div>
        <div>
          <div className={styles.contactButtons}>
            <Button
              color={'primary'}
              type={'outlined'}
              className={'mr-4 rounded-xl'}
              size={'normal'}
              onClick={() => {}}
            >
              <div className="flex justify-center items-center">
                <img
                  src={getLogo(LogoSvgs.whatsapp)}
                  alt="whatsapp"
                  className={styles.buttonIconStyle}
                />
                <Typography
                  text={`Whatsapp ${practitioner?.user?.firstName}`}
                  type="button"
                  weight="skinny"
                  color="primary"
                />
              </div>
            </Button>
            <Button
              color={'primary'}
              type={'outlined'}
              className={'mr-4 rounded-xl'}
              size={'small'}
              onClick={() => {}}
            >
              <div className="flex justify-center items-center">
                <PhoneIcon
                  className="h-6 w-5 text-primary mx-2"
                  aria-hidden="true"
                />
                <Typography
                  text={`Call ${practitioner?.user?.firstName}`}
                  type="button"
                  weight="skinny"
                  color="primary"
                />
              </div>
            </Button>
          </div>
          <div className="flex justify-center">
            <div className="w-11/12 rounded-2xl">
              <Alert
                type="info"
                className="mt-4"
                message="WhatsApps and phone calls will be charged at your standard carrier rates."
              />
            </div>
          </div>
        </div>
        <div className="flex justify-center">
          <div className="w-11/12">
            <Button
              className={styles.button.replace('mt-4', 'mt-3')}
              color={'primary'}
              type="filled"
              onClick={() => {}}
            >
              {renderIcon('ChatAlt2Icon', styles.buttonIcon)}
              <Typography
                type="button"
                text="Contact caregiver"
                color="white"
                className="ml-2"
              />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
