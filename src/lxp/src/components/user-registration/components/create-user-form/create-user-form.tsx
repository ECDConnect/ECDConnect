import { useOnlineStatus } from '@/hooks/useOnlineStatus';
import { useTenant } from '@/hooks/useTenant';
import { initialPasswordValue, passwordSchema } from '@ecdlink/core';
import {
  BannerWrapper,
  FormInput,
  PasswordInput,
  Typography,
} from '@ecdlink/ui';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';

interface CreateUserFormProps {
  closeAction?: (item: boolean) => void;
}

export const CreateUserForm: React.FC<CreateUserFormProps> = ({
  closeAction,
}) => {
  const { isOnline } = useOnlineStatus();
  const tenant = useTenant();
  const orgName = tenant?.tenant?.organisationName;

  const {
    register: passwordRegister,
    getValues: passwordGetValues,
    watch,
  } = useForm({
    resolver: yupResolver(passwordSchema),
    defaultValues: initialPasswordValue,
    mode: 'onChange',
  });
  const { password } = watch();

  return (
    <div>
      <BannerWrapper
        size="small"
        onBack={() => closeAction && closeAction(false)}
        color="primary"
        className={'h-screen'}
        title={orgName}
        displayOffline={!isOnline}
      >
        <div className="p-4">
          <Typography
            type={'h2'}
            text={'Create a username'}
            className={'text-sm font-normal'}
            color={'textDark'}
          />
          <FormInput
            textInputType="input"
            label="Username or email"
            subLabel="Must be unique. Tip: use something that you will remember."
            placeholder="e.g. Nothando_123"
            onChange={(e) => {}}
          />
          {/* <div className="my-4"> */}
          <PasswordInput
            label={'Password'}
            nameProp={'password'}
            sufficIconColor={'uiMidDark'}
            value={password}
            strengthMeterVisible={true}
            className="mb-9"
            register={passwordRegister}
          />
          {/* </div> */}
        </div>
      </BannerWrapper>
    </div>
  );
};
