import { useSelector } from 'react-redux';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { LanguageDto } from '@ecdlink/core';
import { ComponentBaseProps, Dropdown, Typography } from '@ecdlink/ui';
import { staticDataSelectors } from '@/store/static-data';
import * as styles from '@/components/language-selector/language-selector.styles';
import { useOnlineStatus } from '@/hooks/useOnlineStatus';
import { LanguageCode } from '@/i18n/types';
import { useTranslation } from 'react-i18next';

export interface LanguageSelectorProps extends ComponentBaseProps {
  availableLanguages?: LanguageCode[];
  showOfflineAlert?: boolean;
  currentLocale?: string;
  selectLanguage: (value: LanguageDto) => void;
}

export const LanguageSelector = ({
  showOfflineAlert,
  currentLocale,
  selectLanguage,
  availableLanguages,
}: LanguageSelectorProps) => {
  const { isOnline } = useOnlineStatus();

  const [locale, setLocale] = useState<string>('en-za'); // SET DEFAULT LOCALE
  const [isOfflineAlert, setIsOfflineAlert] = useState(false);

  const languages = useSelector(staticDataSelectors.getLanguages);

  const { i18n } = useTranslation();

  const currentLanguages = useMemo(
    () =>
      availableLanguages?.length
        ? languages?.filter((language) =>
            availableLanguages?.includes(language.locale as LanguageCode)
          )
        : languages,
    [languages, availableLanguages]
  );

  const setLanguage = (nextLocale: string) => {
    if (!isOnline && showOfflineAlert) {
      return setIsOfflineAlert(true);
    }

    setLocale(nextLocale);

    const language = currentLanguages?.find((x) => x.locale === nextLocale);

    if (language) {
      i18n.changeLanguage(language.locale);
      selectLanguage(language);
    }
  };

  const handleOfflineAlert = useCallback(() => {
    if (isOfflineAlert) {
      setTimeout(() => {
        setIsOfflineAlert(false);
      }, 5000);
    }
  }, [isOfflineAlert]);

  useEffect(() => {
    if (currentLocale) {
      // LOCALE SELECT OVERRIDE
      setLocale(currentLocale);
    }
  }, [currentLocale]);

  useEffect(() => {
    handleOfflineAlert();
  }, [handleOfflineAlert]);

  useEffect(() => {
    if (i18n.language !== locale) {
      i18n.changeLanguage(locale);
    }

    // trigger only once
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <div className={styles.localeDropDownWrapper}>
        <label className={styles.languageLabel}>{'Change Language:'}</label>
        <Dropdown
          className="w-32"
          fillColor="secondary"
          textColor="white"
          fullWidth={true}
          fillType="filled"
          labelColor="white"
          selectedValue={locale}
          list={
            (currentLanguages &&
              currentLanguages
                .filter((x) => x.locale?.length > 0)
                .map((language: LanguageDto) => ({
                  value: language.locale,
                  label: language.description,
                }))) ||
            []
          }
          onChange={(item) => setLanguage(item)}
        />
      </div>
      {isOfflineAlert && (
        <Typography
          type="help"
          color="errorMain"
          text={'You need to be online to change the language'}
          className="mt-2"
        />
      )}
    </>
  );
};

export default LanguageSelector;
