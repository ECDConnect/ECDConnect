import { useOnlineStatus } from '@/hooks/useOnlineStatus';

import {
  Alert,
  Button,
  CelebrationCard,
  Dialog,
  DialogPosition,
  Steps,
  Typography,
} from '@ecdlink/ui';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router';
import ROUTES from '@/routes/routes';
import { useCallback, useEffect, useState } from 'react';
import { useDialog, useSnackbar } from '@ecdlink/core';
import { ReactComponent as EmojiGreenSmile } from '@ecdlink/ui/src/assets/emoji/emoji_green_bigsmile.svg';
import { ReactComponent as EmojiBlueSmile } from '@ecdlink/ui/src/assets/emoji/emoji_blue_smileEyes.svg';
import {
  practitionerSelectors,
  practitionerThunkActions,
} from '@/store/practitioner';
import { registrationTimelineSteps } from './components/registration-timeline-steps';
import { OnlineOnlyModal } from '@/modals/offline-sync/online-only-modal';
import { InformationPage } from './components/information-page';
import { BusinessTabItems } from '../../business.types';
import { EcdRegistrationUpdateInputModelInput } from '@ecdlink/graphql';
import { useAppDispatch } from '@/store/config/config';

type RegistrationSection = 'Apply' | 'Comply';

export const RegistrationLanding = () => {
  const history = useHistory();
  const dialog = useDialog();
  const { showMessage } = useSnackbar();
  const { isOnline } = useOnlineStatus();
  const [showApply, setShowApply] = useState(false);
  const [showComply, setShowComply] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const practitioner = useSelector(practitionerSelectors.getPractitioner);
  const dispatch = useAppDispatch();

  const showOnlineOnly = useCallback(() => {
    dialog({
      position: DialogPosition.Middle,
      render: (onSubmit) => (
        <OnlineOnlyModal
          overrideText={'You need to go online to use this feature.'}
          onSubmit={onSubmit}
        />
      ),
    });
  }, [dialog]);

  useEffect(() => {
    if (!isOnline) {
      showOnlineOnly();
      history.push(ROUTES.BUSINESS, {
        activeTabIndex: BusinessTabItems.REGISTRATION,
      });
    }
  }, [isOnline, showOnlineOnly, history]);

  const onUpdate = async (section: RegistrationSection) => {
    setIsUpdating(true);

    const registrationDto: EcdRegistrationUpdateInputModelInput = {
      id: practitioner?.ecdRegistration?.id || '',
      hasBronzeCertificate:
        section === 'Apply'
          ? true
          : practitioner?.ecdRegistration?.hasBronzeCertificate || false,
      hasSilverCertificate:
        section === 'Comply'
          ? true
          : practitioner?.ecdRegistration?.hasSilverCertificate || false,
      hasGoldCertificate:
        practitioner?.ecdRegistration?.hasGoldCertificate || false,
    };

    try {
      await dispatch(
        practitionerThunkActions.updatePractitionerEcdRegistration({
          data: registrationDto,
        })
      ).unwrap();

      if (section === 'Apply') setShowApply(false);
      else setShowComply(false);

      showMessage({
        message: 'Stage updated',
        type: 'success',
        duration: 3000,
      });
      history.push(ROUTES.BUSINESS, {
        activeTabIndex: BusinessTabItems.REGISTRATION,
      });
    } catch {
      showMessage({
        message: 'Failed to update. Please try again.',
        type: 'error',
        duration: 3000,
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const onView = (section: RegistrationSection) => {
    if (!isOnline) {
      showOnlineOnly();
      return;
    }
    if (section === 'Apply') setShowApply(true);
    else setShowComply(true);
  };

  return (
    <div className="flex h-screen w-full flex-col gap-2 overflow-auto overflow-y-scroll p-4">
      <Typography
        type={'h1'}
        text={'DBE registration helper'}
        color={'textDark'}
      />
      {!practitioner?.ecdRegistration?.hasBronzeCertificate &&
        !practitioner?.ecdRegistration?.hasSilverCertificate &&
        !practitioner?.ecdRegistration?.hasGoldCertificate && (
          <Alert
            type={'info'}
            title={'Get started with your registration!'}
            button={
              <Button
                text="Start"
                icon="ArrowCircleRightIcon"
                type="filled"
                color="quatenary"
                textColor="white"
                disabled={isUpdating}
                onClick={() => setShowApply(true)}
              />
            }
          />
        )}
      {practitioner?.ecdRegistration?.hasBronzeCertificate &&
        !practitioner?.ecdRegistration?.hasSilverCertificate &&
        !practitioner?.ecdRegistration?.hasGoldCertificate && (
          <CelebrationCard
            image={<EmojiBlueSmile className="mr-2 h-16 w-16" />}
            primaryMessage={`Good job, you have your Bronze certificate!`}
            secondaryMessage="Get started with the Comply process."
            primaryTextColour="quatenary"
            secondaryTextColour="black"
            backgroundColour="quatenaryBg"
            button={
              <Button
                text="Start"
                icon="ArrowCircleRightIcon"
                type="filled"
                color="quatenary"
                textColor="white"
                disabled={isUpdating}
                onClick={() => setShowComply(true)}
              />
            }
          />
        )}
      {(practitioner?.ecdRegistration?.hasSilverCertificate ||
        practitioner?.ecdRegistration?.hasGoldCertificate) && (
        <CelebrationCard
          image={<EmojiGreenSmile className="mr-2 h-16 w-16" />}
          primaryMessage={`Well done, you've completed your registration!`}
          secondaryMessage="Explore more resources for your ECD business."
          primaryTextColour="successMain"
          secondaryTextColour="black"
          backgroundColour="successBg"
          button={
            <Button
              text="See resources"
              icon="LinkIcon"
              type="filled"
              color="quatenary"
              textColor="white"
              onClick={() =>
                history.push(ROUTES.BUSINESS, {
                  activeTabIndex: BusinessTabItems.RESOURCES,
                })
              }
            />
          }
        />
      )}
      <div className="mt-8">
        <Steps
          items={registrationTimelineSteps({
            isLoading: false,
            ecdRegistration: practitioner?.ecdRegistration,
            onView: onView,
          })}
          typeColor={{ completed: 'successMain' }}
        />
      </div>
      <div className="absolute bottom-0 left-0 right-0 max-h-20 p-4">
        <Button
          className="w-full rounded-2xl px-2"
          type="outlined"
          color="quatenary"
          textColor="quatenary"
          text={`Update my stage`}
          icon="ClipboardListIcon"
          iconPosition="start"
          disabled={isUpdating}
          onClick={() => history.push(ROUTES.BUSINESS_REGISTRATION_UPDATE)}
        />
      </div>
      <Dialog
        fullScreen={true}
        visible={showApply}
        position={DialogPosition.Full}
      >
        <InformationPage
          title="DBE registration - Apply"
          section="Apply"
          onClose={() => setShowApply(false)}
          onSubmit={() => onUpdate('Apply')}
        />
      </Dialog>
      <Dialog
        fullScreen={true}
        visible={showComply}
        position={DialogPosition.Full}
      >
        <InformationPage
          title="DBE registration - Comply"
          section="Comply"
          onClose={() => setShowComply(false)}
          onSubmit={() => onUpdate('Comply')}
        />
      </Dialog>
    </div>
  );
};
