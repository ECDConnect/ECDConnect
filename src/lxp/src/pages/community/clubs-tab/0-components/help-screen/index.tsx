import { MoreInformationPage } from '@ecdlink/ui';
import { useHistory, useParams } from 'react-router';
import { ActivityHelpRouteState } from './index.types';
import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { MoreInformation } from '@ecdlink/graphql';
import { authSelectors } from '@/store/auth';
import { staticDataSelectors } from '@/store/static-data';
import InfoService from '@/services/InfoService/InfoService';
import { clubSelectors } from '@/store/club';

export type HelpSection =
  | 'Be Creative'
  | 'Capture Child Attendance'
  | 'Complete Child Progress'
  | 'Host Family Days'
  | 'Leave No One Behind'
  | 'Leave No One Behind - Purple'
  | 'Meet Regularly'
  | 'Coach'
  | 'Practitioner'
  | 'Club Leader Agreement';

export const ActivityHelp: React.FC = () => {
  const [data, setData] = useState<MoreInformation[]>();
  const [selectedLanguage, setSelectedLanguage] = useState('en-za');

  const [isLoading, setIsLoading] = useState(false);

  const userAuth = useSelector(authSelectors.getAuthUser);
  const languages = useSelector(staticDataSelectors.getLanguages);
  const league = useSelector(clubSelectors.getLeagueForPractitionerSelector);

  const history = useHistory();

  const { helpSection } = useParams<ActivityHelpRouteState>();

  const section =
    helpSection === 'Coach' || helpSection === 'Practitioner'
      ? `Community - League - ${helpSection}`
      : `Community - Club - ${helpSection}`;

  useEffect(() => {
    setIsLoading(true);
    new InfoService()
      .getMoreInformation(section, selectedLanguage)
      .then((info) => {
        if (helpSection === 'Practitioner') {
          setData(
            info.filter((item: MoreInformation) => {
              return item.visit?.includes(league?.leagueTypeName || '');
            })
          );
        } else {
          setData(info);
        }
        setIsLoading(false);
      })
      .catch(() => setIsLoading(false));
  }, [league?.leagueTypeName, section, selectedLanguage, userAuth]);

  return (
    <MoreInformationPage
      isLoading={isLoading}
      languages={languages.map((x) => ({
        value: x.locale,
        label: x.description,
      }))}
      moreInformation={!!data ? data[0] : {}}
      title={helpSection}
      onClose={() => history.goBack()}
      setSelectedLanguage={setSelectedLanguage}
    />
  );
};
