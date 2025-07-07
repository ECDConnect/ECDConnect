import {
  BannerWrapper,
  Button,
  Card,
  Checkbox,
  FormInput,
  LoadingSpinner,
  SA_CELL_REGEX,
  Typography,
} from '@ecdlink/ui';
import { renderIcon } from '@ecdlink/ui';
import { ReactComponent as Cebisa } from '@/assets/icon_cebisa.svg';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { authSelectors } from '@/store/auth';
import {
  OnNext,
  PractitionerSetupSteps,
} from '@/pages/principal/setup-principal/setup-principal.types';
import Article from '@/components/article/article';
import { ContentConsentTypeEnum, useTheme } from '@ecdlink/core';
import { useOnlineStatus } from '@/hooks/useOnlineStatus';
import { userSelectors } from '@/store/user';
import { FieldError } from 'react-hook-form';
import { useAppDispatch } from '@/store';
import { useTenant } from '@/hooks/useTenant';
import TransparentLayer from '../../../../../assets/TransparentLayer.png';
import { PrincipalInviteDto } from '@/models/practitioner/PrincipalInvite.dto';

export const InvitePrincipal: React.FC<{
  onNext: OnNext;
  setInvitePrincipal: (item: boolean) => void;
  setPrincipalNumberDetails: (item: PrincipalInviteDto) => void;
}> = ({ onNext, setInvitePrincipal, setPrincipalNumberDetails }) => {
  const { theme } = useTheme();
  const { isOnline } = useOnlineStatus();
  const tenant = useTenant();
  const appName = tenant?.tenant?.applicationName;
  const appDispatch = useAppDispatch();
  const user = useSelector(userSelectors.getUser);
  const userAuth = useSelector(authSelectors.getAuthUser);
  const [principalPhoneNumber, setPrincipalPhoneNumber] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [viewPermissionToShare, setViewPermissionToShare] =
    useState<boolean>(false);
  const [allowPermissions, setAllowPermissions] = useState(false);
  const [error, setError] = useState('');

  const handleInvitePrincipal = async () => {
    setIsLoading(true);
    let validPhoneNumber = true;
    validPhoneNumber = SA_CELL_REGEX.test(principalPhoneNumber);

    if (!validPhoneNumber) {
      setError('Phone number is not valid');
      setIsLoading(false);
      return;
    } else {
      setError('');
    }

    const input: PrincipalInviteDto = {
      principalPhoneNumber: principalPhoneNumber,
      userId: user?.id!,
    };
    setPrincipalNumberDetails(input);
    onNext(PractitionerSetupSteps.ADD_PHOTO);
    setIsLoading(false);
  };

  const handleSkipAddPractitionerToPrincipal = async () => {
    onNext(PractitionerSetupSteps.ADD_PHOTO);
  };

  return (
    <>
      <BannerWrapper
        onBack={() => setInvitePrincipal && setInvitePrincipal(false)}
        color="primary"
        title={`Preschool information`}
        subTitle={'Step 1 of 2'}
        displayOffline={!isOnline}
        className={'relative'}
        backgroundUrl={TransparentLayer}
        size={'large'}
        renderBorder={true}
        showBackground={true}
      >
        <div className="h-screen overscroll-y-auto px-4 pt-7">
          <div className="flex flex-col gap-11">
            <div>
              <Card
                className="bg-uiBg mb-6 flex flex-col items-center gap-3 p-6"
                borderRaduis="xl"
                shadowSize="lg"
              >
                <div className="">
                  <Cebisa />
                </div>
                <Typography
                  color="textDark"
                  text={`Invite your principal to ${appName}!`}
                  type={'h3'}
                  align="center"
                />
              </Card>
            </div>
          </div>
          <div className="h-fit mt-4 mb-1">
            <FormInput
              label={`What is your principal's phone number?`}
              placeholder={'e.g 0123456789'}
              type={'number'}
              onChange={(e) => {
                setPrincipalPhoneNumber(e?.target?.value);
                setError('');
              }}
              value={principalPhoneNumber}
              error={error as unknown as FieldError}
            ></FormInput>
            {error && (
              <Typography
                type="body"
                hasMarkup
                text={error}
                className="mt-1"
                color="errorMain"
              />
            )}

            {isLoading && (
              <LoadingSpinner
                size="medium"
                spinnerColor="quatenary"
                backgroundColor="uiLight"
                className="my-4"
              />
            )}

            {principalPhoneNumber && (
              <div
                className={`${
                  allowPermissions
                    ? 'border-quatenary bg-quatenaryBg border'
                    : 'bg-uiBg'
                } bg-uiBg mt-2 flex w-full flex-row items-center justify-between gap-2 rounded-xl p-4`}
              >
                <Checkbox
                  description={`I give permission for my information to be shared with the preschool principal`}
                  descriptionColor="textMid"
                  checked={allowPermissions}
                  onCheckboxChange={() =>
                    setAllowPermissions(!allowPermissions)
                  }
                />
                &nbsp;
                <Button
                  color={'secondaryAccent2'}
                  type={'filled'}
                  text="Read"
                  textColor="secondary"
                  className={'rounded-xl'}
                  size={'small'}
                  onClick={() => setViewPermissionToShare(true)}
                />
              </div>
            )}
            <div className="mt-4 flex w-full flex-col justify-center">
              <Button
                type="filled"
                color="quatenary"
                className={'mt-1 mb-2 w-full'}
                disabled={!principalPhoneNumber || !allowPermissions}
                isLoading={isLoading}
                onClick={handleInvitePrincipal}
              >
                {renderIcon('ExclamationIcon', 'mr-2 text-white w-5')}
                <Typography
                  type={'help'}
                  text={'Save & send invitation'}
                  color={'white'}
                />
              </Button>
              <Button
                type="outlined"
                color="quatenary"
                className={'border-quatenary bottom-12 mt-1 mb-2 w-full border'}
                onClick={handleSkipAddPractitionerToPrincipal} // Navigate to a different page if it is principle
              >
                {renderIcon('ArrowCircleRightIcon', 'mr-2 text-white w-5')}
                <Typography type={'help'} text={'Skip'} color={'quatenary'} />
              </Button>
            </div>
          </div>
          <Article
            visible={viewPermissionToShare}
            consentEnumType={ContentConsentTypeEnum.PermissionToShare}
            onClose={function (): void {
              setViewPermissionToShare(false);
            }}
          />
        </div>
      </BannerWrapper>
    </>
  );
};
