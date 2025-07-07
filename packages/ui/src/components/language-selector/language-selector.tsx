import { useCallback, useEffect, useState } from 'react';
import * as styles from './language-selector.styles';
import { ComponentBaseProps } from '../../models';
import Dropdown from '../dropdown/dropdown';
import Typography from '../typography/typography';

export interface LanguageSelectorProps extends ComponentBaseProps {
  showOfflineAlert?: boolean;
  currentLocale?: string;
  languages: { value: string; label: string }[];
  selectLanguage: (locale: string) => void;
}

export const LanguageSelector = ({
  showOfflineAlert,
  currentLocale,
  languages,
  selectLanguage,
}: LanguageSelectorProps) => {
  const [locale, setLocale] = useState<string>('en-za'); // SET DEFAULT LOCALE
  const [isOfflineAlert, setIsOfflineAlert] = useState(false);

  const onChange = (value: string) => {
    if (navigator.onLine === false && showOfflineAlert) {
      return setIsOfflineAlert(true);
    }

    setLocale(value);
    selectLanguage(value);
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
          fillColor="quatenary"
          textColor="white"
          fullWidth={true}
          fillType="filled"
          labelColor="white"
          selectedValue={locale}
          list={
            languages.map((language) => ({
              value: language.value,
              label: language.label,
            })) || []
          }
          onChange={onChange}
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
