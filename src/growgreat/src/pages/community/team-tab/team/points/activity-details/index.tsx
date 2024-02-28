import ROUTES from '@/routes/routes';
import { getCommunityQuarterDescription } from '@/utils/community/community-quartes.utils';
import { ScoreCard, Typography, MoreInformationPage } from '@ecdlink/ui';
import { useHistory, useParams } from 'react-router';
import { ActivityDetailsParams } from './index.types';
import { formatStringWithFirstLetterCapitalized } from '@ecdlink/core';
import { useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { staticDataSelectors } from '@/store/static-data';
import { useAppDispatch } from '@/store';
import {
  CommunityActions,
  getPointsActivityInfo,
} from '@/store/community/community.actions';
import { communitySelectors } from '@/store/community';
import { useThunkFetchCall } from '@/hooks/useThunkFetchCall';

export const TeamPointsActivityDetails = () => {
  const [selectedLanguage, setSelectedLanguage] = useState('en-za');

  const { activitySlug } = useParams<ActivityDetailsParams>();

  const languages = useSelector(staticDataSelectors.getLanguages);
  const info = useSelector(
    communitySelectors.getPointsActivityInfoSelector(
      activitySlug,
      selectedLanguage
    )
  );

  const { isLoading } = useThunkFetchCall(
    'community',
    CommunityActions.GET_POINTS_ACTIVITY_INFO
  );

  const appDispatch = useAppDispatch();

  const history = useHistory();

  const today = new Date();

  // TODO: update section name (from portal)
  const section = activitySlug;

  const languagesOptions = useMemo(
    () =>
      languages.map((language) => ({
        value: language.locale,
        label: language.description,
      })),
    [languages]
  );

  const handleLanguageChange = (language: string) => {
    appDispatch(
      getPointsActivityInfo({ locale: language, section, activitySlug })
    );
    setSelectedLanguage(language);
  };

  useEffect(() => {
    appDispatch(
      getPointsActivityInfo({ locale: 'en-za', section, activitySlug })
    );

    // trigger on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <MoreInformationPage
      title={formatStringWithFirstLetterCapitalized(activitySlug)}
      isLoading={isLoading}
      languages={languagesOptions}
      moreInformation={info}
      onClose={() => history.push(ROUTES.COMMUNITY.TEAM.POINTS.ROOT)}
      selectedLanguage={selectedLanguage}
      setSelectedLanguage={handleLanguageChange}
      languageSelectorPosition="bottom"
    >
      <Typography
        type="h2"
        text={formatStringWithFirstLetterCapitalized(activitySlug)}
        color="textDark"
      />
      <Typography
        type="h4"
        color="textMid"
        text={getCommunityQuarterDescription(today)}
      />
      <ScoreCard
        className="my-4"
        mainText={String(0)}
        hint="points earned"
        currentPoints={300}
        maxPoints={1000}
        barBgColour="uiLight"
        barColour="alertMain"
        bgColour="uiBg"
        barSize="small"
        textColour="black"
      />
    </MoreInformationPage>
  );
};
