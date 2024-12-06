import { useEffect, useMemo, useState } from 'react';
import { ActionModal, Dropdown } from '@ecdlink/ui';

import { ReactComponent as PollyInformational } from '@/assets/iconRobot.svg';
import { useSelector } from 'react-redux';
import { staticDataSelectors } from '@/store/static-data';
import { WalkthroughModalProps } from './types';
import { useTranslation } from 'react-i18next';
import { LanguageDto } from '@ecdlink/core';
import { LanguageCode } from '@/i18n/types';
import { useAppContext } from '@/walkthrougContext';

export const WalkthroughModal = ({
  onStart,
  availableLanguages,
}: WalkthroughModalProps) => {
  const [locale, setLocale] = useState<string>('en-za');

  const { i18n } = useTranslation();
  const { setState } = useAppContext();

  const languages = useSelector(staticDataSelectors.getLanguages);

  const currentLanguages = useMemo(
    () =>
      availableLanguages?.length
        ? languages?.filter((language) =>
            availableLanguages?.includes(language.locale as LanguageCode)
          )
        : languages?.filter((language) => language.isActive),
    [languages, availableLanguages]
  );

  const onChange = (item: string) => {
    setState({ language: item });
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

  return (
    <ActionModal
      customIcon={<PollyInformational className="mb-3 h-24 w-24" />}
      title="Which language should I use?"
      actionButtons={[
        {
          type: 'filled',
          colour: 'quatenary',
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
};
