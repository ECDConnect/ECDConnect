import {
  Alert,
  BannerWrapper,
  Button,
  Dialog,
  StatusChip,
  Typography,
  DialogPosition,
  renderIcon,
} from '@ecdlink/ui';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useHistory, useLocation } from 'react-router';
import { ContactPerson } from '../../../components/contact-person/contact-person';
import { RemoveChildPrompt } from '../../../components/remove-child-prompt/remove-child-prompt';
import { useOnlineStatus } from '@hooks/useOnlineStatus';
import { useAppDispatch } from '@store';
import { caregiverActions, caregiverSelectors } from '@store/caregiver';
import { CaregiverContactReason } from '@store/caregiver/caregiver.types';
import { childrenActions, childrenSelectors } from '@store/children';
import { analyticsActions } from '@store/analytics';
import { attendanceColor } from './contact-child-caregiver.styles';
import { ContactChildCaregiverState } from './contact-child-caregiver.types';
import ROUTES from '@routes/routes';

export const ContactChildCaregiver: React.FC = () => {
  const history = useHistory();
  const { isOnline } = useOnlineStatus();
  const { state: locationState } = useLocation<ContactChildCaregiverState>();
  const [removeChildConfirmationVisible, setRemoveChildConfirmationVisible] =
    useState<boolean>(false);

  const { actualDaysAttended, expectedDaysAttended, childId } = locationState;
  const child = useSelector(childrenSelectors.getChildById(childId));

  const appDispatch = useAppDispatch();
  const caregiver = child?.caregiver;

  useEffect(() => {
    if (!isOnline) {
      appDispatch(
        analyticsActions.createViewTracking({
          pageView: window.location.pathname,
          title: 'Contact Child Caregiver',
        })
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOnline]);

  const addCaregiverContactHistoryLog = () => {
    if (!caregiver) {
      history.goBack();
      return;
    }

    appDispatch(
      childrenActions.addContactHistory({
        caregiverId: caregiver.id ?? '',
        childId: childId,
        contactReason: CaregiverContactReason.WeeklyAttendance,
        dateContacted: new Date().toISOString(),
      })
    );

    history.goBack();
  };

  const goToRemoveChild = () => {
    history.push(ROUTES.REMOVE_CHILD, { childId: child?.id });
  };

  return (
    <>
      <BannerWrapper
        size="small"
        onBack={history.goBack}
        color="primary"
        className={'h-full'}
        title={`Contact ${child?.user?.firstName}'s caregiver`}
        displayOffline={!isOnline}
      >
        <div className={'flex h-full flex-col overflow-y-scroll pb-20'}>
          <div className={'flex w-full flex-col p-4'}>
            <div className={'flex w-full flex-row items-center'}>
              <StatusChip
                backgroundColour={attendanceColor}
                text={`${actualDaysAttended ?? 0}/${expectedDaysAttended ?? 0}`}
                textColour={'white'}
                borderColour={attendanceColor}
                className={'mr-1'}
              />
              <Typography
                type="body"
                color={attendanceColor}
                text={`days attended last week`}
              />
            </div>

            <Typography
              className={'mt-2'}
              type="body"
              color={'textMid'}
              text={`Contact ${caregiver?.firstName}, ${child?.user?.firstName}’s caregiver to find out why ${child?.user?.firstName} has been absent.`}
            />

            <ContactPerson
              className={'mt-6'}
              displayHeader={false}
              name={caregiver?.firstName || ''}
              surname={caregiver?.surname || ''}
              contactNumber={caregiver?.phoneNumber || ''}
            />

            <Alert
              className={'mt-4'}
              type={'info'}
              title={
                'WhatsApps and phone calls will be charged at your standard carrier rates.'
              }
            />
          </div>
          <div className={'bg-uiLight w-full p-4'}>
            <Typography
              type="body"
              color={'black'}
              weight={'bold'}
              text={`If ${child?.user?.firstName} is no longer attending your programme, please remove them.`}
            />
            <Button
              type={'outlined'}
              color={'errorMain'}
              className={'mt-4 w-full'}
            >
              {renderIcon('TrashIcon', 'w-5 h-5 text-errorMain mr-1')}
              <Typography
                type="help"
                color={'errorMain'}
                text={`Remove ${child?.user?.firstName}`}
                onClick={() => setRemoveChildConfirmationVisible(true)}
              />
            </Button>
          </div>
          <div className={'w-full p-4'}>
            <Button
              type={'filled'}
              color={'primary'}
              className={'w-full'}
              onClick={addCaregiverContactHistoryLog}
            >
              {renderIcon('CheckCircleIcon', 'w-5 h-5 text-white mr-1')}
              <Typography
                type="help"
                color={'white'}
                text={`I have contacted the caregiver`}
              />
            </Button>
          </div>
        </div>
      </BannerWrapper>
      <Dialog
        className={'mb-16 px-4'}
        stretch={true}
        visible={removeChildConfirmationVisible}
        position={DialogPosition.Bottom}
      >
        <RemoveChildPrompt
          child={child}
          onProceed={goToRemoveChild}
          onClose={() => setRemoveChildConfirmationVisible(false)}
        />
      </Dialog>
    </>
  );
};
