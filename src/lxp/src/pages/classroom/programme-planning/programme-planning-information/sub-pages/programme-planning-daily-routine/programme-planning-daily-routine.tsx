import { MoreInformationTypeEnum } from '@ecdlink/core';
import { MoreInformationPage } from '@ecdlink/ui';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';

import { useEffect, useState } from 'react';
import { staticDataSelectors } from '@/store/static-data';
import InfoService from '@/services/InfoService/InfoService';
import { MoreInformation } from '@ecdlink/graphql';

export const ProgrammePlanningDailyRoutine = () => {
  const [isLoading, setIsLoading] = useState(false);
  const languages = useSelector(staticDataSelectors.getLanguages);
  const [selectedLanguage, setSelectedLanguage] = useState('en-za');
  const [data, setData] = useState<MoreInformation[]>();

  const history = useHistory();

  useEffect(() => {
    setIsLoading(true);
    new InfoService()
      .getMoreInformation(
        MoreInformationTypeEnum.TheDailyRoutine,
        selectedLanguage
      )
      .then((info) => {
        setData(info);
        setIsLoading(false);
      })
      .catch(() => setIsLoading(false));
  }, [selectedLanguage]);

  return (
    <div>
      <MoreInformationPage
        isLoading={isLoading}
        languages={languages.map((x) => ({
          value: x.locale,
          label: x.description,
        }))}
        moreInformation={!!data ? data[0] : {}}
        title={'The daily routine'}
        onClose={history.goBack}
        setSelectedLanguage={setSelectedLanguage}
      />
    </div>
  );
};

export default ProgrammePlanningDailyRoutine;
