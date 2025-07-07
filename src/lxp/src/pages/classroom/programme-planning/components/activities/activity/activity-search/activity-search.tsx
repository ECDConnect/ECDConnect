import {
  ActionModal,
  BannerWrapper,
  Dialog,
  Divider,
  SearchDropDown,
  Typography,
  DialogPosition,
  FilterInfo,
  SearchDropDownOption,
  Button,
  Alert,
} from '@ecdlink/ui/';

import React, { useState, useMemo, useEffect } from 'react';
import { useSelector } from 'react-redux';
import ActivityCard from '../activity-card/activity-card';
import { staticDataSelectors } from '@store/static-data';
import SearchHeader, {
  SearchHeaderAlternativeRenderItem,
} from '../../../../../../../components/search-header/search-header';
import { programmeThemeSelectors } from '@store/content/programme-theme';
import {
  activitySelectors,
  activityThunkActions,
} from '@store/content/activity';
import { ActivityDto, ProgressTrackingSubCategoryDto } from '@ecdlink/core/';
import { ActivitySearchProps } from './activity-search.types';
import {
  filterActivitiesByTheme,
  filterActivitiesByType,
  getProgressTrackingSubCategoryActivities,
} from '@utils/classroom/programme-planning/activity-search.utils';
import { useAppDispatch } from '@store';
import { progressTrackingSelectors } from '@store/progress-tracking';
import {
  getDateRangeText,
  getRoutineItemType,
} from '@utils/classroom/programme-planning/programmes.utils';
import { programmeSelectors } from '@store/programme';
import { EmptyActivities } from '../../components/empty-activity-filter-result/empty-activity-filter-result';
import {
  ACTIVITY_PAGE_SIZE,
  ActivityType,
} from '../../../../../../../constants/ActivitySearch';
import { useOnlineStatus } from '@hooks/useOnlineStatus';
import { format, isSameDay, isSameWeek, parseISO } from 'date-fns';
import { useProgrammePlanningRecommendations } from '@/hooks/useProgrammePlanningRecommendations';
import { useAppContext } from '@/walkthrougContext';

