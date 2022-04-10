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
} from '@ecdlink/ui/';
import { useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import SeachHeader, {
  SearchHeaderAlternativeRenderItem,
} from '../../../../../../../components/search-header/search-header';
import { StoryBookTypes } from '@enums/ProgrammeRoutineType';
import { useOnlineStatus } from '@hooks/useOnlineStatus';
import { activitySelectors } from '@store/content/activity';
import { programmeThemeSelectors } from '@store/content/programme-theme';
import { storyBookSelectors } from '@store/content/story-book';
import { programmeSelectors } from '@store/programme';
import { staticDataSelectors } from '@store/static-data';
import { filterStorybooksByTheme } from '../../../../../../../utils/classroom/programme-planning/activity-search.utils';
import { EmptyActivities } from '../../components/empty-activity-filter-result/empty-activity-filter-result';

import StoryCard from '../story-card/story-card';
import { StoryActivitySelectView } from './components/story-activity-select-view/story-activity-select-view';
import { StorySelectView } from './components/story-select-view/story-select-view';
import { StoryActivitySearchProps } from './story-activity-search.types';

export const StoryActivitySearch: React.FC<StoryActivitySearchProps> = ({
  title,
  subtitle,
  routineItem,
  preSelectedStoryId,
  programmeId,
  preSelectedActivityId,
  onClose,
  onSave,
  submitButtonText = 'Save',
}) => {
  const { isOnline } = useOnlineStatus();
  const allStories = useSelector(storyBookSelectors.getStoryBooks);
  const [filteredStories, setFilteredStories] = useState<StoryBookDto[]>(allStories);
  const [selectedStory, setSelectedStory] = useState<StoryBookDto>();
  const [selectedActivity, setSelectedActivity] = useState<ActivityDto>();
  const preSelectedActivity = useSelector(activitySelectors.getActivityById(preSelectedActivityId));
  const programme = useSelector(programmeSelectors.getProgrammeById(programmeId));

  const [searchTextActive, setSearchTextActive] = useState(false);
  const [selectedThemeFilterOptions, setSelectedThemeFilterOptions] =
    useState<SearchDropDownOption<number>[]>();

  const [selectedLanguageFilterOptions, setSelectedLanguageFilterOptions] =
    useState<SearchDropDownOption<string>[]>();
  const [selectedTypeFilterOptions, setSelectedTypeFilterOptions] =
    useState<SearchDropDownOption<StoryBookTypes>[]>();

  const [displayHelp, setDisplayHelp] = useState(false);
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
  const categoriesDropDownOptions: SearchDropDownOption<number>[] = allThemes.map((theme) => ({
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
      setSelectedThemeFilterOptions([{ id: theme.id, label: theme.name, value: theme.id }]);
    }

    const lang = languages?.find((x) => x.locale === programme?.preferredLanguage);

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
    applyFilters(allStories);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedLanguageFilterOptions, selectedThemeFilterOptions, selectedTypeFilterOptions]);

  const applyFilters = (allStories: StoryBookDto[]) => {
    let allStoriesCopy = [...allStories];
    if (selectedThemeFilterOptions && selectedThemeFilterOptions.length > 0) {
      const selectedTheme = allThemes.find(
        (theme) => theme.id === selectedThemeFilterOptions[0].value
      );
      if (selectedTheme) {
        allStoriesCopy = filterStorybooksByTheme(allStoriesCopy, selectedTheme);
      }
    }

    if (selectedLanguageFilterOptions && selectedLanguageFilterOptions.length > 0) {
      allStoriesCopy = allStoriesCopy.filter((story) =>
        story.availableLanguages.some((x) => x.id === selectedLanguageFilterOptions[0].id)
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

    setFilteredStories(allStoriesCopy);
  };

  const onHelp = () => {
    setDisplayHelp(true);
  };

  const onSearchChange = (value: string) => {
    if (!value) {
      applyFilters(allStories);
      return;
    }

    const matchingActicities = allStories.filter((story) =>
      story.name.toLowerCase().includes(value)
    );

    setFilteredStories(matchingActicities);
    setSearchTextActive(true);
  };

  const onThemeFilterChange = (filterOptions: SearchDropDownOption<number>[]) => {
    setSelectedThemeFilterOptions(filterOptions);
  };

  const onLanguageFilterChange = (filterOptions: SearchDropDownOption<string>[]) => {
    setSelectedLanguageFilterOptions(filterOptions);
  };

  const onTypeFilterChange = (filterOptions: SearchDropDownOption<StoryBookTypes>[]) => {
    setSelectedTypeFilterOptions(filterOptions);
  };

  const alternativeSearchHeaderItems: SearchHeaderAlternativeRenderItem<StoryBookDto> = {
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
            applyFilters(allStories);
          }}
          onCleared={() => {
            setSelectedStory(undefined);
            setSelectedActivity(undefined);
            setSearchTextActive(false);
            applyFilters(allStories);
          }}
          onActivityCleared={() => setSelectedActivity(undefined)}
          selected={selectedStory?.id === item.id}
          title={item.name}
          type={item.type}
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
        title={title}
        subTitle={subtitle}
        color={'primary'}
        backgroundColour="uiBg"
        displayHelp
        onHelp={onHelp}
        onBack={onClose}
        displayOffline={!isOnline}
      >
        <SeachHeader<any>
          searchItems={filteredStories}
          onSearchChange={onSearchChange}
          isTextSearchActive={searchTextActive}
          heading={'Story books'}
          onBack={() => {
            setSearchTextActive(false);
            applyFilters(allStories);
          }}
          onSearchButtonClick={() => setSearchTextActive(true)}
          alternativeSearchItemRender={alternativeSearchHeaderItems}
        >
          <SearchDropDown<number>
            displayMenuOverlay={true}
            menuItemClassName={'w-11/12 left-4 '}
            overlayTopOffset={'120'}
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
            menuItemClassName={'w-11/12 left-4 h-60 overflow-y-scroll'}
            overlayTopOffset={'120'}
            options={languagesDropDownOptions}
            selectedOptions={selectedLanguageFilterOptions}
            onChange={onLanguageFilterChange}
            placeholder={'Language'}
            multiple={false}
            color={'uiMidDark'}
            info={{
              name: `Langauge:`,
            }}
          />

          <SearchDropDown<StoryBookTypes>
            displayMenuOverlay={true}
            menuItemClassName={'w-11/12 left-4 h-60 overflow-y-scroll'}
            overlayTopOffset={'120'}
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
        </SeachHeader>
        <div className="h-full px-4 pt-2 mb-32">
          {!selectedStory && (
            <>
              {hasActiveFilters && filteredStories.length === 0 && (
                <EmptyActivities
                  title="Sorry, we couldn't find any activities!"
                  subTitle="Please choose a different theme, language, and/or type and try again."
                />
              )}
              <StorySelectView
                stories={filteredStories}
                onStorySelected={(story) => setSelectedStory(story)}
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
            />
          )}
          <Divider className="my-2" />

          <Button
            type="filled"
            className="w-full"
            color="primary"
            icon="SaveIcon"
            text={submitButtonText}
            textColor="white"
            iconPosition="start"
            disabled={!selectedStory || !selectedActivity}
            onClick={() => onSave(selectedStory?.id, selectedActivity?.id)}
          />
        </div>
      </BannerWrapper>
      <Dialog visible={displayHelp} position={DialogPosition.Middle} stretch className="px-4">
        <ActionModal
          title={'Story & activity'}
          importantText={`${routineItem.timeSpan} minutes`}
          detailText={routineItem.description}
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
        ></ActionModal>
      </Dialog>
    </>
  );
};
