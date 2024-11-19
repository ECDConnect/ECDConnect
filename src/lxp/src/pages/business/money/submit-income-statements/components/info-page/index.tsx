import InfoService from '@/services/InfoService/InfoService';
import { authSelectors } from '@/store/auth';
import { staticDataSelectors } from '@/store/static-data';
import { MoreInformation } from '@ecdlink/graphql';
import { MoreInformationPage, MoreInformationPageProps } from '@ecdlink/ui';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';

interface InfoPageProps {
  title: string;
  section: string;
  children?: React.ReactNode;
  childrenPosition?: MoreInformationPageProps['childrenPosition'];
  closeText?: MoreInformationPageProps['closeText'];
  closeIcon?: MoreInformationPageProps['closeIcon'];
  onClose: () => void;
  footer?: React.ReactNode;
}

export const InfoPage = ({
  title,
  section,
  children,
  closeIcon,
  closeText,
  onClose,
  childrenPosition,
  footer,
}: InfoPageProps) => {
  const [data, setData] = useState<MoreInformation[]>();
  const [selectedLanguage, setSelectedLanguage] = useState('en-za');

  const [isLoading, setIsLoading] = useState(false);

  const userAuth = useSelector(authSelectors.getAuthUser);
  const languages = useSelector(staticDataSelectors.getLanguages);

  const { i18n } = useTranslation();

  useEffect(() => {
    setIsLoading(true);
    new InfoService()
      .getMoreInformation(section, selectedLanguage)
      .then((info) => {
        setData(info);
        setIsLoading(false);
      })
      .catch(() => setIsLoading(false));
  }, [section, selectedLanguage, userAuth]);

  useEffect(() => {
    if (i18n.language !== selectedLanguage) {
      i18n.changeLanguage(selectedLanguage);
    }

    // trigger only once
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <MoreInformationPage
      isClosable={false}
      isLoading={isLoading}
      languages={languages.map((language) => ({
        value: language.locale,
        label: language.description,
      }))}
      moreInformation={!!data ? data[0] : {}}
      title={title}
      closeText={closeText}
      closeIcon={closeIcon}
      onClose={onClose}
      setSelectedLanguage={(language) => {
        i18n.changeLanguage(language);
        setSelectedLanguage(language);
      }}
      childrenPosition={childrenPosition}
      footer={footer}
    >
      {children}
    </MoreInformationPage>
  );
};
