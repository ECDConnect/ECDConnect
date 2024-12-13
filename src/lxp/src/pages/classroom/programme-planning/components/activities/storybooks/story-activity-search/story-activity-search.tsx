import { ActivityDto, StoryBookDto } from '@ecdlink/core/';
import {
  ActionModal,
  BannerWrapper,
  Button,
  Dialog,
  DialogPosition,
  Divider,
  FilterInfo,
  SearchDropDown,
  SearchDropDownOption,
  Typography,
} from '@ecdlink/ui/';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import SearchHeader, {
  SearchHeaderAlternativeRenderItem,
} from '../../../../../../../components/search-header/search-header';
import { StoryBookTypes } from '@enums/ProgrammeRoutineType';
import { useOnlineStatus } from '@hooks/useOnlineStatus';
import { activitySelectors } from '@store/content/activity';
import { programmeThemeSelectors } from '@store/content/programme-theme';
import { storyBookSelectors } from '@store/content/story-book';
import { programmeSelectors } from '@store/programme';
import { staticDataSelectors } from '@store/static-data';
import { filterStorybooksByTheme } from '@utils/classroom/programme-planning/activity-search.utils';
import { EmptyActivities } from '../../components/empty-activity-filter-result/empty-activity-filter-result';

import StoryCard from '../story-card/story-card';
import { StoryActivitySelectView } from './components/story-activity-select-view/story-activity-select-view';
import { StorySelectView } from './components/story-select-view/story-select-view';
import { StoryActivitySearchProps } from './story-activity-search.types';

