import { useOnlineStatus } from '@/hooks/useOnlineStatus';
import {
  Alert,
  BannerWrapper,
  Button,
  ButtonGroup,
  ButtonGroupTypes,
  Checkbox,
  Dialog,
  DialogPosition,
  FormInput,
  SA_CELL_REGEX,
  Typography,
} from '@ecdlink/ui';
import { useCallback, useEffect, useState } from 'react';
import { ContentConsentTypeEnum, useTheme } from '@ecdlink/core';
import Article from '@/components/article/article';
import { useHistory } from 'react-router';
import ROUTES from '@/routes/routes';
import { FieldError } from 'react-hook-form';
import { VerifySignupPhoneNumberAuthCode } from '@/components/user-registration/components/verify-signup-phone-number';
import { generateSignupCellPhoneNumberToken } from '@/utils/user/user-registration.utils';

interface OAAgreementsProps {
  closeAction?: (item: boolean) => void;
}

export const yesOrNoOptions = [
  { text: 'Yes', value: true },
  { text: 'No', value: false },
];

// Function for cellphone number preventing characters
const handleKeyDown = (event: React.KeyboardEvent<HTMLElement>) => {
  const allowedKeys = [
    'Backspace',
    'Delete',
    'Tab',
    'ArrowLeft',
    'ArrowRight',
    'Home',
    'End',
  ];

  // Allow numbers, plus sign, and control keys
  if (
    !/[0-9+]/.test(event.key) &&
    !allowedKeys.includes(event.key) &&
    !(event.ctrlKey || event.metaKey)
  ) {
    event.preventDefault();
  }
};

