import { LanguageDto } from '@ecdlink/core';
import { Dropdown, ComponentBaseProps } from '@ecdlink/ui';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { staticDataSelectors } from '@store/static-data';
import * as styles from './language-selector.styles';

export interface LanguageSelectorProps extends ComponentBaseProps {
  currentLocale: string;
  disabled?: boolean;
  labelText?: string;
  labelClassName?: string;
  selectLanguage: (value: LanguageDto) => void;
  availableLanguages?: LanguageDto[];
  notLogged?: boolean;
}

export const LanguageSelector = ({
  currentLocale,
  disabled,
  labelText,
  labelClassName,
  selectLanguage,
  availableLanguages,
  notLogged,
}: LanguageSelectorProps) => {
  const allLanguages = useSelector(staticDataSelectors.getLanguages);
  const languages: LanguageDto[] = availableLanguages
    ? allLanguages.filter((langauge: LanguageDto) =>
        availableLanguages.some((item) => item.id === langauge.id)
      )
    : allLanguages;

  const [locale, setLocale] = useState<string>('en-za'); // SET DEFAULT LOCALE
  const setLanguage = (locale: string) => {
    setLocale(locale);

    const language = notLogged
      ? availableLanguages?.find((x: LanguageDto) => x.locale === locale)
      : languages?.find((x: LanguageDto) => x.locale === locale);

    if (language) selectLanguage(language);
  };

  useEffect(() => {
    if (currentLocale) setLocale(currentLocale); // LOCALE SELECT OVERRIDE
  }, [currentLocale]);

  return (
    <div className={styles.localeDropDownWrapper}>
      <label
        className={
          labelClassName === undefined ? styles.languageLabel : labelClassName
        }
      >
        {labelText === undefined ? 'Change Language:' : labelText}
      </label>
      <Dropdown
        fillType="clear"
        selectedValue={locale}
        disabled={disabled}
        fillColor="quatenary"
        labelColor="white"
        list={
          notLogged
            ? availableLanguages
                ?.filter((x) => x.locale?.length > 0)
                .map((language: LanguageDto) => {
                  return {
                    label: language.description,
                    value: language.locale,
                  };
                }) || []
            : (languages &&
                languages
                  .filter((x) => x.locale?.length > 0)
                  .map((language: LanguageDto) => {
                    return {
                      label: language.description,
                      value: language.locale,
                    };
                  })) ||
              []
        }
        onChange={(item) => {
          setLanguage(item);
        }}
      />
    </div>
  );
};

export default LanguageSelector;
