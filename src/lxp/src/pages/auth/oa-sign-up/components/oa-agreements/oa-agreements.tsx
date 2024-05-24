import { useOnlineStatus } from '@/hooks/useOnlineStatus';
import {
  BannerWrapper,
  Button,
  ButtonGroup,
  ButtonGroupTypes,
  Checkbox,
  Typography,
} from '@ecdlink/ui';
import { useState } from 'react';
import { useTenant } from '@/hooks/useTenant';
import { ContentConsentTypeEnum } from '@ecdlink/core';
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
  const history = useHistory();
  const tenant = useTenant();
  const [contentConsentTypeEnum, setContentConsentTypeEnum] =
    useState<ContentConsentTypeEnum>();
  const [presentArticle, setPresentArticle] = useState<boolean>(false);
  const [articleTitle, setArticleTitle] = useState<string>();
  const orgName = tenant?.tenant?.organisationName;
  const [termsAndConditions, setTermsAndConditions] = useState(false);
  const [permissionsAgreement, setPermissionAgreement] = useState(false);
  const [shareConsent, setShareConsent] = useState<
    boolean | boolean[] | undefined
  >(undefined);

  const displayArticle = async (key: ContentConsentTypeEnum, title: string) => {
    setContentConsentTypeEnum(key);
    setPresentArticle(true);
    setArticleTitle(title);
  };

  return (
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
          text={'Accept the agreements to continue'}
          className={'text-sm font-normal'}
          color={'textDark'}
        />
        <div className="mt-2 flex flex-col gap-2">
          <div
            className={
              'bg-uiBg flex w-full flex-row items-center justify-between gap-2 rounded-xl p-4'
            }
          >
            <Checkbox
              onCheckboxChange={() =>
                setTermsAndConditions((prevState) => !prevState)
              }
              checked={termsAndConditions}
            />
            <Typography
              text={'I accept the terms and conditions'}
              type="help"
              color={false ? 'errorDark' : 'textMid'}
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
          <div
            className={
              'bg-uiBg flex w-full flex-row items-center justify-between gap-2 rounded-xl p-4'
            }
          >
            <Checkbox
              onCheckboxChange={() =>
                setPermissionAgreement((prevState) => !prevState)
              }
              checked={permissionsAgreement}
            />
            <Typography
              text={'I accept the data permissions agreement'}
              type="help"
              color={false ? 'errorDark' : 'textMid'}
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
        <div className="py-2">
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
            color={'textDark'}
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
        <Button
          className={'mt-3 w-full rounded-xl'}
          type="filled"
          color="quatenary"
          onClick={() => history.push(ROUTES.CREATE_USERNAME)}
          icon="ArrowCircleRightIcon"
          textColor="white"
          text="Next"
        ></Button>
      </div>
      {contentConsentTypeEnum && (
        <Article
          consentEnumType={contentConsentTypeEnum}
          visible={presentArticle}
          title={articleTitle}
          onClose={() => setPresentArticle(false)}
          isOpen={true}
        />
      )}
    </BannerWrapper>
  );
};
