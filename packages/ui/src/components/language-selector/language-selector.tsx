import { useEffect, useState } from 'react';
import * as styles from './language-selector.styles';
import { ComponentBaseProps } from '../../models';
import Dropdown from '../dropdown/dropdown';

export interface LanguageSelectorProps extends ComponentBaseProps {
  currentLocale?: string;
  languages: { value: string; label: string }[];
  selectLanguage: (locale: string) => void;
}

export const LanguageSelector = ({
  currentLocale,
  languages,
  selectLanguage,
}: LanguageSelectorProps) => {
  const [locale, setLocale] = useState<string>('en-za'); // SET DEFAULT LOCALE

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
        className="w-32"
        fillColor="secondary"
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
        onChange={(value) => {
          selectLanguage(value);
          setLocale(value);
        }}
      />
    </div>
  );
};

export default LanguageSelector;
