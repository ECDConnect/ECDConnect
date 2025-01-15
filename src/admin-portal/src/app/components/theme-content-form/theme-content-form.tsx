import { gql, useQuery } from '@apollo/client';
import {
  ContentDefinitionModelDto,
  ContentValueDto,
  camelCaseToSentanceCase,
} from '@ecdlink/core';
import {
  CheckboxGroup,
  Dropdown,
  SearchDropDownOption,
  Typography,
  LoadingSpinner,
} from '@ecdlink/ui';
import { useEffect, useMemo, useState } from 'react';
import { FieldType } from '../../pages/content-management/content-management-models';
import Pagination from '../pagination/pagination';
import { Colours } from '@ecdlink/ui';

export interface DynamicSelectorProps {
  contentValue?: ContentValueDto;
  languageId?: string;
  title?: string;
  optionDefinition?: ContentDefinitionModelDto;
  isReview: boolean;
  setSelectedItems?: (value: string) => void;
  isSkillType?: boolean;
  setFilteredThemeDays?: (item: any[]) => void;
  setHasUnsharedContent: (value: boolean) => void;
}

const smallLargeActivitiesQuery = gql`
  query GetAllActivity($localeId: String) {
    GetAllActivity(localeId: $localeId) {
      id
      shareContent
      availableLanguages {
        id
      }
      subCategories {
        id
        name
      }
      themes {
        id
        name
      }
      subType
      type
      description
      name
    }
  }
`;

const storiesActivitiesQuery = gql`
  query GetAllStoryBook($localeId: String) {
    GetAllStoryBook(localeId: $localeId) {
      id
      availableLanguages {
        id
        __typename
      }
      keywords
      storyBookParts {
        id
        __typename
      }
      bookLocation
      illustrator
      author
      type
      name
      __typename
    }
  }
`;

export enum ThemeStoryTypes {
  storyBook = 'Story book',
  smallGroup = 'Small group',
  largeGroup = 'Large group',
  storyActivity = 'Story Activity',
}

