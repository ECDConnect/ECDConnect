import { LanguageDto } from '@ecdlink/core';
import { Dropdown, ComponentBaseProps, classNames } from '@ecdlink/ui';
import { useEffect, useState, useMemo, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { staticDataSelectors } from '@store/static-data';
import * as styles from './language-selector.styles';
import { LanguageCode } from '@/i18n/types';
import { useOnlineStatus } from '@/hooks/useOnlineStatus';
import { useTranslation } from 'react-i18next';

export interface LanguageSelectorProps extends ComponentBaseProps {
  currentLocale: string;
  disabled?: boolean;
  labelText?: string;
  labelClassName?: string;
  selectLanguage: (value: LanguageDto) => void;
  availableLanguages?: LanguageCode[];
  notLogged?: boolean;
  showOfflineAlert?: boolean;
  isConsentScreen?: boolean;
}

export const LanguageSelector = ({
  currentLocale,
  disabled,
  labelText,
  labelClassName,
  selectLanguage,
  availableLanguages,
  notLogged,
  showOfflineAlert,
  className,
  isConsentScreen,
}: LanguageSelectorProps) => {
  const [selectedLocale, setSelectedLocale] = useState<string>(currentLocale);
  const languages = useSelector(staticDataSelectors.getLanguages);
  const [isOfflineAlert, setIsOfflineAlert] = useState(false);
  const { i18n } = useTranslation();
  const { isOnline } = useOnlineStatus();

  const currentLanguages = useMemo(
    () =>
      availableLanguages?.length
        ? languages?.filter((language) =>
            availableLanguages.includes(language.locale as LanguageCode)
          )
        : languages.filter((language) => language.locale !== 'other'),
    [languages, availableLanguages]
  );

  const setLanguage = (nextLocale: string) => {
    if (!isOnline && showOfflineAlert) {
      setIsOfflineAlert(true);
      return;
    }

    const language = currentLanguages?.find((x) => x.locale === nextLocale);

    if (language) {
      i18n.changeLanguage(language.locale);
      selectLanguage(language);
    }
  };

  const handleOfflineAlert = useCallback(() => {
    if (isOfflineAlert) {
      setTimeout(() => setIsOfflineAlert(false), 5000);
    }
  }, [isOfflineAlert]);

  useEffect(() => {
    handleOfflineAlert();
  }, [handleOfflineAlert]);

  useEffect(() => {
    if (i18n.language !== currentLocale) {
      i18n.changeLanguage(currentLocale);
    }
  }, [currentLocale, i18n]);

  console.log('currentLocale', currentLocale);
  console.log('selectedLocale', selectedLocale);

  return (
    <div className={classNames(styles.localeDropDownWrapper, className)}>
      <label
        className={
          labelClassName === undefined ? styles.languageLabel : labelClassName
        }
      >
        {labelText === undefined ? 'Change Language:' : labelText}
      </label>

      <Dropdown
        fillType="clear"
        selectedValue={selectedLocale}
        disabled={disabled}
        fillColor="quatenary"
        labelColor="white"
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
        onChange={(item) => {
          setLanguage(item);
          setSelectedLocale(item);
        }}
        className={`${isConsentScreen ? 'w-44' : 'w-auto'}`}
      />
    </div>
  );
};

export default LanguageSelector;
