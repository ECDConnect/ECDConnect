import { LanguageDto } from '@ecdlink/core';
import { Dropdown } from '@ecdlink/ui';
import { ComponentBaseProps } from '@ecdlink/ui';
import { useEffect, useState } from 'react';

export interface LanguageSelectorProps extends ComponentBaseProps {
  languages: LanguageDto[];
  currentLanguageId: string;
  disabled: boolean;
  selectLanguage?: (value: string) => void;
}

export const LanguageSelector = ({
  languages,
  currentLanguageId,
  disabled,
  selectLanguage,
}: LanguageSelectorProps) => {
  const [languageId, setlanguageId] = useState<string>('');

  const setLanguage = (selection: string) => {
    setlanguageId(selection);
    selectLanguage(selection);
  };

  useEffect(() => {
    if (currentLanguageId) {
      setlanguageId(currentLanguageId);
    }
  }, [currentLanguageId]);

  return (
    <Dropdown
      fillType="clear"
      selectedValue={languageId}
      disabled={disabled}
      list={
        (languages &&
          languages.map((language: LanguageDto) => {
            return {
              label: language.description,
              value: language.id,
            };
          })) ||
        []
      }
      onChange={(item) => {
        setLanguage(item);
      }}
    />
  );
};

export default LanguageSelector;
