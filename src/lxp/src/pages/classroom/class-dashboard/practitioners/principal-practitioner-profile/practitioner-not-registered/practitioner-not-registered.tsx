import {
  Dialog,
  DialogPosition,
  BannerWrapper,
  Button,
  Alert,
  Card,
  Typography,
  renderIcon,
} from '@ecdlink/ui';
import { format, addDays } from 'date-fns';
import { useState } from 'react';
import { useOnlineStatus } from '@hooks/useOnlineStatus';
import { useHistory } from 'react-router';
import { PractitionerNotRegisterProps } from './practitioner-not-registered.types';
import { PractitionerService } from '@/services/PractitionerService';
import { authSelectors } from '@/store/auth';
import { useSelector } from 'react-redux';
import { practitionerThunkActions } from '@/store/practitioner';
import { useAppDispatch } from '@/store';
import ROUTES from '@/routes/routes';
import { useSnackbar } from '@ecdlink/core';
import { staticDataSelectors } from '@store/static-data';
import { XCircleIcon } from '@heroicons/react/solid';
import { formatDateLong } from '@/utils/common/date.utils';
import { PractitionerRemovalHistory } from '@ecdlink/graphql';
import EditRemovePractitionerFromProgrammePrompt from '../components/remove-practitioner-from-programme/edit-remove-practitioner-from-programme-prompt';
import * as styles from '../../principal-practitioner-profile/principal-practitioner-profile.styles';

export const PractitionerNotRegistered: React.FC<
  PractitionerNotRegisterProps
