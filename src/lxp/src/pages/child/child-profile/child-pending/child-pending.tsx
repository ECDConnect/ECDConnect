import { useDialog } from '@ecdlink/core';
import { Alert, BannerWrapper, Button, DialogPosition, Divider, Typography } from '@ecdlink/ui';
import { format, addDays } from 'date-fns';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router';
import { useOnlineStatus } from '@hooks/useOnlineStatus';
import { useAppDispatch } from '@store';
import { childrenThunkActions } from '@store/children';
import { classroomsSelectors } from '@store/classroom';
import { settingSelectors } from '@store/settings';
import { ChildRegistrationSteps } from '../../child-registration/child-registration.types';
import { ChildPendingProps } from './child-pending.types';
import OnlineOnlyModal from '../../../../modals/offline-sync/online-only-modal';
import { copyToClip } from '@utils/common/clipboard.utils';
import { CaregiverChildRegistrationModal } from '../../components/caregiver-child-registration-modal/caregiver-child-registration-modal';

export const ChildPending: React.FC<ChildPendingProps> = ({ child, childUser }) => {
  const history = useHistory();
  const { isOnline } = useOnlineStatus();
  const [deadlineDateText, setDeadlineDateText] = useState<string>('');
  const dialog = useDialog();
  const childExpiryTime = useSelector(settingSelectors.getChildExpiryTime);
  const childLearner = useSelector(classroomsSelectors.getChildLearner(child));
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!child || !child.insertedDate) return;

    const addedDays = addDays(new Date(child.insertedDate), childExpiryTime);

    const formatedDate = format(addedDays, 'dd MMMM yyyy');
    setDeadlineDateText(formatedDate);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [child]);

  const completeRegistration = async () => {
    if (isOnline) {
      goToChildRegistration();
    } else {
      showOnlineOnly();
    }
  };

  const goToChildRegistration = () => {
    history.push('/child-registration', {
      step: ChildRegistrationSteps.registrationForm,
      childId: child.id,
    });
  };

  const showOnlineOnly = () => {
    dialog({
      position: DialogPosition.Bottom,
      render: (onSubmit) => {
        return <OnlineOnlyModal onSubmit={onSubmit}></OnlineOnlyModal>;
      },
    });
  };

  const onSendcaregiverLink = async () => {
    if (isOnline) {
      createLink();
    } else {
      showOnlineOnly();
    }
  };

  const createLink = async () => {
    const response = await dispatch(
      childrenThunkActions.refreshCaregiverChildToken({
        classgroupId: childLearner?.classroomGroupId,
        childId: child.id,
      })
    );
    const caregiverChildregUrl = history.createHref({
      pathname: `${window.location.host}/child-registration-landing`,
      search: `?token=${response.payload}`,
    });

    copyToClip(caregiverChildregUrl);

    dialog({
      render: (onSubmit, onCancel) => {
        return (
          <CaregiverChildRegistrationModal
            onSubmit={onSubmit}
            onCancel={onCancel}
            childDetails={{
              firstName: childUser?.firstName || '',
              surname: childUser?.surname || '',
            }}
            caregiverUrl={caregiverChildregUrl}
          />
        );
      },
      position: DialogPosition.Middle,
    });
  };

  return (
    <BannerWrapper
      onBack={history.goBack}
      color="primary"
      size="medium"
      renderBorder
      title={`${childUser?.firstName} ${childUser?.surname}`}
      subTitle={'Not Registered'}
      displayOffline={!isOnline}
    >
      <div className="h-full w-full flex flex-col p-4">
        <Alert title={`${childUser?.firstName}'s registration is not complete`} type={'error'} />

        <Typography
          className="mt-4"
          type="body"
          color={'textMid'}
          text={`If the registration form is not completed, this profile will be removed on:`}
        />

        <Typography weight="bolder" type="body" color={'textMid'} text={`${deadlineDateText}`} />

        <Typography
          className="mt-4"
          text="Remember, by allowing a child to attend your programme without getting
        and uploading a parent’s consent, you might leave your programme open to
        legal consequences"
          type="body"
        />

        <Divider className="my-4" />

        <Button
          id="gtm-share-caregiver"
          type="filled"
          color="primary"
          text="Copy link to send to caregiver"
          textColor="white"
          icon="LinkIcon"
          iconPosition="start"
          onClick={onSendcaregiverLink}
        />

        <Button
          type="outlined"
          className="mt-4"
          color="primary"
          text="Upload paper registration form"
          textColor="primary"
          icon="UploadIcon"
          iconPosition="start"
          onClick={completeRegistration}
        />
      </div>
    </BannerWrapper>
  );
};
