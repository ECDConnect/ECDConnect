import {
  Config,
  PasswordResetModel,
  useDialog,
  VerifyPasswordTokenModel,
} from '@ecdlink/core';
import { yupResolver } from '@hookform/resolvers/yup';
import {
  ActionModal,
  Alert,
  BannerWrapper,
  Button,
  DialogPosition,
  Divider,
  PasswordInput,
  Typography,
} from '@ecdlink/ui';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useHistory, useLocation } from 'react-router-dom';
import * as styles from './new-password.styles';
import {
  initialNewPasswordValues,
  NewPasswordModel,
  newPasswordSchema,
} from '@schemas/auth/password/new-password';
import AuthService from '@services/AuthService/AuthService';
import { useStoreSetup } from '@hooks/useStoreSetup';
import ROUTES from '@/routes/routes';

export const NewPassword: React.FC = () => {
  const { resetAppStore, resetAuth } = useStoreSetup();
  const dialog = useDialog();
  const history = useHistory();

  // --- Query Params ---
  const params = new URLSearchParams(useLocation().search);
  const paramToken = params.get('token') ?? '';
  const paramUsername = params.get('username') ?? '';

  // --- Local State ---
  const [isLoading, setIsLoading] = useState(false);
  const [showError, setShowError] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);

  // --- React Hook Form ---
  const {
    register,
    watch,
    getValues,
    formState: { isValid },
  } = useForm<NewPasswordModel>({
    resolver: yupResolver(newPasswordSchema),
    defaultValues: initialNewPasswordValues,
    mode: 'onChange',
  });

  const { password } = watch();

  // Use memoized AuthService to avoid recreating it
  const authService = useMemo(() => new AuthService(), []);

  // Disable submit button unless form is valid and not submitted
  const isSubmitDisabled = !isValid && !hasSubmitted;

  // --- Reset app/auth once on mount ---
  useEffect(() => {
    if (resetAppStore) {
      resetAppStore(false);
      resetAuth();
    }
  }, [resetAppStore, resetAuth]);

  // --- Expired link dialog ---
  const handleLinkExpired = useCallback(() => {
    dialog({
      position: DialogPosition.Middle,
      blocking: true,
      color: 'bg-white',
      render: (onClose) => (
        <ActionModal
          title="Link expired!"
          detailText="The link has expired. Get a new one to reset your password."
          icon="ExclamationCircleIcon"
          iconColor="alertMain"
          iconSize={20}
          className="mx-4"
          actionButtons={[
            {
              text: 'Get new link',
              textColour: 'white',
              colour: 'quatenary',
              type: 'filled',
              leadingIcon: 'LinkIcon',
              onClick: () => {
                history.push(ROUTES.PASSWORD_RESET);
                onClose();
              },
            },
          ]}
        />
      ),
    });
  }, [dialog, history]);

  // --- Verify Token on load ---
  const verifyToken = useCallback(async () => {
    if (!paramToken || !paramUsername) return;

    const body: VerifyPasswordTokenModel = {
      Username: paramUsername,
      Token: paramToken,
    };

    const valid = await authService.VerifyPasswordToken(Config.authApi, body);

    if (!valid) handleLinkExpired();
  }, [authService, paramToken, paramUsername, handleLinkExpired]);

  useEffect(() => {
    verifyToken();
  }, [verifyToken]);

  // --- Submit (Reset Password) ---
  const submitForm = async () => {
    setHasSubmitted(true);

    if (!isValid) return;

    setIsLoading(true);

    const body: PasswordResetModel = {
      username: paramUsername,
      password: getValues().password,
      resetToken: paramToken,
    };

    const response = await authService.SendNewPasswordRequest(body);

    setIsLoading(false);

    if (!response.valid) {
      setShowError(true);
      return;
    }

    history.push(ROUTES.LOGIN);
  };

  return (
    <div className={styles.container}>
      <BannerWrapper
        showBackground={false}
        size="normal"
        renderBorder
        color="primary"
      >
        <div className={styles.wrapper}>
          <PasswordInput<NewPasswordModel>
            label="Enter new password"
            nameProp="password"
            value={password}
            register={register}
            sufficIconColor="primary"
            strengthMeterVisible
          />

          <div className="mt-6">
            <Divider dividerType="solid" />
          </div>

          {showError && (
            <Alert
              className="mt-8"
              type="error"
              title="Password reset was unsuccessful. Please contact an administrator."
            />
          )}

          <Button
            className={styles.formButton}
            type="filled"
            color="quatenary"
            disabled={isSubmitDisabled}
            isLoading={isLoading}
            onClick={submitForm}
          >
            <Typography type="help" color="white" text="Reset password" />
          </Button>
        </div>
      </BannerWrapper>
    </div>
  );
};
