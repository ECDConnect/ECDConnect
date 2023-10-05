import { authSelectors } from '@/store/auth';
import { MoreInformationPage } from '@ecdlink/ui';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { staticDataSelectors } from '@/store/static-data';
import { MoreInformation } from '@ecdlink/graphql';
import InfoService from '@/services/InfoService/InfoService';

interface PointsInfoPageProps {
  onClose: () => void;
}

export const PointsInfoPage: React.FC<PointsInfoPageProps> = ({ onClose }) => {
  const userAuth = useSelector(authSelectors.getAuthUser);
  const [data, setData] = useState<MoreInformation[]>();
  const languages = useSelector(staticDataSelectors.getLanguages);
  const [selectedLanguage, setSelectedLanguage] = useState('en-za');

  useEffect(() => {
    new InfoService()
      .getMoreInformation('Points Info Page', selectedLanguage)
      .then((info) => setData(info));
  }, [selectedLanguage, userAuth?.auth_token]);

  return (
    <MoreInformationPage
      languages={languages.map((x) => {
        return { value: x.locale, label: x.description };
      })}
      moreInformation={!!data ? data[0] : {}}
      title="Points Info"
      subTitle="How to earn points"
      name="Do I need this???"
      onClose={onClose}
      setSelectedLanguage={setSelectedLanguage}
    />
  );
};
