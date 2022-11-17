import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { LanguageDto } from '@ecdlink/core';
import { ComponentBaseProps, Dropdown } from '@ecdlink/ui';
import { staticDataSelectors } from '@/store/static-data';
import * as styles from '@/components/language-selector/language-selector.styles';

export interface LanguageSelectorProps extends ComponentBaseProps {
  currentLocale?: string;
  selectLanguage: (value: LanguageDto) => void;
}

export function LanguageSelector({
  currentLocale,
  selectLanguage,
}: LanguageSelectorProps) {
  const languages = useSelector(staticDataSelectors.getLanguages);

  const [locale, setLocale] = useState<string>('en-za'); // SET DEFAULT LOCALE

  function setLanguage(locale: string) {
    setLocale(locale);

    const language = languages?.find(
      (x: { locale: string }) => x.locale === locale
    );

    if (language) {
      selectLanguage(language);
    }
  }

  useEffect(() => {
    if (currentLocale) {
      // LOCALE SELECT OVERRIDE
      setLocale(currentLocale);
    }
  }, [currentLocale]);

  return (
    <div className={styles.localeDropDownWrapper}>
      <label htmlFor="languageDropDown" className={styles.languageLabel}>
        Change Language:
      </label>
      <Dropdown
        fillType="clear"
        textColor="white"
        fullWidth={true}
        id="languageDropDown"
        fillColor="secondary"
        selectedValue={locale}
        className="flex-inline w-filled w-40 text-white"
        list={
          (languages?.length &&
            languages
              .filter((x: { locale: string | any[] }) => x.locale?.length > 0)
              .map((language: LanguageDto) => ({
                value: language.locale,
                label: language.description,
              }))) ||
          []
        }
        onChange={(item) => setLanguage(item as string)}
      />
    </div>
  );
}

export default LanguageSelector;
