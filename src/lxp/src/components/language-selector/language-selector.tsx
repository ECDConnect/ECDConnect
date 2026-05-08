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
  languageOptions?: LanguageDto[];
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
  languageOptions,
  showOfflineAlert = false,
  className,
  isConsentScreen,
}: LanguageSelectorProps) => {
  const [selectedLocale, setSelectedLocale] = useState(currentLocale);
  const [isOfflineAlert, setIsOfflineAlert] = useState(false);

  const languages = useSelector(staticDataSelectors.getLanguages);
  const { i18n } = useTranslation();
  const { isOnline } = useOnlineStatus();

  // Sync local state with prop when it changes externally
  useEffect(() => {
    setSelectedLocale(currentLocale);
  }, [currentLocale]);

  const currentLanguages = useMemo(() => {
    if (languageOptions?.length) {
      return languageOptions;
    }

    const filtered = availableLanguages?.length
      ? languages?.filter((lang) =>
          availableLanguages.includes(lang.locale as LanguageCode)
        )
      : languages?.filter((lang) => lang.locale !== 'other');

    return filtered || [];
  }, [languages, availableLanguages, languageOptions]);

  const setLanguage = useCallback(
    (nextLocale: string) => {
      if (!isOnline && showOfflineAlert) {
        setIsOfflineAlert(true);
        return;
      }

      const language = currentLanguages.find((x) => x.locale === nextLocale);
      if (!language) return;

      // Update i18n
      i18n.changeLanguage(nextLocale);

      // Notify parent
      selectLanguage(language);

      // Update local state immediately for responsive UI
      setSelectedLocale(nextLocale);
    },
    [isOnline, showOfflineAlert, currentLanguages, i18n, selectLanguage]
  );

  // Handle offline alert timeout
  useEffect(() => {
    if (isOfflineAlert) {
      const timer = setTimeout(() => setIsOfflineAlert(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [isOfflineAlert]);

  // Sync i18n language when currentLocale changes externally
  useEffect(() => {
    if (i18n.language !== currentLocale) {
      i18n.changeLanguage(currentLocale);
    }
  }, [currentLocale, i18n.language]); // Better dependency

  return (
    <div className={classNames(styles.localeDropDownWrapper, className)}>
      <label className={labelClassName ?? styles.languageLabel}>
        {labelText ?? 'Change Language:'}
      </label>

      <Dropdown
        fillType="clear"
        selectedValue={selectedLocale}
        disabled={disabled}
        fillColor="quatenary"
        labelColor="white"
        list={currentLanguages
          .filter((x) => x.locale?.length > 0)
          .map((language) => ({
            value: language.locale,
            label: language.description,
          }))}
        onChange={setLanguage}
        className={`${isConsentScreen ? 'w-44' : 'w-44'}`}
      />
    </div>
  );
};

export default LanguageSelector;