export const StoryActivitySearch: React.FC<StoryActivitySearchProps> = ({
  subtitle,
  routineItem,
  preSelectedStoryId,
  programmeId,
  preSelectedActivityId,
  onClose,
  onSave,
}) => {
  const { isOnline } = useOnlineStatus();
  const allStories = useSelector(storyBookSelectors.getStoryBooks);
  const allActivities = useSelector(activitySelectors.getActivities);
  const [filteredStories, setFilteredStories] =
    useState<StoryBookDto[]>(allStories);
  const [filteredActivities, setFilteredActivities] =
    useState<ActivityDto[]>(allActivities);
  const [selectedStory, setSelectedStory] = useState<StoryBookDto>();
  const [selectedActivity, setSelectedActivity] = useState<ActivityDto>();
  const preSelectedActivity = useSelector(
    activitySelectors.getActivityById(preSelectedActivityId)
  );
  const programme = useSelector(
    programmeSelectors.getProgrammeById(programmeId)
  );
  const [searchTextActive, setSearchTextActive] = useState(false);
  const [selectedThemeFilterOptions, setSelectedThemeFilterOptions] =
    useState<SearchDropDownOption<number>[]>();

  const [selectedLanguageFilterOptions, setSelectedLanguageFilterOptions] =
    useState<SearchDropDownOption<string>[]>();
  const [selectedTypeFilterOptions, setSelectedTypeFilterOptions] =
    useState<SearchDropDownOption<StoryBookTypes>[]>();

  const [displayHelp, setDisplayHelp] = useState(false);
  const [bookedStory, setBookedStory] = useState<StoryBookDto>();

  const showNextButton = selectedStory ? !!selectedActivity : !!bookedStory;
  const languages = useSelector(staticDataSelectors.getLanguages);
  const allThemes = useSelector(programmeThemeSelectors.getProgrammeThemes);
  const StoryTypeOptions = [
    {
      id: 1,
      label: 'Story book',
      value: StoryBookTypes.storyBook,
    },
    {
      id: 2,
      label: 'Read aloud',
      value: StoryBookTypes.readAloud,
    },
    {
      id: 3,
      label: 'Other',
      value: StoryBookTypes.other,
    },
  ];
  const categoriesDropDownOptions: SearchDropDownOption<number>[] =
    allThemes.map((theme) => ({
      id: theme.id,
      label: theme.name,
      value: theme.id,
    }));

  const hasActiveFilters =
    !!selectedThemeFilterOptions?.length ||
    !!selectedLanguageFilterOptions?.length ||
    !!selectedTypeFilterOptions?.length;

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
    filterHint: 'You can select a theme to filter by',
  };

  useEffect(() => {
    const theme = allThemes?.find((x) => x.name === programme?.name);

    if (theme) {
      setSelectedThemeFilterOptions([
        { id: theme.id, label: theme.name, value: theme.id },
      ]);
    }

    const lang = languages?.find(
      (x) => x.locale === programme?.preferredLanguage
    );

    if (lang) {
      setSelectedLanguageFilterOptions([
        { id: lang.id, label: lang.description, value: lang.locale },
      ]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (preSelectedStoryId && allStories) {
      const story = allStories.find((story) => story.id === preSelectedStoryId);

      if (story) {
        setSelectedStory(story);
      }

      if (preSelectedActivityId && preSelectedActivity) {
        setSelectedActivity(preSelectedActivity);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [preSelectedStoryId, preSelectedActivityId]);

  useEffect(() => {
    applyFilters(allStories, allActivities);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    selectedLanguageFilterOptions,
    selectedThemeFilterOptions,
    selectedTypeFilterOptions,
    selectedStory,
  ]);

  const applyFilters = (
    allStories: StoryBookDto[],
    allActivities: ActivityDto[]
  ) => {
    let allStoriesCopy = [...allStories];
    let allActivitiesCopy = [...allActivities];
    if (selectedThemeFilterOptions && selectedThemeFilterOptions.length > 0) {
      const selectedTheme = allThemes.find(
        (theme) => theme.id === selectedThemeFilterOptions[0].value
      );
      if (selectedTheme) {
        allStoriesCopy = filterStorybooksByTheme(allStoriesCopy, selectedTheme);
      }
    }

    if (
      selectedLanguageFilterOptions &&
      selectedLanguageFilterOptions.length > 0 &&
      selectedLanguageFilterOptions[0].value !== 'en-za'
    ) {
      allStoriesCopy = allStoriesCopy.filter(
        (story) =>
          story.availableLanguages &&
          story.availableLanguages.some(
            (x) => x.id === selectedLanguageFilterOptions[0].id
          )
      );
      allActivitiesCopy = allActivitiesCopy.filter(
        (activity) =>
          activity.availableLanguages &&
          activity.availableLanguages.some(
            (x) => !!x && x.id === selectedLanguageFilterOptions[0].id
          )
      );
    }

    if (selectedTypeFilterOptions && selectedTypeFilterOptions.length > 0) {
      allStoriesCopy = allStoriesCopy.filter((story) =>
        selectedTypeFilterOptions
          ?.map((opt) => {
            return opt.value.toString();
          })
          .includes(story.type)
      );
    }

    if (selectedStory) {
      allActivitiesCopy = allActivitiesCopy.filter(
        (act) =>
          act.subType &&
          act.subType?.toLowerCase()?.includes(selectedStory.type.toLowerCase())
      );
    }

    setFilteredStories(allStoriesCopy);
    setFilteredActivities(allActivitiesCopy);
  };

  const onHelp = () => {
    setDisplayHelp(true);
  };

  const onSearchChange = (value: string) => {
    if (!value) {
      applyFilters(allStories, allActivities);
      return;
    }

    const matchingActicities = allStories.filter((story) =>
      story.name.toLowerCase().includes(value)
    );

    setFilteredStories(matchingActicities);
    setSearchTextActive(true);
  };

  const onThemeFilterChange = (
    filterOptions: SearchDropDownOption<number>[]
  ) => {
    setSelectedThemeFilterOptions(filterOptions);
  };

  const onLanguageFilterChange = (
    filterOptions: SearchDropDownOption<string>[]
  ) => {
    setSelectedLanguageFilterOptions(filterOptions);
  };

  const onTypeFilterChange = (
    filterOptions: SearchDropDownOption<StoryBookTypes>[]
  ) => {
    setSelectedTypeFilterOptions(filterOptions);
  };

  const setSelectedStoryHandler = useCallback(
    (story: StoryBookDto | undefined) => {
      if (story) {
        setBookedStory(story);
      } else {
        setBookedStory(undefined);
      }
    },
    [setBookedStory]
  );

  const onButtonClick = useCallback(() => {
    if (!selectedStory && bookedStory) {
      setSelectedStory(bookedStory);
    }

    if (selectedStory?.id && selectedActivity?.id) {
      onSave(selectedStory?.id, selectedActivity?.id);
    }
  }, [selectedStory, selectedActivity, bookedStory, onSave]);

  const alternativeSearchHeaderItems: SearchHeaderAlternativeRenderItem<StoryBookDto> =
    {
      render: (item) => {
        return (
          <StoryCard
            key={item.id}
            className={'mt-2'}
            storyBookId={item.id}
            languages={item.availableLanguages}
            onSelected={() => {
              setSelectedStory(item);
              setSearchTextActive(false);
              applyFilters(allStories, allActivities);
            }}
            onCleared={() => {
              setSelectedStory(undefined);
              setSelectedActivity(undefined);
              setSearchTextActive(false);
              applyFilters(allStories, allActivities);
            }}
            onActivityCleared={() => setSelectedActivity(undefined)}
            selected={selectedStory?.id === item.id}
            title={item.name}
            type={item.type}
          />
        );
      },
    };

  useEffect(() => {
    const element = document.getElementById('story-content');

    element?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
      inline: 'nearest',
    });
  }, [selectedStory]);

  return (
    <>
      <BannerWrapper
        showBackground={false}
        size="medium"
        renderBorder={true}
        title="Story & activity"
        subTitle={subtitle}
        color={'primary'}
        backgroundColour="uiBg"
        displayHelp
        onHelp={onHelp}
        onBack={onClose}
        displayOffline={!isOnline}
      >
        {!selectedStory && (
          <SearchHeader<any>
            searchItems={filteredStories}
            onSearchChange={onSearchChange}
            isTextSearchActive={searchTextActive}
            heading={'Story books'}
            onBack={() => {
              setSearchTextActive(false);
              applyFilters(allStories, allActivities);
            }}
            onSearchButtonClick={() => setSearchTextActive(true)}
            alternativeSearchItemRender={alternativeSearchHeaderItems}
          >
            <SearchDropDown<number>
              displayMenuOverlay={true}
              menuItemClassName={'w-11/12 left-4'}
              overlayTopOffset={'2'}
              className={'mr-1'}
              options={categoriesDropDownOptions}
              selectedOptions={selectedThemeFilterOptions}
              onChange={onThemeFilterChange}
              placeholder={'Theme'}
              color={'uiMidDark'}
              info={{
                name: `Filter by:${filterInfo?.filterName}`,
                hint: filterInfo?.filterHint || '',
              }}
            />

            <SearchDropDown<string>
              className={'mr-1'}
              displayMenuOverlay={true}
              menuItemClassName={'w-11/12 left-4'}
              overlayTopOffset={'2'}
              options={languagesDropDownOptions}
              selectedOptions={selectedLanguageFilterOptions}
              onChange={onLanguageFilterChange}
              placeholder={'Language'}
              multiple={false}
              color={'uiMidDark'}
              info={{
                name: `Language:`,
              }}
            />

            <SearchDropDown<StoryBookTypes>
              displayMenuOverlay={true}
              menuItemClassName={'w-11/12 left-4'}
              overlayTopOffset={'2'}
              options={StoryTypeOptions}
              selectedOptions={selectedTypeFilterOptions}
              onChange={onTypeFilterChange}
              placeholder={'Type'}
              multiple={false}
              color={'uiMidDark'}
              info={{
                name: `Type:`,
              }}
            />
          </SearchHeader>
        )}
        <div className="bg-white px-4 pt-2" id="story-content">
          {!selectedStory && (
            <>
              <Typography
                type="h2"
                text={`Choose a story`}
                color="textDark"
                className={'mt-4'}
              />
              <Typography
                type="h4"
                color="textMid"
                text="Step 1 of 2"
                className="mb-4"
              />
              {hasActiveFilters && filteredStories.length === 0 && (
                <EmptyActivities
                  className="mt-20"
                  title="Sorry, no activities found!"
                  subTitle="Please choose a different theme, language, and/or type and try again."
                />
              )}
              <StorySelectView
                stories={filteredStories}
                selectedStoryBookId={bookedStory?.id!}
                onStorySelected={(story) => setSelectedStoryHandler(story)}
              />
            </>
          )}
          {selectedStory && (
            <StoryActivitySelectView
              story={selectedStory}
              programmeId={programmeId}
              selectedActivityId={selectedActivity?.id}
              onActivityCleared={() => setSelectedActivity(undefined)}
              onClearStory={() => {
                setSelectedStory(undefined);
                setSelectedActivity(undefined);
              }}
              onActivitySelected={(activity?: ActivityDto) => {
                setSelectedActivity(activity);
              }}
              setSelectedStory={setSelectedStory}
              filteredActivities={filteredActivities}
            />
          )}
          {(!hasActiveFilters || filteredStories.length !== 0) && (
            <div className="mt-auto w-full">
              {!selectedStory && (
                <Divider className="mt-8" dividerType="dashed" />
              )}
              <Button
                type="filled"
                className="mb-32 mt-8 w-full"
                color="quatenary"
                icon="SaveIcon"
                text="Save"
                textColor="white"
                iconPosition="start"
                onClick={() => {
                  onButtonClick();
                }}
                disabled={!showNextButton}
              />
            </div>
          )}
        </div>
      </BannerWrapper>
      <Dialog
        visible={displayHelp}
        position={DialogPosition.Middle}
        className="px-4"
      >
        <ActionModal
          title={'Story & activity'}
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
