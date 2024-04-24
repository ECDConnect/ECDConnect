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
import { useEffect, useMemo, useState, useCallback } from 'react';
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

  const section = 'Community - CHW - Points';

  const infoLanguageOptions = useMemo(
    () =>
      info &&
      info.availableLanguages &&
      info.availableLanguages.map((language) => ({
        value: language?.locale || selectedLanguage,
        label: language?.description || selectedLanguage,
      })),
    [info, selectedLanguage]
  );

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
        state?.isFromIndividualPointsYearView ? 'YEAR_VIEW' : 'ROOT'
      ]
    );
  };

  const getContent = useCallback(async () => {
    await appDispatch(
      getMoreInformation({ locale: 'en-za', section })
    ).unwrap();
  }, [appDispatch]);

  useEffect(() => {
    getContent();
  }, [getContent]);

  return (
    <MoreInformationPage
      title="Points"
      isLoading={isLoading}
      languages={infoLanguageOptions || languagesOptions}
      moreInformation={info}
      onClose={onClose}
      selectedLanguage={selectedLanguage}
      setSelectedLanguage={handleLanguageChange}
    />
  );
};
