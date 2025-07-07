import {
  Config,
  ContentConsentTypeEnum,
  LanguageDto,
  useTheme,
} from '@ecdlink/core';
import {
  ActionModal,
  BannerWrapper,
  Button,
  Dialog,
  DialogPosition,
  Typography,
} from '@ecdlink/ui';
import { Dropdown, classNames } from '@ecdlink/ui';
import * as styles from '../setup-org.styles';
import { useCallback, useEffect, useState } from 'react';
import {
  FetchAllLanguages,
  GetConsentForPortal,
} from '../../../../../services/auth.service';

interface OrganisationalTermsProps {
  setViewOrganisationalTerms: (item: boolean) => void;
}

export const OrganisationalTerms: React.FC<OrganisationalTermsProps> = ({
  setViewOrganisationalTerms,
}) => {
  const { theme } = useTheme();
  const [availableLanguages, setAvailableLanguages] = useState<LanguageDto[]>();
  const [locale, setLocale] = useState<string>('en-za'); // SET DEFAULT LOCALE
  const [consentDescription, setConsentDescription] = useState('');
  const [openInfoModal, setOpenInfoModal] = useState(false);

  const fetchAllLanguages = useCallback(async () => {
    const languageData = await FetchAllLanguages(Config.authApi, '');

    if (languageData.length > 0) {
      setAvailableLanguages(languageData);
      getConsentDataForPortal(locale);
    }
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
  }, []);

  useEffect(() => {
    if (!availableLanguages) {
      fetchAllLanguages();
    }
  }, [availableLanguages, fetchAllLanguages]);

  const setLanguage = (nextLocale: string) => {
    setLocale(nextLocale);
    // call getConsent here
    getConsentDataForPortal(nextLocale);
  };

  const getConsentDataForPortal = useCallback(
    async (currentLocale) => {
      const consentData = await GetConsentForPortal(Config.authApi, {
        locale: currentLocale,
        name: ContentConsentTypeEnum.OrganisationalTermsAndConditions,
      });

      if (consentData && consentData.length > 0) {
        setConsentDescription(consentData[0]?.description);
      } else {
        setConsentDescription('');
        setOpenInfoModal(true);
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    },
    [locale]
  );
  return (
    <BannerWrapper
      size={'normal'}
      renderBorder={true}
      showBackground={false}
      color={'primary'}
      menuLogoUrl={theme?.images?.logoUrl}
      backgroundColour={'white'}
      onBack={() => setViewOrganisationalTerms(false)}
    >
      <div
        className={classNames(
          styles.localeDropDownWrapper,
          styles.localeDropDownWrapper
        )}
      >
        <label
          className={
            styles.labelClassName === undefined
              ? styles.languageLabel
              : styles.labelClassName
          }
        >
          Change Language:
        </label>
        <Dropdown
          fillType="clear"
          selectedValue={locale}
          fillColor="quatenary"
          labelColor="white"
          list={
            (availableLanguages &&
              availableLanguages
                .filter((x) => x.locale?.length > 0)
                .map((language: LanguageDto) => ({
                  value: language.locale,
                  label: language.description,
                }))) ||
            []
          }
          onChange={(item) => {
            setLanguage(item);
          }}
          className={'w-44'}
        />
      </div>

      <Dialog
        className={'px-56'}
        stretch={true}
        visible={openInfoModal}
        position={DialogPosition.Middle}
      >
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
              type: 'filled',
              onClick: () => setOpenInfoModal(false),
              textColour: 'white',
              leadingIcon: 'XIcon',
            },
          ]}
        />
      </Dialog>

      <div className={styles.articleTextWrapper}>
        <Typography type={'markdown'} text={consentDescription} />
      </div>

      <Button
        className="mt-8 w-full rounded-2xl px-24"
        text={'Close'}
        type="filled"
        color="secondary"
        textColor="white"
        onClick={() => setViewOrganisationalTerms(false)}
        icon="XIcon"
      />
    </BannerWrapper>
  );
};