const ThemeContentSelector: React.FC<DynamicSelectorProps> = ({
  contentValue,
  languageId,
  title,
  optionDefinition,
  isReview,
  setSelectedItems,
  isSkillType,
  setFilteredThemeDays,
  setHasUnsharedContent,
}) => {
  const fields =
    optionDefinition?.fields?.map((x) => {
      if (x.dataType !== FieldType.Link && x.dataType !== FieldType.StaticLink)
        return x.name;
      else if (
        x.name === 'smallGroupActivity' ||
        x.name === 'largeGroupActivity' ||
        x.name === 'storyActivity' ||
        x.name === 'storyBook'
      )
        return `
        ${x.name} {
          id
          shareContent
        }
      `;
      else
        return `
      ${x.name} {
        id
      }
    `;
    }) ?? [];

  const getAllCall = `GetAll${optionDefinition?.contentName}`;
  const totalDays = 20;

  const [tempData, setTempData] = useState<any[]>([]);
  const tempDataArr = useMemo(() => tempData?.slice(0, totalDays), [tempData]);
  const [tableData, setTableData] = useState<any[]>([]);
  const arr = contentValue?.value?.split(',');
  const currentTempData = tempData
    ?.filter((item) => arr?.includes(String(item?.id)))
    .slice(0, totalDays);
  const [handleInitialState, setHandleInitialState] = useState(true);
  const [currentThemeDaysArr, setCurrentThemeDaysArr] = useState([]);
  const [themeDaysArr, setThemeDaysArr] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (themeDaysArr?.length > 0) {
      setFilteredThemeDays(themeDaysArr);
    }
  }, [setFilteredThemeDays, themeDaysArr]);

  const [currentIds, setCurrentIds] = useState<string[]>();

  const query = gql` 
    query ${getAllCall} ($localeId: String) {
      ${getAllCall} (localeId: $localeId) {
        id
        ${fields.join('\n')}
        }
      }
  `;

  const { data: contentData } = useQuery(query, {
    fetchPolicy: 'network-only',
    variables: {
      localeId: languageId?.toString(),
    },
  });

  const { data: storyActivitiesData } = useQuery(smallLargeActivitiesQuery, {
    fetchPolicy: 'network-only',
    variables: {
      localeId: languageId?.toString(),
    },
  });

  const { data: storyBookActivitiesData } = useQuery(storiesActivitiesQuery, {
    fetchPolicy: 'network-only',
    variables: {
      localeId: languageId?.toString(),
    },
  });

  const smallGroupOptions: SearchDropDownOption<any>[] =
    storyActivitiesData?.GetAllActivity?.filter(
      (activity) => activity?.type === 'Small group'
    )?.map((item) => ({
      id: item?.id,
      label: item?.name,
      value: item?.id,
    }));

  const largeGroupOptions: SearchDropDownOption<string>[] =
    storyActivitiesData?.GetAllActivity?.filter(
      (activity) => activity?.type === 'Large group'
    )?.map((item) => ({
      id: item?.id,
      label: item?.name,
      value: item?.id,
    }));

  const storyTimeOptions: SearchDropDownOption<string>[] =
    storyActivitiesData?.GetAllActivity?.filter(
      (activity) => activity?.type === 'Story time'
    )?.map((item) => ({
      id: item?.id,
      label: item?.name,
      value: item?.id,
    }));

  const storyBookOptions: SearchDropDownOption<string>[] =
    storyBookActivitiesData?.GetAllStoryBook?.map((item) => ({
      id: item?.id,
      label: item?.name,
      value: item?.id,
    }));

  const [displayFields, setDisplayFields] = useState<string[]>();

  useEffect(() => {
    if (optionDefinition && optionDefinition.fields) {
      const displayFields: string[] = [];

      optionDefinition.fields?.forEach((x) => {
        if (x.dataType !== 'link' && displayFields.length < 2)
          displayFields.push(x.name);
      });

      setDisplayFields(displayFields);
    }
  }, [optionDefinition]);

  useEffect(() => {
    if (contentValue) {
      const ids = contentValue?.value?.split(',');
      setCurrentIds(ids);
    }
  }, [contentValue]);

  useEffect(() => {
    if (contentData && contentData[getAllCall]) {
      if (isReview) {
        const data = contentData[getAllCall].filter((x) =>
          currentIds?.some((z) => z === x.id.toString())
        );
        setTempData(data);
      } else {
        setTempData(contentData[getAllCall]);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contentData, isReview, currentIds]);

  const selectItem = (id: string) => {
    id = id.toString();
    const copy = Object.assign([], currentIds);

    const currentIndex = currentIds?.findIndex((x) => x === id) ?? -1;
    if (currentIndex > -1) {
      copy.splice(currentIndex, 1);
    } else {
      copy.push(id);
    }

    setCurrentIds(copy);

    if (copy && setSelectedItems) {
      const returnString = copy.join(',') ?? '';

      setSelectedItems(returnString);
    }
  };

  const getFillColor = (idx, storyType) => {
    const tempArray = [...themeDaysArr];
    const item = { ...tempArray[idx] };
    const activity =
      storyType === ThemeStoryTypes?.smallGroup
        ? item?.smallGroupActivity
        : storyType === ThemeStoryTypes?.largeGroup
        ? item?.largeGroupActivity
        : storyType === ThemeStoryTypes?.storyActivity
        ? item?.storyActivity
        : storyType === ThemeStoryTypes?.storyBook
        ? item?.storyBook
        : null;

    if (activity === undefined) {
      return 'alertMain' as Colours;
    }
    return 'successMain' as Colours;
  };

  const handleGroupChange = (e, idx, storyType) => {
    const tempArray = [...themeDaysArr];
    const item = { ...tempArray[idx] };

    if (storyType === ThemeStoryTypes?.smallGroup) {
      item.smallGroupActivity = e?.[0]?.id;
    }

    if (storyType === ThemeStoryTypes?.largeGroup) {
      item.largeGroupActivity = e?.[0]?.id;
    }

    if (storyType === ThemeStoryTypes?.storyActivity) {
      item.storyActivity = e?.[0]?.id;
    }

    if (storyType === ThemeStoryTypes?.storyBook) {
      item.storyBook = e?.[0]?.id;
    }
    item.idx = idx;
    tempArray[idx] = item;
    setThemeDaysArr(tempArray);
  };

  useEffect(() => {
    if (currentTempData?.length > 0 && handleInitialState) {
      setCurrentThemeDaysArr(currentTempData);
      setHandleInitialState(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentTempData]);

  useEffect(() => {
    if (currentThemeDaysArr?.length > 0) {
      setThemeDaysArr(currentThemeDaysArr);
    }
  }, [currentThemeDaysArr]);

  useEffect(() => {
    if (smallGroupOptions?.length > 0 && largeGroupOptions?.length > 0) {
      setLoading(false);
    }
  }, [themeDaysArr, smallGroupOptions, largeGroupOptions]);

  if (tempData && displayFields) {
    if (isSkillType) {
      return (
        <div>
          <Typography
            type={'body'}
            weight={'bold'}
            color={'textMid'}
            text={
              title ??
              camelCaseToSentanceCase(optionDefinition?.contentName ?? '')
            }
          />
          <Typography
            type={'body'}
            color={'textMid'}
            text={
              'You must choose exactly 2 skills from the list below. To change your selection, deselect the skills and choose a new pair.'
            }
          />

          <div className="mt-4 overflow-scroll border-b border-gray-200 shadow sm:rounded-lg">
            {tableData &&
              tableData.map((item: any, idx: number) => {
                const maximumItemsChecked = tableData.filter((x) =>
                  currentIds?.includes(x.id?.toString())
                );
                const itemChecked = currentIds?.some(
                  (x) => x === item?.id?.toString()
                );
                return (
                  <CheckboxGroup
                    key={`checkbox_` + idx}
                    checkboxColor="primary"
                    id={item?.title}
                    image={item?.imageUrl}
                    title={item?.name}
                    description={item?.description}
                    checked={itemChecked}
                    value={item?.title}
                    onChange={() => selectItem(item?.id)}
                    className="bg-secondary mb-1 w-full"
                    disabled={maximumItemsChecked?.length === 2 && !itemChecked}
                  />
                );
              })}

            <Pagination
              recordsPerPage={8}
              items={tempData}
              responseData={setTableData}
            />
          </div>
        </div>
      );
    }
    if (loading) {
      return (
        <div>
          <LoadingSpinner
            size="medium"
            spinnerColor="adminPortalBg"
            backgroundColor="secondary"
          />
        </div>
      );
    } else {
      return (
        <div>
          <Typography
            type={'body'}
            weight={'bold'}
            color={'textMid'}
            text={'Choose activities for each theme day *'}
          />
          {(title === 'C T F35 - theme Days' || title === 'theme Days') && (
            <Typography
              type={'body'}
              color={'textMid'}
              text={
                'Every theme must have ' +
                totalDays +
                ' planned days (Fridays are Mahala - practitioners choose their own activities). Please make sure all activities and stories have been added to the admin portal before you search for them here.'
              }
            />
          )}

          <div className="mt-4 sm:rounded-lg">
            {tableData &&
              themeDaysArr &&
              smallGroupOptions &&
              largeGroupOptions &&
              storyBookOptions &&
              storyTimeOptions &&
              tableData.map((item: any, idx: number) => (
                <div
                  className="justify-left flex items-center"
                  key={'themes_' + idx}
                >
                  <Typography
                    type={'body'}
                    text={`Day ${idx + 1}`}
                    weight="normal"
                    color={'textDark'}
                    className={`${idx === 0 ? 'mt-8' : 'mt-2'} w-1/12`}
                  />
                  <div className="grid grid-cols-4 gap-4">
                    <div className="w-22 text-small">
                      {idx === 0 ? (
                        <Typography
                          type={'h4'}
                          text={'Small group activity'}
                          weight="normal"
                          color={'textDark'}
                          className="my-2"
                        />
                      ) : (
                        <div className="mt-1"></div>
                      )}
                      <Dropdown<any>
                        placeholder={'Type to search...'}
                        list={smallGroupOptions}
                        fillType="outlined"
                        fillColor={getFillColor(
                          idx,
                          ThemeStoryTypes?.smallGroup
                        )}
                        textColor="textDark"
                        fullWidth
                        className="text-small w-56"
                        selectedValue={
                          smallGroupOptions?.filter(
                            (option) =>
                              option?.id ===
                              themeDaysArr?.[idx]?.smallGroupActivity?.[0]?.id
                          )?.length > 0
                            ? smallGroupOptions?.find(
                                (option) =>
                                  option?.id ===
                                  themeDaysArr?.[idx]?.smallGroupActivity?.[0]
                                    ?.id
                              ).id
                            : smallGroupOptions?.find(
                                (option) =>
                                  option?.id ===
                                  themeDaysArr?.[idx]?.smallGroupActivity
                              )?.id
                        }
                        showSearch
                        onChange={(e: string | string[]) => {
                          const newItem = smallGroupOptions?.filter(
                            (item) => item?.id === e
                          );
                          handleGroupChange(
                            newItem,
                            idx,
                            ThemeStoryTypes?.smallGroup
                          );
                        }}
                      />
                    </div>
                    <div className="w-22">
                      {idx === 0 ? (
                        <Typography
                          type={'h4'}
                          text={'Large group activity'}
                          weight="normal"
                          color={'textDark'}
                          className="my-2"
                        />
                      ) : (
                        <div className="mt-1"></div>
                      )}
                      <Dropdown<any>
                        placeholder={'Type to search...'}
                        list={largeGroupOptions}
                        fillType="outlined"
                        fillColor={getFillColor(
                          idx,
                          ThemeStoryTypes?.largeGroup
                        )}
                        textColor="textDark"
                        fullWidth
                        className="w-56 text-sm"
                        selectedValue={
                          largeGroupOptions?.filter(
                            (option) =>
                              option?.id ===
                              themeDaysArr?.[idx]?.largeGroupActivity?.[0]?.id
                          )?.length > 0
                            ? largeGroupOptions?.find(
                                (option) =>
                                  option?.id ===
                                  themeDaysArr?.[idx]?.largeGroupActivity?.[0]
                                    ?.id
                              ).id
                            : largeGroupOptions?.find(
                                (option) =>
                                  option?.id ===
                                  themeDaysArr?.[idx]?.largeGroupActivity
                              )?.id
                        }
                        showSearch
                        onChange={(e: string | string[]) => {
                          const newItem = largeGroupOptions?.filter(
                            (item) => item?.id === e
                          );
                          handleGroupChange(
                            newItem,
                            idx,
                            ThemeStoryTypes?.largeGroup
                          );
                        }}
                      />
                    </div>
                    <div className="w-22">
                      {idx === 0 ? (
                        <Typography
                          type={'h4'}
                          text={'Story'}
                          weight="normal"
                          color={'textDark'}
                          className="my-2"
                        />
                      ) : (
                        <div className="mt-1"></div>
                      )}
                      <Dropdown<any>
                        placeholder={'Type to search...'}
                        list={storyBookOptions}
                        fillType="outlined"
                        fillColor={getFillColor(
                          idx,
                          ThemeStoryTypes?.storyBook
                        )}
                        textColor="textDark"
                        fullWidth
                        className="w-56 text-sm"
                        selectedValue={
                          storyBookOptions?.filter(
                            (option) =>
                              option?.id ===
                              themeDaysArr?.[idx]?.storyBook?.[0]?.id
                          )?.length > 0
                            ? storyBookOptions?.find(
                                (option) =>
                                  option?.id ===
                                  themeDaysArr?.[idx]?.storyBook?.[0]?.id
                              ).id
                            : storyBookOptions?.find(
                                (option) =>
                                  option?.id === themeDaysArr?.[idx]?.storyBook
                              )?.id
                        }
                        showSearch
                        onChange={(e: string | string[]) => {
                          const newItem = storyBookOptions?.filter(
                            (item) => item?.id === e
                          );
                          handleGroupChange(
                            newItem,
                            idx,
                            ThemeStoryTypes?.storyBook
                          );
                        }}
                      />
                    </div>
                    <div className="w-22">
                      {idx === 0 ? (
                        <Typography
                          type={'h4'}
                          text={'Story activity'}
                          weight="normal"
                          color={'textDark'}
                          className="my-2"
                        />
                      ) : (
                        <div className="mt-1"></div>
                      )}
                      <Dropdown<any>
                        placeholder={'Type to search...'}
                        list={storyTimeOptions}
                        fillType="outlined"
                        fillColor={getFillColor(
                          idx,
                          ThemeStoryTypes?.storyActivity
                        )}
                        textColor="textDark"
                        fullWidth
                        className="w-56 text-sm"
                        selectedValue={
                          storyTimeOptions?.filter(
                            (option) =>
                              option?.id ===
                              themeDaysArr?.[idx]?.storyActivity?.[0]?.id
                          )?.length > 0
                            ? storyTimeOptions?.find(
                                (option) =>
                                  option?.id ===
                                  themeDaysArr?.[idx]?.storyActivity?.[0]?.id
                              ).id
                            : storyTimeOptions?.find(
                                (option) =>
                                  option?.id ===
                                  themeDaysArr?.[idx]?.storyActivity
                              )?.id
                        }
                        showSearch
                        onChange={(e: string | string[]) => {
                          const newItem = storyTimeOptions?.filter(
                            (item) => item?.id === e
                          );
                          handleGroupChange(
                            newItem,
                            idx,
                            ThemeStoryTypes?.storyActivity
                          );
                        }}
                      />
                    </div>
                  </div>
                </div>
              ))}

            <Pagination
              recordsPerPage={totalDays}
              items={tempDataArr}
              responseData={setTableData}
            />
          </div>
        </div>
      );
    }
  } else {
    return <div>...loading</div>;
  }
};

export default ThemeContentSelector;
