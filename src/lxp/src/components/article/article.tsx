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
import { ArticleProps, LanguagesModels } from './article.types';

export const Article = ({
  visible = true,
  consentEnumType,
  title,
  onClose,
  showClose = true,
  isOpen = false,
  isFromRegistration,
}: ArticleProps) => {
  const appDispatch = useAppDispatch();
  const { isOnline } = useOnlineStatus();
  const [articleText, setArticleText] = useState<string>('');

  const consent = useSelector(contentConsentSelectors.getConsent);
  const dialog = useDialog();

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
        type: consentEnumType,
      })
    ).unwrap();

    if (!!content && content.length > 0) {
      const consentFilter = isFromRegistration
        ? content?.[0]
        : content.find((x) => x.name === consentEnumType);
      setArticleText(consentFilter?.description ?? '');
    } else {
      setArticleText('');
      presentUnavailableAlert();
    }
  };

  const getContent = async (consentList: ConsentDto[] | undefined) => {
    const consentFilter = consentList?.find((x) => x.name === consentEnumType);

    if (!consentFilter || consentFilter.description?.length === 0) {
      presentUnavailableAlert();
    }

    setArticleText(consentFilter?.description ?? '');
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
                  availableLanguages={LanguagesModels}
                  notLogged={true}
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