export const OAAgreements: React.FC<OAAgreementsProps> = ({ closeAction }) => {
  const { isOnline } = useOnlineStatus();
  const { theme } = useTheme();
  const history = useHistory();
  const [contentConsentTypeEnum, setContentConsentTypeEnum] =
    useState<ContentConsentTypeEnum>();
  const [presentArticle, setPresentArticle] = useState<boolean>(false);
  const [articleTitle, setArticleTitle] = useState<string>();
  const [termsAndConditions, setTermsAndConditions] = useState(false);
  const [termsAndConditionsError, setTermsAndConditionsError] = useState(false);
  const [permissionsAgreement, setPermissionsAgreement] = useState(false);
  const [permissionsAgreementError, setPermissionsAgreementError] =
    useState(false);
  const [permissionsErrorMessage, setPermissionsErrorMessage] = useState('');
  const [shareConsent, setShareConsent] = useState<
    boolean | boolean[] | undefined
  >(undefined);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isValidPhoneNumber, setIsValidPhoneNumber] = useState(true);
  const [phoneMessageError, setPhoneMessageError] = useState('');
  const [openVerifyPhoneNumber, setOpenVerifyPhoneNumber] = useState(false);
  const [verifyPhoneNumberToken, setVerifyPhoneNumberToken] =
    useState<string>('');

  const displayArticle = async (key: ContentConsentTypeEnum, title: string) => {
    setContentConsentTypeEnum(key);
    setPresentArticle(true);
    setArticleTitle(title);
  };

  const handleSubmit = async () => {
    if (!termsAndConditions || !permissionsAgreement) {
      setPermissionsErrorMessage(
        'You must accept both agreements to continue.'
      );
      if (!termsAndConditions) {
        setTermsAndConditionsError(true);
      }
      if (!permissionsAgreement) {
        setPermissionsAgreementError(true);
      }
      return;
    }

    const token = await generateSignupCellPhoneNumberToken(phoneNumber);
    if (!token) {
      setPhoneMessageError('Unable to verify cellphone number.');
      return;
    }
    setVerifyPhoneNumberToken(token);
    setOpenVerifyPhoneNumber(true);
  };

  useEffect(() => {
    if (termsAndConditions) {
      setTermsAndConditionsError(false);
    }

    if (permissionsAgreement) {
      setPermissionsAgreementError(false);
    }
  }, [permissionsAgreement, termsAndConditions]);

  const handleCellphoneChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const inputValue = e.target.value.replaceAll(/[^0-9+]/g, '');
      setPhoneNumber(inputValue);

      // Regular expression for South African cellphone number validation
      const cellphonePattern = SA_CELL_REGEX;
      const isValid = cellphonePattern.test(inputValue);
      setIsValidPhoneNumber(isValid);
    },
    []
  );

  const onCellphoneVerified = useCallback(
    (verified: boolean) => {
      setOpenVerifyPhoneNumber(false);

      if (verified) {
        history.push(ROUTES.CREATE_USERNAME, {
          shareInfoPartners: shareConsent,
          phoneNumber: phoneNumber,
        });
      }
    },
    [shareConsent, phoneNumber]
  );

  return (
    <BannerWrapper
      size="small"
      onBack={() => closeAction?.(false)}
      color="primary"
      className={'h-screen'}
      menuLogoUrl={theme?.images?.logoUrl}
      displayOffline={!isOnline}
    >
      <div className="mt-4 space-y-1 p-4">
        <Typography
          type={'h2'}
          text={'Sign up'}
          className={'pb-4 text-sm font-normal'}
          color={'textDark'}
        />
        <FormInput
          label={'Cellphone number'}
          nameProp={'phoneNumber'}
          placeholder="e.g 0123456789"
          onKeyDown={handleKeyDown}
          onChange={(e) => {
            handleCellphoneChange(e);
            setPhoneMessageError('');
          }}
          error={
            (phoneMessageError as unknown as FieldError) ||
            (!isValidPhoneNumber && phoneNumber)
          }
          type="number"
        />
        {phoneMessageError && (
          <Typography
            type={'help'}
            text={phoneMessageError}
            className={'mt-1 text-sm font-normal'}
            color={'errorMain'}
          />
        )}
        {!isValidPhoneNumber && phoneNumber && (
          <Typography
            type="help"
            text="Please enter a valid cellphone number"
            color="errorMain"
          />
        )}
      </div>
      <div className="p-4">
        <Typography
          type={'h4'}
          text={'Accept the agreements to continue'}
          className={'text-sm font-normal'}
          color={'textDark'}
        />
        <div className="mt-2 flex flex-col gap-2">
          <div
            className={`${
              termsAndConditionsError && 'border-errorDark border'
            } ${
              termsAndConditions
                ? 'border-quatenary bg-quatenaryBg border'
                : 'bg-uiBg'
            } flex w-full flex-row items-center justify-between gap-2 rounded-xl p-4`}
            onClick={() => {
              setTermsAndConditions((prevState) => !prevState);
              setPermissionsErrorMessage('');
            }}
          >
            <Checkbox
              checked={termsAndConditions}
              checkboxColor={
                termsAndConditionsError ? 'errorDark' : 'primaryAccent2'
              }
            />
            <Typography
              text={'I accept the terms and conditions'}
              type="help"
              color={termsAndConditionsError ? 'errorDark' : 'textMid'}
            />
            &nbsp;
            <Button
              color={'secondaryAccent2'}
              type={'filled'}
              text="Read"
              textColor="secondary"
              className={'rounded-xl'}
              size={'small'}
              onClick={() => {
                displayArticle(
                  ContentConsentTypeEnum.TermsAndConditions,
                  'Terms and Conditions'
                );
              }}
            />
          </div>
          <div
            className={`${
              permissionsAgreementError && 'border-errorDark border'
            } ${
              permissionsAgreement
                ? 'border-quatenary bg-quatenaryBg border'
                : 'bg-uiBg'
            } bg-uiBg flex w-full flex-row items-center justify-between gap-2 rounded-xl p-4`}
            onClick={() => {
              setPermissionsAgreement((prevState) => !prevState);
              setPermissionsErrorMessage('');
            }}
          >
            <Checkbox
              checked={permissionsAgreement}
              checkboxColor={
                permissionsAgreementError ? 'errorDark' : 'primaryAccent2'
              }
            />
            <Typography
              text={'I accept the data permissions agreement'}
              type="help"
              color={permissionsAgreementError ? 'errorDark' : 'textMid'}
            />
            &nbsp;
            <Button
              color={'secondaryAccent2'}
              type={'filled'}
              text="Read"
              textColor="secondary"
              className={'rounded-xl'}
              size={'small'}
              onClick={() => {
                displayArticle(
                  ContentConsentTypeEnum.DataPermissionsAgreement,
                  'Data Permissions Agreement'
                );
              }}
            />
          </div>
        </div>
        <div className="py-4">
          <Typography
            type={'h4'}
            text={
              'Are you open to being contacted by partners who offer more specialised support?'
            }
            className={'text-sm font-normal'}
            color={'textDark'}
          />
          <Typography
            type={'help'}
            text={
              'If you say yes, you may be contacted to share more information'
            }
            className={'mb-2 text-sm font-normal'}
            color={'textMid'}
          />
          <ButtonGroup<boolean>
            color="secondary"
            type={ButtonGroupTypes.Button}
            options={yesOrNoOptions}
            onOptionSelected={(option: boolean | boolean[]) =>
              setShareConsent(option)
            }
            selectedOptions={shareConsent}
            notSelectedColor="secondaryAccent2"
            textColor="secondary"
          />
        </div>
        {permissionsErrorMessage && (
          <Alert
            className={'mt-5 mb-3'}
            title={permissionsErrorMessage}
            type={'error'}
          />
        )}
        <Button
          className={'mt-5 w-full rounded-xl'}
          type="filled"
          color={'quatenary'}
          onClick={handleSubmit}
          icon="ArrowCircleRightIcon"
          textColor="white"
          text="Next"
          disabled={
            !termsAndConditions ||
            !permissionsAgreement ||
            shareConsent === undefined ||
            !isValidPhoneNumber ||
            phoneNumber === ''
          }
        ></Button>
      </div>
      {contentConsentTypeEnum && (
        <Article
          consentEnumType={contentConsentTypeEnum}
          visible={presentArticle}
          title={articleTitle}
          onClose={() => setPresentArticle(false)}
          isOpen={true}
          isFromRegistration={true}
          isConsentScreen={true}
        />
      )}
      <Dialog
        visible={openVerifyPhoneNumber}
        position={DialogPosition.Full}
        className="w-full"
        stretch
      >
        <VerifySignupPhoneNumberAuthCode
          closeAction={onCellphoneVerified}
          phoneNumber={phoneNumber}
          verifyToken={verifyPhoneNumberToken}
        />
      </Dialog>
    </BannerWrapper>
  );
};