> = ({ practitioner, classroom, existingRemoval }) => {
  const history = useHistory();
  const { showMessage } = useSnackbar();
  const { isOnline } = useOnlineStatus();
  const userAuth = useSelector(authSelectors.getAuthUser);
  const appDispatch = useAppDispatch();
  const reasonsForLeavingProgramme = useSelector(
    staticDataSelectors.getReasonsForPractitionerLeavingProgramme
  );

  const [editRemovalDialogVisable, setEditRemovalDialogVisable] =
    useState<boolean>(false);

  const cancelPractitionerRemoval = async () => {
    await new PractitionerService(
      userAuth?.auth_token || ''
    ).cancelRemovePractitionerFromProgramme(existingRemoval?.id);
    await appDispatch(
      practitionerThunkActions.getAllPractitioners({})
    ).unwrap();
    history.push(ROUTES.CLASSROOM.ROOT);
  };

  const removePractitioner = async () => {
    const removeReasonId = reasonsForLeavingProgramme?.find(
      (item) => item.description === 'Other'
    );

    if (practitioner?.isLeaving) {
      await new PractitionerService(
        userAuth?.auth_token || ''
      ).UpdatePrincipalInvitation(
        practitioner?.userId!,
        practitioner?.principalHierarchy!,
        false
      );
    } else {
      if (removeReasonId) {
        if (existingRemoval?.id) {
          await new PractitionerService(
            userAuth?.auth_token || ''
          ).updateRemovePractitionerFromProgramme(
            existingRemoval.id,
            removeReasonId.id,
            practitioner?.isLeaving
              ? 'Practitioner said they were not a practitioner at this classroom'
              : 'Practitioner has not registered on Funda app',
            new Date(),
            []
          );
        } else {
          await new PractitionerService(
            userAuth?.auth_token || ''
          ).RemovePractitionerFromProgramme(
            practitioner?.userId!,
            removeReasonId.id,
            practitioner?.isLeaving
              ? 'Practitioner said they were not a practitioner at this classroom'
              : 'Practitioner has not registered on Funda app',
            classroom?.id || '',
            new Date(),
            []
          );
        }
      }
    }

    await appDispatch(
      practitionerThunkActions.getAllPractitioners({})
    ).unwrap();
    history.push(ROUTES.CLASSROOM.ROOT);
    showMessage({
      message: `${practitioner?.user?.firstName} removed`,
    });
  };

  const callForHelp = () => {
    window.open('tel:+27800014817');
  };

  return (
    <>
      <BannerWrapper
        title={`${practitioner?.user?.fullName}`}
        color={'primary'}
        size="medium"
        renderBorder={true}
        renderOverflow={false}
        onBack={() => history.goBack()}
        displayOffline={!isOnline}
      />
      <div className="flex flex-wrap justify-center">
        {existingRemoval && (
          <Card className={styles.removalCard}>
            <div className="mt-2 mr-4 flex items-center">
              <div className="mx-4 mt-2 mb-4 flex w-full items-center">
                <XCircleIcon
                  className="text-errorMain h-10 w-10"
                  aria-hidden="true"
                />
                <Typography
                  type={'body'}
                  color="errorMain"
                  text={`${practitioner?.user?.firstName} will be removed on ${
                    existingRemoval?.dateOfRemoval
                      ? formatDateLong(new Date(existingRemoval?.dateOfRemoval))
                      : ''
                  }`}
                  className={styles.absentCardSubTitle}
                />
              </div>
              <Button
                size="small"
                shape="normal"
                color="primary"
                type="filled"
                onClick={() => setEditRemovalDialogVisable(true)}
              >
                {renderIcon(
                  'PencilIcon',
                  'w-5 h-5 color-primary text-primary mr-2'
                )}
                <Typography
                  type="body"
                  className="mr-4"
                  color="white"
                  text={'Edit'}
                ></Typography>
              </Button>
            </div>
          </Card>
        )}
      </div>
      <div className="flex w-full justify-center">
        <Alert
          className="mt-10 w-11/12 rounded-xl"
          type={'error'}
          title={
            practitioner?.isLeaving
              ? `${
                  practitioner?.user?.firstName
                } has said that they are not a practitioner at ${
                  classroom?.name
                }. If ${
                  practitioner?.user?.firstName
                } does not accept by ${format(
                  new Date(practitioner?.dateToBeRemoved!),
                  'LLL d'
                )}, this profile will be deleted.`
              : `${
                  practitioner?.user?.firstName
                } has not registered on Funda App. If ${
                  practitioner?.user?.firstName
                } does not register by ${format(
                  addDays(new Date(practitioner?.dateLinked!), 7),
                  'LLL d'
                )}, this profile will be deleted.`
          }
          list={[
            !practitioner?.isLeaving
              ? `If ${practitioner?.user?.firstName} needs help registering for Funda App, please contact the SmartStart call centre.`
              : `If ${practitioner?.user?.firstName} needs help with Funda App, please contact the SmartStart call centre.`,
            `If you added ${practitioner?.user?.firstName} by mistake, please remove them from your programme.`,
          ]}
          button={
            <Button
              text="Contact call centre"
              icon="PhoneIcon"
              type={'filled'}
              color={'primary'}
              textColor={'white'}
              onClick={callForHelp}
            />
          }
        />
      </div>
      {!existingRemoval && (
        <div className="flex w-full justify-center">
          <Button
            text="Remove Practitioner"
            icon="TrashIcon"
            type={'filled'}
            color={'primary'}
            textColor={'white'}
            className="mt-4 w-11/12"
            onClick={removePractitioner}
          />
        </div>
      )}
      <Dialog
        className={'mb-16 px-4'}
        stretch={true}
        visible={editRemovalDialogVisable}
        position={DialogPosition.Bottom}
      >
        <EditRemovePractitionerFromProgrammePrompt
          practitioner={practitioner}
          classroomName={classroom?.name || ''}
          removalDetails={existingRemoval as PractitionerRemovalHistory}
          onEdit={() => {
            history.push(ROUTES.PRINCIPAL.PRACTITIONER_REMOVE_FROM_PROGRAMME, {
              practitionerId: practitioner?.userId!,
            });
          }}
          onCancel={() => {
            cancelPractitionerRemoval();
            setEditRemovalDialogVisable(false);
          }}
          onClose={() => {
            setEditRemovalDialogVisable(false);
          }}
        />
      </Dialog>
    </>
  );
};
