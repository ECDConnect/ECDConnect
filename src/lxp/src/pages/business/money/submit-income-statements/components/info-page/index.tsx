import InfoService from '@/services/InfoService/InfoService';
import { authSelectors } from '@/store/auth';
import { staticDataSelectors } from '@/store/static-data';
import { MoreInformation } from '@ecdlink/graphql';
import { MoreInformationPage, MoreInformationPageProps } from '@ecdlink/ui';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

interface InfoPageProps {
  title: string;
  section: string;
  children?: React.ReactNode;
  childrenPosition?: MoreInformationPageProps['childrenPosition'];
  onClose: () => void;
}

export const InfoPage = ({
  title,
  section,
  children,
  onClose,
  childrenPosition,
}: InfoPageProps) => {
  const [data, setData] = useState<MoreInformation[]>();
  const [selectedLanguage, setSelectedLanguage] = useState('en-za');

  const [isLoading, setIsLoading] = useState(false);

  const userAuth = useSelector(authSelectors.getAuthUser);
  const languages = useSelector(staticDataSelectors.getLanguages);

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
      onClose={onClose}
      setSelectedLanguage={setSelectedLanguage}
      childrenPosition={childrenPosition}
    >
      {children}
    </MoreInformationPage>
  );
};
