import { LanguageDto } from '@ecdlink/core';
import { Dropdown, ComponentBaseProps } from '@ecdlink/ui';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { staticDataSelectors } from '@store/static-data';
import * as styles from './language-selector.styles';

export interface LanguageSelectorProps extends ComponentBaseProps {
  currentLocale: string;
  selectLanguage: (value: LanguageDto) => void;
}

export const LanguageSelector = ({
  currentLocale,
  selectLanguage,
}: LanguageSelectorProps) => {
  const languages = useSelector(staticDataSelectors.getLanguages);

  const [locale, setLocale] = useState<string>('en-za'); // SET DEFAULT LOCALE

  const setLanguage = (locale: string) => {
    setLocale(locale);

    const language = languages?.find((x) => x.locale === locale);

    if (language) selectLanguage(language);
  };

  useEffect(() => {
    if (currentLocale) setLocale(currentLocale); // LOCALE SELECT OVERRIDE
  }, [currentLocale]);

  return (
    <div className={styles.localeDropDownWrapper}>
      <label className={styles.languageLabel}>{'Change Language:'}</label>
      <Dropdown
        fillType="clear"
        selectedValue={locale}
        list={
          (languages &&
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
