import InfoService from '@/services/InfoService/InfoService';
import { authSelectors } from '@/store/auth';
import { staticDataSelectors } from '@/store/static-data';
import { MoreInformation } from '@ecdlink/graphql';
import { MoreInformationPage, MoreInformationPageProps } from '@ecdlink/ui';
import { useEffect, useState, useCallback } from 'react';
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
  const [data, setData] = useState<MoreInformation[]>([]);
  const [selectedLanguage, setSelectedLanguage] = useState('en-za');
  const [isLoading, setIsLoading] = useState(false);

  const userAuth = useSelector(authSelectors.getAuthUser);
  const languages = useSelector(staticDataSelectors.getLanguages);

  const { i18n } = useTranslation();

  // Memoizing the fetch request to avoid multiple re-creations of InfoService
  const fetchMoreInformation = useCallback(async () => {
    try {
      setIsLoading(true);
      const info = await new InfoService().getMoreInformation(
        section,
        selectedLanguage
      );
      setData(info);
    } catch (error) {
      console.error('Error fetching information:', error);
    } finally {
      setIsLoading(false);
    }
  }, [section, selectedLanguage]);

  useEffect(() => {
    fetchMoreInformation();
  }, [fetchMoreInformation, userAuth]);

  useEffect(() => {
    if (i18n.language !== selectedLanguage) {
      i18n.changeLanguage(selectedLanguage);
    }
  }, [selectedLanguage, i18n]);

  const activeLanguages = Array.from(
    new Map(
      languages
        .filter((language) => language.isActive)
        .map((language) => [
          language.locale,
          { value: language.locale, label: language.description },
        ])
    ).values()
  );

  return (
    <MoreInformationPage
      isClosable={false}
      isLoading={isLoading}
      languages={activeLanguages}
      moreInformation={data?.[0] || {}}
      title={title}
      closeText={closeText}
      closeIcon={closeIcon}
      onClose={onClose}
      setSelectedLanguage={(language) => {
        setSelectedLanguage(language);
        i18n.changeLanguage(language);
      }}
      childrenPosition={childrenPosition}
      footer={footer}
    >
      {children}
    </MoreInformationPage>
  );
};
