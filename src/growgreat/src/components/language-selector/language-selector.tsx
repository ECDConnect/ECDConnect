import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { LanguageDto } from '@ecdlink/core';
import { ComponentBaseProps, Dropdown } from '@ecdlink/ui';
import { staticDataSelectors } from '@/store/static-data';
import * as styles from '@/components/language-selector/language-selector.styles';

export interface LanguageSelectorProps extends ComponentBaseProps {
  currentLocale?: string;
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
    if (currentLocale) {
      // LOCALE SELECT OVERRIDE
      setLocale(currentLocale);
    }
  }, [currentLocale]);

  return (
    <div className={styles.localeDropDownWrapper}>
      <label className={styles.languageLabel}>{'Change Language:'}</label>
      <Dropdown
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
  );
};

export default LanguageSelector;
