import { useThunkFetchCall } from '@/hooks/useThunkFetchCall';
import { useAppDispatch } from '@/store';
import { communitySelectors } from '@/store/community';
import {
  CommunityActions,
  getMoreInformation,
} from '@/store/community/community.actions';
import { staticDataSelectors } from '@/store/static-data';
import { MoreInformationPage } from '@ecdlink/ui';
import { useEffect, useMemo, useState, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { useHistory, useLocation } from 'react-router';
import { TeamTabState } from '../../types';
import ROUTES from '@/routes/routes';

export const TeamTabInfoPage = () => {
  const [selectedLanguage, setSelectedLanguage] = useState('en-za');

  const languages = useSelector(staticDataSelectors.getLanguages);
  const info = useSelector(
    communitySelectors.getMoreInformationSelector(selectedLanguage)
  );

  const { state } = useLocation<TeamTabState>();

  const { isLoading } = useThunkFetchCall(
    'community',
    CommunityActions.GET_MORE_INFORMATION
  );

  const appDispatch = useAppDispatch();

  const history = useHistory();

  const section = 'Community - Team - Points';

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

  const handleLanguageChange = useCallback(
    async (language: string) => {
      await appDispatch(
        getMoreInformation({ locale: language, section, tab: 'team' })
      ).unwrap();
      setSelectedLanguage(language);
    },
    [appDispatch]
  );

  const onClose = () => {
    history.push(
      state?.isFromTeamTab
        ? ROUTES.COMMUNITY.ROOT
        : ROUTES.COMMUNITY.TEAM.POINTS.ROOT,
      { forceReload: false } as TeamTabState
    );
  };

  const getContent = useCallback(async () => {
    await appDispatch(
      getMoreInformation({ locale: 'en-za', section, tab: 'team' })
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
