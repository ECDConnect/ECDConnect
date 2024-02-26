import { useSelector } from 'react-redux';
import { useCallback, useEffect, useState } from 'react';
import { LanguageDto } from '@ecdlink/core';
import { ComponentBaseProps, Dropdown, Typography } from '@ecdlink/ui';
import { staticDataSelectors } from '@/store/static-data';
import * as styles from '@/components/language-selector/language-selector.styles';
import { useOnlineStatus } from '@/hooks/useOnlineStatus';

export interface LanguageSelectorProps extends ComponentBaseProps {
  showOfflineAlert?: boolean;
  currentLocale?: string;
  selectLanguage: (value: LanguageDto) => void;
}

export const LanguageSelector = ({
  showOfflineAlert,
  currentLocale,
  selectLanguage,
}: LanguageSelectorProps) => {
  const languages = useSelector(staticDataSelectors.getLanguages);

  const { isOnline } = useOnlineStatus();

  const [locale, setLocale] = useState<string>('en-za'); // SET DEFAULT LOCALE
  const [isOfflineAlert, setIsOfflineAlert] = useState(false);

  const setLanguage = (nextLocale: string) => {
    if (!isOnline && showOfflineAlert) {
      return setIsOfflineAlert(true);
    }

    setLocale(nextLocale);

    const language = languages?.find((x) => x.locale === nextLocale);

    if (language) selectLanguage(language);
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
            (languages &&
              languages
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
