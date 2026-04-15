import { ActionModal, ComponentBaseProps, DialogPosition } from '@ecdlink/ui';
import { useCallback, useEffect, useState } from 'react';

import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import { StepViewer } from '@/components/step-viewer/step-viewer';
import { RegistrationSteps } from '../registration.types';
import { useStepNavigation } from '@ecdlink/core/lib/hooks/useStepNavigation';
import { useDialog } from '@ecdlink/core/lib/services/dialog/DialogService';
import { useOnlineStatus } from '@/hooks/useOnlineStatus';
import OnlineOnlyModal from '@/modals/offline-sync/online-only-modal';
import { useHistory } from 'react-router-dom';
import ROUTES from '@/routes/routes';
import { BusinessTabItems } from '../../business.types';
import { Step } from '@/components/step-viewer/components/step';
import { useSnackbar } from '@ecdlink/core/lib/services/snackbar';
import { ExclamationCircleIcon } from '@heroicons/react/solid';
import { CertificateStep } from '../welcome-registration/components/step2/certificateStep';
import { useAppDispatch } from '@/store';
import { useSelector } from 'react-redux';
import {
  practitionerSelectors,
  practitionerThunkActions,
} from '@/store/practitioner';
import {
  initialUpdateRegistrationModel,
  UpdateRegistrationModel,
  updateRegistrationSchema,
} from './components/update-registration-types';
import { EcdRegistrationUpdateInputModelInput } from '@ecdlink/graphql';

interface RegistrationUpdateProps extends ComponentBaseProps {
  onSubmit: (value: any) => void;
}

export const RegistrationUpdate: React.FC<RegistrationUpdateProps> = ({}) => {
  const dialog = useDialog();
  const { isOnline } = useOnlineStatus();
  const history = useHistory();
  const { showMessage } = useSnackbar();
  const dispatch = useAppDispatch();
  const practitioner = useSelector(practitionerSelectors.getPractitioner);

  const { setValue } = useForm<UpdateRegistrationModel>({
    resolver: yupResolver(updateRegistrationSchema),
    mode: 'onChange',
    defaultValues: initialUpdateRegistrationModel,
  });

  const { activeStepKey, canGoBack, goBackOneStep } = useStepNavigation(
    RegistrationSteps.subsidy
  );

  useEffect(() => {
    if (!isOnline) {
      openOfflineDialog();
    }
  }, [isOnline]);

  const onSubmit = async (data: UpdateRegistrationModel) => {
    const registrationDto: EcdRegistrationUpdateInputModelInput = {
      id: practitioner?.ecdRegistration?.id || '',
      hasBronzeCertificate: data.certificates?.includes('Bronze') || false,
      hasSilverCertificate: data.certificates?.includes('Silver') || false,
      hasGoldCertificate: data.certificates?.includes('Gold') || false,
    };

    await dispatch(
      practitionerThunkActions.updatePractitionerEcdRegistration({
        data: registrationDto,
      })
    );

    showMessage({
      message: 'Stage updated',
      type: 'success',
      duration: 3000,
    });

    history.push(ROUTES.BUSINESS, {
      activeTabIndex: BusinessTabItems.REGISTRATION,
    });
  };
  const openOfflineDialog = useCallback(() => {
    dialog({
      color: 'bg-white',
      position: DialogPosition.Middle,
      render: (onClose) => (
        <OnlineOnlyModal
          onSubmit={() => {
            history.replace(ROUTES.BUSINESS, {
              activeTabIndex: BusinessTabItems.STAFF,
            });
            onClose();
          }}
        />
      ),
    });
  }, [dialog, history]);

  const exitRegistrationPrompt = () => {
    dialog({
      position: DialogPosition.Middle,
      color: 'bg-white',
      render: (onClose, onCancel) => (
        <ActionModal
          className="z-50"
          customIcon={
            <ExclamationCircleIcon className="text-alertMain mb-4 h-10 w-10" />
          }
          title={`Are you sure you want to exit?`}
          detailText={'If you exit now your changes will not be saved.'}
          actionButtons={[
            {
              text: 'Exit',
              textColour: 'white',
              colour: 'quatenary',
              type: 'filled',
              onClick: () => {
                onClose();
              },
              leadingIcon: 'ArrowLeftIcon',
            },
            {
              text: 'Continue editing',
              textColour: 'quatenary',
              colour: 'quatenary',
              type: 'outlined',
              onClick: () => onCancel(),
              leadingIcon: 'PencilIcon',
            },
          ]}
        />
      ),
    });
  };

  return (
    <StepViewer
      title="Update my stage"
      onBack={() => {
        if (canGoBack()) goBackOneStep();
      }}
      activeStep={activeStepKey}
      onClose={exitRegistrationPrompt}
      isOnline={isOnline}
      showOfflineCard={false}
    >
      <Step stepKey={RegistrationSteps.subsidy} viewBannerWapper={true}>
        <CertificateStep
          setValue={setValue}
          initialCertificates={[
            ...(practitioner?.ecdRegistration?.hasBronzeCertificate
              ? ['Bronze']
              : []),
            ...(practitioner?.ecdRegistration?.hasSilverCertificate
              ? ['Silver']
              : []),
            ...(practitioner?.ecdRegistration?.hasGoldCertificate
              ? ['Gold']
              : []),
          ]}
          onSubmit={({ certificatesAdded }) =>
            onSubmit({ certificates: certificatesAdded })
          }
        />
      </Step>
    </StepViewer>
  );
};
