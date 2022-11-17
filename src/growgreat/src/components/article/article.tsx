import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { IonContent } from '@ionic/react';

import { useDialog, ConsentDto, LanguageDto } from '@ecdlink/core';

import {
  Button,
  Typography,
  ActionModal,
  BannerWrapper,
  DialogPosition,
} from '@ecdlink/ui';

import { useAppDispatch } from '@/store';

import {
  contentConsentSelectors,
  contentConsentThunkActions,
} from '@/store/content/consent';

import { useOnlineStatus } from '@/hooks/useOnlineStatus';

import { ArticleProps } from '@/components/article/article.types';
import LanguageSelector from '@/components/language-selector/language-selector';

import * as styles from '@/components/article/article.styles';

export const Article = ({
  title,
  onClose,
  isOpen = false,
  visible = true,
  consentEnumType,
  showClose = true,
}: ArticleProps) => {
  const dialog = useDialog();
  const appDispatch = useAppDispatch();
  const { isOnline } = useOnlineStatus();
  const [articleText, setArticleText] = useState<string>('');
  const consent = useSelector(contentConsentSelectors.getConsent);
  function presentUnavailableAlert() {
    return dialog({
      position: DialogPosition.Middle,
      render(close) {
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
  }
  async function changeLanguage(language: LanguageDto) {
    getOpenContent(language.locale);
  }
  async function getOpenContent(locale: string) {
    const content = await appDispatch(
      contentConsentThunkActions.getOpenConsent({
        locale: locale,
        type: consentEnumType as any,
      })
    ).unwrap();
    if (content && content.length > 0) {
      const consentFilter = content.find((x) => x.type === consentEnumType);

      setArticleText(consentFilter?.description ?? '');
    } else {
      setArticleText('');
      presentUnavailableAlert();
    }
  }
  async function getContent(consentList: ConsentDto[] | undefined) {
    const consentFilter = consentList?.find((x) => x.type === consentEnumType);

    if (!consentFilter || consentFilter.description?.length === 0) {
      presentUnavailableAlert();
    }

    setArticleText(consentFilter?.description ?? '');
  }
  useEffect(() => {
    if (consent && visible && !isOpen) {
      getContent(consent);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [consent, visible, isOpen]);
  useEffect(() => {
    if (isOpen) {
      // DEFAULT SETTING
      getOpenContent('en-za');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, consentEnumType]);

  if (visible) {
    return (
      <div className={styles.contentWrapper}>
        <IonContent scrollY={true}>
          <BannerWrapper
            title={title as string}
            size={'normal'}
            onBack={onClose}
            color={'primary'}
            renderBorder={true}
            showBackground={false}
            backgroundColour={'white'}
            displayOffline={!isOnline}
            className={styles.bannerContentWrapper}
          >
            <div className={styles.localeDropDownWrapper}>
              <LanguageSelector
                currentLocale="en-za"
                selectLanguage={(data) => changeLanguage(data as any)}
              />
            </div>

            <div className={styles.articleTextWrapper}>
              <Typography type={'markdown'} text={articleText} />
            </div>

            {showClose && (
              <div className={styles.bottom}>
                <Button
                  color={'primary'}
                  icon="XIcon"
                  type={'filled'}
                  onClick={onClose}
                  textColor={'white'}
                  className={styles.closeButton}
                >
                  <Typography
                    type={'body'}
                    text={'Close'}
                    weight={'bold'}
                    color={'white'}
                  />
                </Button>
              </div>
            )}
          </BannerWrapper>
        </IonContent>
      </div>
    );
  }

  return null;
};

export default Article;
