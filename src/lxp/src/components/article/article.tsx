import { ConsentDto, LanguageDto, useDialog } from '@ecdlink/core';
import {
  ActionModal,
  BannerWrapper,
  Button,
  DialogPosition,
  Divider,
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

export const Article = ({
  visible = true,
  consentEnumType,
  title,
  onClose,
  showClose = true,
  isOpen = false,
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
      const consentFilter = content.find((x) => x.name === consentEnumType);
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
              backgroundColour={'uiBg'}
              displayOffline={!isOnline}
            >
              <div className={styles.localeDropDownWrapper}>
                <LanguageSelector
                  currentLocale="en-za"
                  selectLanguage={(data) => changeLanugage(data)}
                />
              </div>
              <Divider />
              <div className={styles.articleTextWrapper}>
                <Typography type={'markdown'} text={articleText} />
              </div>

              {showClose && (
                <div className={styles.bottom}>
                  <Divider />
                  <Button
                    color={'primary'}
                    type={'outlined'}
                    onClick={onClose}
                    className={styles.closeButton}
                  >
                    {renderIcon('XIcon', 'h-4 w-4 mr-2')}
                    <Typography
                      color={'primary'}
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
