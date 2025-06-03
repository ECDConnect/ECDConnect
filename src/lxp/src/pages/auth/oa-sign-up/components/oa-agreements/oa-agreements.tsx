import { useOnlineStatus } from '@/hooks/useOnlineStatus';
import {
  Alert,
  BannerWrapper,
  Button,
  ButtonGroup,
  ButtonGroupTypes,
  Checkbox,
  Typography,
} from '@ecdlink/ui';
import { useEffect, useState } from 'react';
import { ContentConsentTypeEnum, useTheme } from '@ecdlink/core';
import Article from '@/components/article/article';
import { useHistory } from 'react-router';
import ROUTES from '@/routes/routes';

interface OAAgreementsProps {
  closeAction?: (item: boolean) => void;
}

export const yesOrNoOptions = [
  { text: 'Yes', value: true },
  { text: 'No', value: false },
];

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
  const [permissionsAgreement, setPermissionAgreement] = useState(false);
  const [permissionsAgreementError, setPermissionAgreementError] =
    useState(false);
  const [permissionsErrorMessage, setPermissionsErrorMessage] = useState('');
  const [shareConsent, setShareConsent] = useState<
    boolean | boolean[] | undefined
  >(undefined);

  const displayArticle = async (key: ContentConsentTypeEnum, title: string) => {
    setContentConsentTypeEnum(key);
    setPresentArticle(true);
    setArticleTitle(title);
  };

  const handleSubmitAgreements = () => {
    if (!termsAndConditions || !permissionsAgreement) {
      setPermissionsErrorMessage(
        'You must accept both agreements to continue.'
      );
      if (!termsAndConditions) {
        setTermsAndConditionsError(true);
      }
      if (!permissionsAgreement) {
        setPermissionAgreementError(true);
      }
      return;
    }

    history.push(ROUTES.CREATE_USERNAME, { shareInfoPartners: shareConsent });
  };

  useEffect(() => {
    if (termsAndConditions) {
      setTermsAndConditionsError(false);
    }

    if (permissionsAgreement) {
      setPermissionAgreementError(false);
    }
  }, [permissionsAgreement, termsAndConditions]);

  return (
    <BannerWrapper
      size="small"
      onBack={() => closeAction && closeAction(false)}
      color="primary"
      className={'h-screen'}
      menuLogoUrl={theme?.images?.logoUrl}
      displayOffline={!isOnline}
    >
      <div className="p-4">
        <Typography
          type={'h2'}
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
              setPermissionAgreement((prevState) => !prevState);
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
          onClick={handleSubmitAgreements}
          icon="ArrowCircleRightIcon"
          textColor="white"
          text="Next"
          disabled={shareConsent === undefined}
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
    </BannerWrapper>
  );
};
