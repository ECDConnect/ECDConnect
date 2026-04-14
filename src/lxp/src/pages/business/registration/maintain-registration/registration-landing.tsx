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
import { useDialog, useSnackbar } from '@ecdlink/core';
import { ReactComponent as EmojiGreenSmile } from '@ecdlink/ui/src/assets/emoji/emoji_green_bigsmile.svg';
import { ReactComponent as EmojiBlueSmile } from '@ecdlink/ui/src/assets/emoji/emoji_blue_smileEyes.svg';
import {
  practitionerSelectors,
  practitionerThunkActions,
} from '@/store/practitioner';
import { registrationTimelineSteps } from './components/registration-timeline-steps';
import { OnlineOnlyModal } from '@/modals/offline-sync/online-only-modal';
import { useEffect, useState } from 'react';
import { InformationPage } from './components/information-page';
import { BusinessTabItems } from '../../business.types';
import { EcdRegistrationUpdateInputModelInput } from '@ecdlink/graphql';
import { useAppDispatch } from '@/store/config/config';

export const RegistrationLanding = () => {
  const history = useHistory();
  const dialog = useDialog();
  const { showMessage } = useSnackbar();
  const { isOnline } = useOnlineStatus();
  const [showApply, setShowApply] = useState(false);
  const [showComply, setShowComply] = useState(false);
  const practitioner = useSelector(practitionerSelectors.getPractitioner);
  const dispatch = useAppDispatch();

  const showOnlineOnly = () => {
    dialog({
      position: DialogPosition.Middle,
      render: (onSubmit) => {
        return (
          <OnlineOnlyModal
            overrideText={'You need to go online to use this feature.'}
            onSubmit={onSubmit}
          ></OnlineOnlyModal>
        );
      },
    });
  };

  const onUpdate = async (section: string) => {
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

    await dispatch(
      practitionerThunkActions.updatePractitionerEcdRegistration({
        data: registrationDto,
      })
    );

    if (section === 'Apply') {
      setShowApply(false);
    } else if (section === 'Comply') {
      setShowComply(false);
    }

    showMessage({
      message: 'Stage updated',
      type: 'success',
      duration: 3000,
    });

    history.push(ROUTES.BUSINESS, {
      activeTabIndex: BusinessTabItems.REGISTRATION,
    });
  };

  const onView = (section: string) => {
    if (!isOnline) {
      showOnlineOnly();
      return;
    }
    if (section === 'Apply') {
      setShowApply(true);
    } else if (section === 'Comply') {
      setShowComply(true);
    }
  };

  useEffect(() => {
    if (!isOnline) {
      showOnlineOnly();
      history.push(ROUTES.BUSINESS_REGISTRATION_UPDATE);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="flex w-full flex-col gap-2 overflow-auto p-4">
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
