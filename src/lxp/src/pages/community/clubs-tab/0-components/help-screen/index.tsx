import { MoreInformationPage } from '@ecdlink/ui';
import { useHistory, useParams } from 'react-router';
import { ActivityHelpRouteState } from './index.types';
import { formatStringWithFirstLetterCapitalized } from '@ecdlink/core';
import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { MoreInformation } from '@ecdlink/graphql';
import { authSelectors } from '@/store/auth';
import { staticDataSelectors } from '@/store/static-data';
import InfoService from '@/services/InfoService/InfoService';

export const ActivityHelp: React.FC = () => {
  const [data, setData] = useState<MoreInformation[]>();
  const [selectedLanguage, setSelectedLanguage] = useState('en-za');

  const [isLoading, setIsLoading] = useState(false);

  const userAuth = useSelector(authSelectors.getAuthUser);
  const languages = useSelector(staticDataSelectors.getLanguages);

  const history = useHistory();

  const { activityId, leagueType } = useParams<ActivityHelpRouteState>();

  const section = leagueType ? `${activityId}-${leagueType}` : activityId;

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
      isLoading={isLoading}
      languages={languages.map((x) => ({
        value: x.locale,
        label: x.description,
      }))}
      moreInformation={!!data ? data[0] : {}}
      title={formatStringWithFirstLetterCapitalized(activityId)}
      onClose={() => history.goBack()}
      setSelectedLanguage={setSelectedLanguage}
    />
  );
};
