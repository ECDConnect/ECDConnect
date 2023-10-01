import { BannerWrapper, Button, Typography } from '@ecdlink/ui';
import { useHistory, useParams } from 'react-router';
import { ActivityHelpRouteState } from './index.types';
import { formatStringWithFirstLetterCapitalized } from '@ecdlink/core';
// import LanguageSelector from "@/components/language-selector/language-selector";

export const ActivityHelp: React.FC = () => {
  // const [language, setLanguage] = useState({ locale: 'en-za' });

  const history = useHistory();

  const { activityId } = useParams<ActivityHelpRouteState>();

  return (
    <BannerWrapper
      showBackground={false}
      className="flex flex-col p-4 pt-6"
      size="small"
      title={formatStringWithFirstLetterCapitalized(activityId)}
      onBack={() => history.goBack()}
    >
      {/* <LanguageSelector currentLocale={language.locale} selectLanguage={setLanguage} /> */}
      <Typography className="mb-5" type="h3" text="Coming soon" />
      <Button
        className="mt-auto"
        icon="XIcon"
        type="filled"
        textColor="white"
        color="primary"
        text="Close"
        onClick={() => history.goBack()}
      />
    </BannerWrapper>
  );
};
