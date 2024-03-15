import { useEffect, useMemo, useState } from 'react';
import { ActionModal, Dropdown } from '@ecdlink/ui';

import { ReactComponent as PollyNeutral } from '@/assets/pollyNeutral.svg';
import { ReactComponent as PollyInformational } from '@/assets/pollyInformational.svg';
import { useSelector } from 'react-redux';
import { staticDataSelectors } from '@/store/static-data';
import { WalkthroughModalProps } from './types';
import { useTranslation } from 'react-i18next';
import { LanguageDto } from '@ecdlink/core';
import { LanguageCode } from '@/i18n/types';

export const WalkthroughModal = ({
  onClose,
  onStart,
  availableLanguages,
}: WalkthroughModalProps) => {
  const [locale, setLocale] = useState<string>('en-za');
  const [isSelectLanguage, setIsSelectLanguage] = useState(false);

  const { i18n } = useTranslation();

  const languages = useSelector(staticDataSelectors.getLanguages);

  const currentLanguages = useMemo(
    () =>
      availableLanguages?.length
        ? languages?.filter((language) =>
            availableLanguages?.includes(language.locale as LanguageCode)
          )
        : languages,
    [languages, availableLanguages]
  );

  const onChange = (item: string) => {
    setLocale(item);
    i18n.changeLanguage(item);
  };

  useEffect(() => {
    if (i18n.language !== locale) {
      i18n.changeLanguage(locale);
    }

    // trigger only once
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (isSelectLanguage) {
    return (
      <ActionModal
        customIcon={<PollyInformational className="mb-3 h-24 w-24" />}
        title="Which language should I use?"
        actionButtons={[
          {
            type: 'filled',
            colour: 'primary',
            text: 'Start',
            textColour: 'white',
            leadingIcon: 'ArrowCircleRightIcon',
            onClick: onStart,
          },
        ]}
      >
        <Dropdown
          className="w-full"
          fillColor="tertiaryAccent2"
          textColor="textDark"
          fullWidth
          fillType="filled"
          labelColor="textDark"
          selectedValue={locale}
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
          onChange={onChange}
        />
      </ActionModal>
    );
  }

  return (
    <ActionModal
      customIcon={<PollyNeutral className="mb-3 h-24 w-24" />}
      title="Hello!"
      detailText="Would you like me to show you how to use this section?"
      actionButtons={[
        {
          type: 'filled',
          colour: 'primary',
          text: 'Yes, help me!',
          textColour: 'white',
          leadingIcon: 'CheckCircleIcon',
          onClick: () => setIsSelectLanguage(true),
        },
        {
          type: 'outlined',
          colour: 'primary',
          text: 'No, skip',
          textColour: 'primary',
          leadingIcon: 'ClockIcon',
          onClick: onClose,
        },
      ]}
    />
  );
};
