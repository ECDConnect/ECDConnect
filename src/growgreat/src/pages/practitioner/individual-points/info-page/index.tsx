import { useThunkFetchCall } from '@/hooks/useThunkFetchCall';
import ROUTES from '@/routes/routes';
import { useAppDispatch } from '@/store';
import { healthCareWorkerSelectors } from '@/store/healthCareWorker';
import {
  HealthCareWorkerActions,
  getMoreInformation,
} from '@/store/healthCareWorker/healthCareWorker.actions';
import { staticDataSelectors } from '@/store/static-data';
import { MoreInformationPage } from '@ecdlink/ui';
import { useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { useHistory, useLocation } from 'react-router';
import { IndividualPointsInfoPageRouteState } from './types';

export const IndividualPointsInfoPage = () => {
  const [selectedLanguage, setSelectedLanguage] = useState('en-za');

  const { state } = useLocation<IndividualPointsInfoPageRouteState>();

  const languages = useSelector(staticDataSelectors.getLanguages);
  const info = useSelector(
    healthCareWorkerSelectors.getMoreInformationSelector(selectedLanguage)
  );

  const { isLoading } = useThunkFetchCall(
    'healthCareWorker',
    HealthCareWorkerActions.GET_MORE_INFORMATION
  );

  const appDispatch = useAppDispatch();

  const history = useHistory();

  // TODO: replace with real section name
  const section = '{sectionName}';

  const languagesOptions = useMemo(
    () =>
      languages.map((language) => ({
        value: language.locale,
        label: language.description,
      })),
    [languages]
  );

  const handleLanguageChange = (language: string) => {
    appDispatch(getMoreInformation({ locale: language, section }));
    setSelectedLanguage(language);
  };

  const onClose = () => {
    history.push(
      ROUTES.PRACTITIONER.INDIVIDUAL_POINTS[
        state?.isFromIndividualPointsYearView ? 'YEAR_VIEW' : 'MONTH_VIEW'
      ]
    );
  };

  useEffect(() => {
    appDispatch(getMoreInformation({ locale: 'en-za', section }));

    // trigger on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <MoreInformationPage
      title="Points"
      isLoading={isLoading}
      languages={languagesOptions}
      moreInformation={info}
      onClose={onClose}
      selectedLanguage={selectedLanguage}
      setSelectedLanguage={handleLanguageChange}
    />
  );
};
