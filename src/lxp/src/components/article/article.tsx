import { ConsentDto, LanguageDto, useDialog } from '@ecdlink/core';
import {
  ActionModal,
  BannerWrapper,
  Button,
  DialogPosition,
  renderIcon,
  Typography,
} from '@ecdlink/ui';
import { IonContent } from '@ionic/react';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useOnlineStatus } from '@hooks/useOnlineStatus';
import { useAppDispatch } from '@store';
import {
  contentConsentSelectors,
  contentConsentThunkActions,
} from '@store/content/consent';
import LanguageSelector from '../language-selector/language-selector';
import * as styles from './article.styles';
import { ArticleProps } from './article.types';
import { LanguageCode } from '@/i18n/types';
import { useTenant } from '@/hooks/useTenant';

export const Article = ({
  visible = true,
  consentEnumType,
  title,
  onClose,
  showClose = true,
  isOpen = false,
  isFromRegistration,
  isConsentScreen,
}: ArticleProps) => {
  const appDispatch = useAppDispatch();
  const { isOnline } = useOnlineStatus();
  const [articleText, setArticleText] = useState<string>('');
  const [language, setLanguage] = useState({ locale: 'en-za' });
  const [availableLanguages, setAvailableLanguages] = useState([
    language.locale as LanguageCode,
  ]);
  const consent = useSelector(contentConsentSelectors.getConsent);
  const dialog = useDialog();
  const tenant = useTenant();

  useEffect(() => {
    if (consent && visible && !isOpen) {
      getContent(consent);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [consent, visible, isOpen]);

  useEffect(() => {
    getOpenContent('en-za');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, consentEnumType]);

  const changeLanugage = async (language: LanguageDto) => {
    getOpenContent(language.locale);
  };

  const getOpenContent = async (locale: string) => {
    const content = await appDispatch(
      contentConsentThunkActions.getOpenConsent({
        locale: locale,
        name: consentEnumType,
      })
    ).unwrap();

    if (content && content.length > 0) {
      const consentFilter = content?.[0];
      var description = consentFilter?.description ?? '';

      if (!consentFilter || description.length === 0) {
        presentUnavailableAlert();
      }

      if (
        description.length > 0 &&
        (description.indexOf('[organisationName]') !== -1 ||
          description.indexOf('[applicationName]') !== -1)
      ) {
        const replacedOrgName = description.replaceAll(
          '[organisationName]',
          tenant.tenant?.organisationName!
        );

        const replacedAppName = replacedOrgName.replaceAll(
          '[applicationName]',
          tenant.tenant?.applicationName!
        );

        setArticleText(replacedAppName ?? '');
      } else {
        setArticleText(description);
      }

      if (consentFilter?.availableLanguages !== undefined) {
        setAvailableLanguages(
          consentFilter?.availableLanguages
            ? consentFilter.availableLanguages?.map((item) => {
                return item?.locale as LanguageCode;
              })
            : [language.locale as LanguageCode]
        );
      }
    } else {
      setArticleText('');
      presentUnavailableAlert();
    }
  };

  const getContent = async (consentList: ConsentDto[] | undefined) => {
    const consentFilter = consentList?.find((x) => x.name === consentEnumType);
    var description = consentFilter?.description ?? '';

    if (!consentFilter || description.length === 0) {
      presentUnavailableAlert();
    }

    if (
      description.length > 0 &&
      (description.indexOf('[organisationName]') !== -1 ||
        description.indexOf('[applicationName]') !== -1)
    ) {
      const replacedOrgName = description.replaceAll(
        '[organisationName]',
        tenant.tenant?.organisationName!
      );

      const replacedAppName = replacedOrgName.replaceAll(
        '[applicationName]',
        tenant.tenant?.applicationName!
      );

      setArticleText(replacedAppName ?? '');
    } else {
      setArticleText(description);
    }

    if (consentFilter?.availableLanguages !== undefined) {
      setAvailableLanguages(
        consentFilter?.availableLanguages
          ? consentFilter.availableLanguages?.map((item) => {
              return item?.locale as LanguageCode;
            })
          : [language.locale as LanguageCode]
      );
    }
  };

  const presentUnavailableAlert = () => {
    dialog({
      position: DialogPosition.Middle,
      render: (submit, close) => {
        return (
          <ActionModal
            className={'mx-4'}
            title="No content found"
            paragraphs={[
              'Could not find any content for the selected language, please select another.',
            ]}
            icon={'InformationCircleIcon'}
            iconColor={'infoDark'}
            iconBorderColor={'infoBb'}
            actionButtons={[
              {
                text: 'Close',
                colour: 'primary',
                onClick: close,
                type: 'filled',
                textColour: 'white',
                leadingIcon: 'XIcon',
              },
            ]}
          />
        );
      },
    });
  };

  return (
    // eslint-disable-next-line react/jsx-no-useless-fragment
    <>
      {visible && (
        <div className={styles.contentWrapper}>
          <IonContent scrollY={true}>
            <BannerWrapper
              size={'normal'}
              renderBorder={true}
              showBackground={false}
              color={'primary'}
              onBack={onClose}
              title={title}
              className={styles.bannerContentWrapper}
              backgroundColour={'white'}
              displayOffline={!isOnline}
            >
              <div className={styles.localeDropDownWrapper}>
                <LanguageSelector
                  labelClassName="text-textDark mr-2"
                  currentLocale="en-za"
                  selectLanguage={(data) => changeLanugage(data)}
                  availableLanguages={availableLanguages}
                  notLogged={true}
                  isConsentScreen={isConsentScreen}
                />
              </div>
              <div className={styles.articleTextWrapper}>
                <Typography type={'markdown'} text={articleText} />
              </div>

              {showClose && (
                <div className={styles.bottom}>
                  <Button
                    color={'quatenary'}
                    type={'filled'}
                    onClick={onClose}
                    className={styles.closeButton}
                  >
                    {renderIcon('XIcon', 'h-4 w-4 mr-2')}
                    <Typography
                      color={'white'}
                      type={'body'}
                      weight={'bold'}
                      text={'Close'}
                    />
                  </Button>
                </div>
              )}
            </BannerWrapper>
          </IonContent>
        </div>
      )}
    </>
  );
};

export default Article;