const ActivitySearch: React.FC<ActivitySearchProps> = ({
  title,
  subtitle,
  date,
  routineItem,
  recommendedActivity,
  preSelectedActivityId,
  programmeId,
  onClose,
  onSave,
  submitButtonText = 'Save',
}) => {
  const { setState, state } = useAppContext();
  const isWalkthrough = state?.run;
  const nextWalkthroughStep = (stepNr: number) => {
    setState({ stepIndex: stepNr });
  };

  // close walk through on last step
  if (state?.run && state.stepIndex === 9) {
    onClose();
  }

  const { isOnline } = useOnlineStatus();
  const languages = useSelector(staticDataSelectors.getLanguages);
  const allThemes = useSelector(programmeThemeSelectors.getProgrammeThemes);
  const subCategories = useSelector(
    progressTrackingSelectors.getProgressTrackingSubCategories()
  );

  const activitiesByType = useSelector(
    activitySelectors.getActivitiesByType(title)
  );

  const programme = useSelector(
    programmeSelectors.getProgrammeById(programmeId)
  );

  const { getSortedActivities } = useProgrammePlanningRecommendations();

  const allActivities = useMemo(() => {
    const activities = activitiesByType.filter(
      (activity) => activity.id !== recommendedActivity?.activity?.id
    );

    return getSortedActivities(activities, programme!, title as ActivityType);
  }, [
    activitiesByType,
    programme,
    recommendedActivity?.activity?.id,
    getSortedActivities,
    title,
  ]);

  const [activities, setActivities] = useState<ActivityDto[]>(allActivities);
  const [filteredActivities, setFilteredActivities] =
    useState<ActivityDto[]>(allActivities);
  const [selectedActivityId, setSelectedActivityId] = useState<
    number | undefined
  >(preSelectedActivityId);
  const [displayHelp, setDisplayHelp] = useState(false);
  const [searchTextActive, setSearchTextActive] = useState(false);
  const dispatch = useAppDispatch();
  const [selectedThemeFilterOptions, setSelectedThemeFilterOptions] =
    useState<SearchDropDownOption<number>[]>();
  const [selectedLanguageFilterOptions, setSelectedLanguageFilterOptions] =
    useState<SearchDropDownOption<string>[]>();

  const [selectedSkillsFilterOptions, setSelectedSkillsFilterOptions] =
    useState<SearchDropDownOption<ProgressTrackingSubCategoryDto>[]>();

  const [pageSize, setPageSize] = useState(ACTIVITY_PAGE_SIZE);

  const duplicatedDailyProgramme = useMemo(() => {
    if (!selectedActivityId) return;

    return programme?.dailyProgrammes?.find((day) => {
      return (
        !isSameDay(parseISO(day.dayDate), date) &&
        isSameWeek(parseISO(day.dayDate), date) &&
        (day.storyActivityId === selectedActivityId ||
          day.smallGroupActivityId === selectedActivityId ||
          day.largeGroupActivityId === selectedActivityId)
      );
    });
  }, [date, programme?.dailyProgrammes, selectedActivityId]);

  const duplicatedActivity = useMemo(() => {
    if (!duplicatedDailyProgramme) return;

    return filteredActivities.find(
      (activity) =>
        activity.id === duplicatedDailyProgramme?.storyActivityId ||
        activity.id === duplicatedDailyProgramme?.smallGroupActivityId ||
        activity.id === duplicatedDailyProgramme?.largeGroupActivityId
    );
  }, [duplicatedDailyProgramme, filteredActivities]);

  const themeDropDownOptions: SearchDropDownOption<number>[] = useMemo(
    () =>
      allThemes.map((theme) => ({
        id: theme.id,
        label: theme.name,
        value: theme.id,
      })),
    [allThemes]
  );

  const skillsDropDownOptions: SearchDropDownOption<ProgressTrackingSubCategoryDto>[] =
    useMemo(
      () =>
        subCategories.map((skill) => ({
          id: skill.id as number,
          label: skill.name,
          value: skill,
        })),
      [subCategories]
    );

  const languagesDropDownOptions = useMemo(() => {
    return languages
      .filter((x) => x.locale?.length > 0)
      .map((language) => ({
        id: language.id || 0,
        label: language.description,
        value: language.locale,
      }));
  }, [languages]);

  const filterInfo: FilterInfo = {
    filterName: 'Theme',
    filterHint: 'You can select to filter by theme',
  };

  const hasActiveFilters =
    !!selectedThemeFilterOptions?.length ||
    !!selectedLanguageFilterOptions?.length ||
    !!selectedSkillsFilterOptions?.length;

  const onHelp = () => {
    setDisplayHelp(true);
  };

  const onSearchChange = (value: string) => {
    if (!value) {
      setFilteredActivities(allActivities);
      return;
    }
    const matchingActicities = allActivities.filter((act) => {
      return act.name && act.name.toLowerCase().includes(value.toLowerCase());
    });

    setFilteredActivities(matchingActicities);
  };

  const onThemeFilterChange = (
    filterOptions: SearchDropDownOption<number>[]
  ) => {
    setSelectedThemeFilterOptions(filterOptions);
    setPageSize(ACTIVITY_PAGE_SIZE);
  };

  const onLanguageFilterChange = (
    filterOptions: SearchDropDownOption<string>[]
  ) => {
    setPageSize(ACTIVITY_PAGE_SIZE);
    setSelectedLanguageFilterOptions(filterOptions);
  };

  const onSkillsFilterChanged = (
    filterOptions: SearchDropDownOption<ProgressTrackingSubCategoryDto>[]
  ) => {
    setSelectedSkillsFilterOptions(filterOptions);
    setPageSize(ACTIVITY_PAGE_SIZE);
  };

  useEffect(() => {
    const programmeTheme = allThemes?.find(
      (theme) => theme.name === programme?.name
    );
    if (programmeTheme) {
      setSelectedThemeFilterOptions([
        {
          id: programmeTheme.id,
          label: programmeTheme.name,
          value: programmeTheme.id,
          disabled: false,
        },
      ]);
    }

    const lang = languages.find(
      (x) => x.locale === programme?.preferredLanguage
    );

    if (lang) {
      setSelectedLanguageFilterOptions([
        {
          id: lang.id,
          label: lang.description,
          value: lang.locale,
          disabled: false,
        },
      ]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    applyFilters(activities);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    selectedThemeFilterOptions,
    activities,
    selectedSkillsFilterOptions,
    title,
  ]);

  useEffect(() => {
    if (selectedLanguageFilterOptions === undefined) return;

    const getActivitiesForLocale = async (locale: string) => {
      const result = await dispatch(
        activityThunkActions.getActivities({ locale })
      ).unwrap();
      const currentActivities =
        filterActivitiesByType(title, result)?.filter(
          (activity) => activity.id !== recommendedActivity?.activity?.id
        ) || [];

      return setActivities(
        getSortedActivities(
          currentActivities,
          programme!,
          title as ActivityType
        )
      );
    };

    if (selectedLanguageFilterOptions.length > 0) {
      getActivitiesForLocale(
        selectedLanguageFilterOptions[0]?.value || 'en-za'
      );
    } else {
      getActivitiesForLocale('en-za');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedLanguageFilterOptions, routineItem]);

  const applyFilters = (activities: ActivityDto[]) => {
    let activitiesCopy = [...activities];

    if (selectedThemeFilterOptions && selectedThemeFilterOptions.length > 0) {
      const selectedTheme = allThemes.find(
        (theme) => theme.id === selectedThemeFilterOptions[0].value
      );
      if (selectedTheme) {
        activitiesCopy = filterActivitiesByTheme(
          activitiesCopy,
          selectedTheme,
          getRoutineItemType(routineItem.name)
        );
      }
    }

    if (selectedSkillsFilterOptions && selectedSkillsFilterOptions.length > 0) {
      activitiesCopy = getProgressTrackingSubCategoryActivities(
        activitiesCopy,
        selectedSkillsFilterOptions[0].value
      );
    }

    if (
      selectedLanguageFilterOptions &&
      selectedLanguageFilterOptions.length > 0 &&
      selectedLanguageFilterOptions[0].value !== 'en-za'
    ) {
      activitiesCopy = activitiesCopy.filter(
        (activity) =>
          activity.availableLanguages &&
          activity.availableLanguages.some(
            (x) => x.id === selectedLanguageFilterOptions[0].id
          )
      );
    }

    setFilteredActivities(activitiesCopy);
  };

  const alternativeSearchHeaderItems: SearchHeaderAlternativeRenderItem<ActivityDto> =
    {
      render: (item) => {
        const isSelected = selectedActivityId === item.id;
        return (
          <ActivityCard
            key={`search-header-activity-${item.id}`}
            activity={item}
            selected={isSelected}
            onSelected={() => {
              setSearchTextActive(false);
              applyFilters(activities);
            }}
            onClose={onClose}
            onDeselection={() => {
              setSelectedActivityId(undefined);
              setSearchTextActive(false);
              applyFilters(activities);
            }}
          />
        );
      },
    };
  return (
    <>
      <BannerWrapper
        showBackground={false}
        size="medium"
        renderBorder={true}
        title={`${title} activity`}
        subTitle={subtitle}
        color={'primary'}
        backgroundColour="white"
        onHelp={onHelp}
        displayHelp
        onBack={onClose}
        displayOffline={!isOnline}
        style={{ zIndex: 100 }}
      >
        <SearchHeader<ActivityDto>
          searchItems={filteredActivities}
          onSearchChange={onSearchChange}
          isTextSearchActive={searchTextActive}
          onBack={() => {
            setSearchTextActive(false);
            applyFilters(activities);
          }}
          heading={`${routineItem?.name} activity`}
          onSearchButtonClick={() => setSearchTextActive(true)}
          alternativeSearchItemRender={alternativeSearchHeaderItems}
        >
          <SearchDropDown<number>
            displayMenuOverlay={true}
            menuItemClassName={'w-11/12 left-4'}
            overlayTopOffset={'2'}
            className={'mr-1'}
            options={themeDropDownOptions}
            selectedOptions={selectedThemeFilterOptions}
            onChange={onThemeFilterChange}
            placeholder={'Theme'}
            color={'quatenary'}
            info={{
              name: `Filter by: ${filterInfo?.filterName}`,
              hint: filterInfo?.filterHint || '',
            }}
          />

          <SearchDropDown<string>
            displayMenuOverlay={true}
            className={'mr-1'}
            menuItemClassName={'w-11/12 left-4'}
            overlayTopOffset={'2'}
            options={languagesDropDownOptions}
            selectedOptions={selectedLanguageFilterOptions}
            onChange={onLanguageFilterChange}
            placeholder={'Language'}
            multiple={false}
            color={'quatenary'}
            info={{
              name: `language:`,
            }}
          />

          <SearchDropDown<ProgressTrackingSubCategoryDto>
            displayMenuOverlay={true}
            menuItemClassName={'w-11/12 left-4'}
            overlayTopOffset={'2'}
            options={skillsDropDownOptions}
            selectedOptions={selectedSkillsFilterOptions}
            onChange={onSkillsFilterChanged}
            placeholder={'Skills'}
            multiple={false}
            color={'quatenary'}
            info={{
              name: `Skills:`,
            }}
          />
        </SearchHeader>
        <div className="bg-white px-4 pt-2 pb-8">
          <Typography
            type="h2"
            text={`Choose a ${title} activity`}
            className={'my-4'}
            color="textDark"
          />
          {!!recommendedActivity && (
            <div id="walkthrough-small-group-activity">
              <ActivityCard
                key={`search-header-activity-${recommendedActivity.activity.id}`}
                activity={recommendedActivity.activity}
                selected={
                  selectedActivityId === recommendedActivity.activity.id
                }
                recommended
                recommendedText={
                  recommendedActivity.subCategory
                    ? `Recommended because you do not have enough <b>${
                        recommendedActivity.subCategory?.name
                      }</b> activities planned for ${getDateRangeText(
                        programme?.startDate,
                        programme?.endDate
                      )}`
                    : 'This is the theme activity for the day!'
                }
                onSelected={() => {
                  if (isWalkthrough) {
                    nextWalkthroughStep(8);
                  }
                  setSelectedActivityId(recommendedActivity.activity?.id);
                  setSearchTextActive(false);
                  applyFilters(activities);
                }}
                onClose={onClose}
                onDeselection={() => {
                  setSelectedActivityId(undefined);
                  setSearchTextActive(false);
                  applyFilters(activities);
                }}
              />
            </div>
          )}

          {hasActiveFilters && filteredActivities.length === 0 && (
            <EmptyActivities
              className="mt-20"
              title={`Sorry, no activities found!`}
              subTitle={
                'Please choose a different theme, skill, and/or language and try again.'
              }
            />
          )}

          {[...filteredActivities].slice(0, pageSize).map((activity) => {
            const isSelected = selectedActivityId === activity.id;
            return (
              <ActivityCard
                key={`activity-search-filtered-card-${activity.id}`}
                activity={activity}
                selected={isSelected}
                onSelected={() => {
                  setSelectedActivityId(activity.id);
                }}
                onClose={onClose}
                onDeselection={() => {
                  setSelectedActivityId(undefined);
                }}
              />
            );
          })}

          {pageSize < filteredActivities.length && (
            <>
              <Button
                size="normal"
                className="my-4 w-full"
                type="outlined"
                color="quatenary"
                text="See more activities"
                textColor="quatenary"
                icon="EyeIcon"
                onClick={() => setPageSize(pageSize + ACTIVITY_PAGE_SIZE)}
              />
            </>
          )}
          {(!hasActiveFilters || filteredActivities.length !== 0) && (
            <Divider className="my-4" dividerType="dashed" />
          )}
          {duplicatedActivity && (
            <Alert
              className="mb-4"
              type="warning"
              title={`You are already doing the activity “${
                duplicatedActivity.name
              }” on ${format(
                parseISO(duplicatedDailyProgramme?.dayDate!),
                'EEEE, d MMM'
              )}.`}
              list={[
                'Remember to include many different activities in your programme!',
              ]}
            />
          )}
          {(!hasActiveFilters || filteredActivities.length !== 0) && (
            <Button
              type="filled"
              className="mb-32 mt-auto w-full"
              color="quatenary"
              icon="SaveIcon"
              text={submitButtonText}
              textColor="white"
              iconPosition="start"
              disabled={
                !selectedActivityId ||
                (hasActiveFilters && filteredActivities.length === 0)
              }
              onClick={() => onSave(selectedActivityId)}
            />
          )}
        </div>
      </BannerWrapper>
      <Dialog
        visible={displayHelp}
        position={DialogPosition.Middle}
        className={'mx-4'}
      >
        <ActionModal
          title={routineItem.name}
          // importantText={`${routineItem.timeSpan} minutes`}
          icon={'InformationCircleIcon'}
          iconColor={'infoDark'}
          iconBorderColor={'infoBb'}
          actionButtons={[
            {
              text: 'Close',
              colour: 'primary',
              onClick: () => setDisplayHelp(false),
              type: 'filled',
              textColour: 'white',
              leadingIcon: 'XIcon',
            },
          ]}
        >
          <Typography
            type="markdown"
            fontSize={'16'}
            text={routineItem.description}
            color={'textDark'}
            className="font-h1 text-textMid mb-2 text-left text-base font-normal"
          />
        </ActionModal>
      </Dialog>
    </>
  );
};

export default ActivitySearch;
