import ROUTES from '@/routes/routes';
import {
  ScoreCard,
  Typography,
  MoreInformationPage,
  Button,
  Colours,
} from '@ecdlink/ui';
import { useHistory, useLocation, useParams } from 'react-router';
import { ActivityDetailsParams, ActivityDetailsState } from './index.types';
import {
  formatStringWithFirstLetterCapitalized,
  getCommunityQuarterDescription,
} from '@ecdlink/core';
import { useEffect, useMemo, useState, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { staticDataSelectors } from '@/store/static-data';
import { useAppDispatch } from '@/store';
import {
  CommunityActions,
  getPointsActivityInfo,
} from '@/store/community/community.actions';
import { communitySelectors } from '@/store/community';
import { useThunkFetchCall } from '@/hooks/useThunkFetchCall';
import { ActivitySectionName } from '@/constants/Community';
import { ReactComponent as PollyImpressed } from '@/assets/pollyImpressed.svg';
import { AddBreastFeedingClubRouteState } from '@/pages/community/breastfeeding-clubs-tab/add-breastfeeding-club/types';

export const TeamPointsActivityDetails = () => {
  const [selectedLanguage, setSelectedLanguage] = useState('en-za');

  const { activitySlug } = useParams<ActivityDetailsParams>();
  const location = useLocation<ActivityDetailsState>();
  const currentPoints = location.state?.currentPoints ?? '0';

  const languages = useSelector(staticDataSelectors.getLanguages);
  const info = useSelector(
    communitySelectors.getPointsActivityInfoSelector(
      activitySlug,
      selectedLanguage
    )
  );
  const clinicDetails = useSelector(communitySelectors.getClinicSelector);

  const { isLoading } = useThunkFetchCall(
    'community',
    CommunityActions.GET_POINTS_ACTIVITY_INFO
  );

  const appDispatch = useAppDispatch();

  const history = useHistory();

  const today = new Date();

  const isChildFoldersOpened = activitySlug === 'child-folders-opened';
  const isPregnantMomFoldersOpened =
    activitySlug === 'pregnant-mom-folders-opened';
  const isBreastFeeding = activitySlug === 'breastfeeding-clubs';

  const slugToKey = (slug: string): string => {
    const words: string[] = slug.split('-');
    const titleWords: string[] = words.map(
      (word) => word.charAt(0).toUpperCase() + word.slice(1)
    );
    return titleWords.join('');
  };

  const section =
    ActivitySectionName[
      slugToKey(activitySlug) as keyof typeof ActivitySectionName
    ];

  const { quarterDescription } = getCommunityQuarterDescription(today);

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

  const { barColour, maxPoints } = useMemo(() => {
    let maxPoints = 0;
    let barColour: Colours = 'alertMain';

    // 100 * 3 * number of CHWs in clinic
    if (isChildFoldersOpened) {
      maxPoints = 100 * 3 * (clinicDetails?.clinicMembers?.length ?? 0);
    }

    // 50 * 3 * number of CHWs in clinic
    if (isPregnantMomFoldersOpened) {
      maxPoints = 50 * 3 * (clinicDetails?.clinicMembers?.length ?? 0);
    }

    if (isBreastFeeding) {
      maxPoints = 600;
    }

    if (Number(currentPoints) >= maxPoints) {
      barColour = 'successMain';
    }

    return { maxPoints, barColour };
  }, [
    clinicDetails?.clinicMembers?.length,
    currentPoints,
    isBreastFeeding,
    isChildFoldersOpened,
    isPregnantMomFoldersOpened,
  ]);

  const handleLanguageChange = useCallback(
    async (language: string) => {
      await appDispatch(
        getPointsActivityInfo({ locale: language, section, activitySlug })
      ).unwrap();
      setSelectedLanguage(language);
    },
    [activitySlug, appDispatch, section]
  );

  const getContent = useCallback(async () => {
    await appDispatch(
      getPointsActivityInfo({ locale: 'en-za', section, activitySlug })
    ).unwrap();
  }, [activitySlug, appDispatch, section]);

  useEffect(() => {
    getContent();
  }, [getContent]);

  return (
    <MoreInformationPage
      title={formatStringWithFirstLetterCapitalized(activitySlug)}
      isLoading={isLoading}
      languages={infoLanguageOptions || languagesOptions}
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
      <Typography type="h4" color="textMid" text={quarterDescription} />
      <ScoreCard
        className="my-4"
        mainText={currentPoints}
        hint="points earned"
        currentPoints={Number(currentPoints)}
        maxPoints={maxPoints}
        barBgColour="uiLight"
        barColour={barColour}
        bgColour="uiBg"
        barSize="small"
        textColour="black"
        hideProgressBar={
          !isChildFoldersOpened &&
          !isPregnantMomFoldersOpened &&
          !isBreastFeeding
        }
      />
      {(isChildFoldersOpened ||
        isPregnantMomFoldersOpened ||
        isBreastFeeding) &&
        Number(currentPoints) >= maxPoints && (
          <div className="bg-successBg rounded-10 mb-4 flex items-center gap-4 p-4">
            <PollyImpressed className="h-14 w-14 self-center" />
            <Typography
              type="h4"
              text={`Great work ${clinicDetails?.name ?? ''} team!`}
              color="successDark"
            />
          </div>
        )}
      {isBreastFeeding && (
        <Button
          type="filled"
          color="primary"
          textColor="white"
          text="Add a breastfeeding club"
          icon="PlusCircleIcon"
          className="mb-4"
          onClick={() =>
            history.push(ROUTES.COMMUNITY.BREASTFEEDING_CLUBS.ADD, {
              isFromPointsScreen: true,
            } as AddBreastFeedingClubRouteState)
          }
        />
      )}
    </MoreInformationPage>
  );
};
