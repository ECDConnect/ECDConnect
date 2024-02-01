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
} from '@ecdlink/ui';
import { useEffect, useMemo, useState } from 'react';
import { FieldType } from '../../pages/content-management/content-management-models';
import Pagination from '../pagination/pagination';

export interface DynamicSelectorProps {
  contentValue?: ContentValueDto;
  languageId?: string;
  title?: string;
  optionDefinition?: ContentDefinitionModelDto;
  isReview: boolean;
  setSelectedItems?: (value: string) => void;
  isSkillType?: boolean;
  setFilteredThemeDays?: (item: any[]) => void;
}

const smallLargeActivitiesQuery = gql`
  query GetAllActivity($localeId: String) {
    GetAllActivity(localeId: $localeId) {
      id
      availableLanguages {
        id
        __typename
      }
      subCategories {
        id
        name
        imageUrl
        __typename
      }
      notes
      materials
      subType
      type
      description
      name
      image
      __typename
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
}) => {
  const fields =
    optionDefinition?.fields?.map((x) => {
      if (x.dataType !== FieldType.Link && x.dataType !== FieldType.StaticLink)
        return x.name;
      else
        return `
      ${x.name} {
        id
      }
    `;
    }) ?? [];

  const getAllCall = `GetAll${optionDefinition?.contentName}`;

  const [tempData, setTempData] = useState<any[]>([]);
  const tempDataArr = useMemo(() => tempData?.slice(0, 16), [tempData]);
  const [tableData, setTableData] = useState<any[]>([]);
  const arr = contentValue?.value?.split(',');
  const currentTempData = tempData
    ?.filter((item) => arr?.includes(String(item?.id)))
    .slice(0, 16);
  const [handleInitialState, setHandleInitialState] = useState(true);
  const [currentThemeDaysArr, setCurrentThemeDaysArr] = useState([]);
  const [themeDaysArr, setThemeDaysArr] = useState([]);

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
    fetchPolicy: 'cache-and-network',
    variables: {
      localeId: languageId?.toString(),
    },
  });

  const { data: storyActivitiesData } = useQuery(
    smallLargeActivitiesQuery,

    {
      fetchPolicy: 'cache-and-network',
      variables: {
        localeId: languageId?.toString(),
      },
    }
  );

  const { data: storyBookActivitiesData } = useQuery(
    storiesActivitiesQuery,

    {
      fetchPolicy: 'cache-and-network',
      variables: {
        localeId: languageId?.toString(),
      },
    }
  );

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

  const handleGroupChange = (e, idx, storyType) => {
    let tempArray = [...themeDaysArr];

    let item = { ...tempArray[idx] };

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
              tableData.map((item: any) => {
                const maximumItemsChecked = tableData.filter((x) =>
                  currentIds?.includes(x.id?.toString())
                );
                const itemChecked = currentIds?.some(
                  (x) => x === item?.id?.toString()
                );
                return (
                  <CheckboxGroup
                    checkboxColor="primary"
                    id={item?.title}
                    key={item?.title}
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
              'Every theme must have 16 planned days (Fridays are Mahala - practitioners choose their own activities). Please make sure all activities and stories have been added to the admin portal before you search for them here.'
            }
          />
        )}

        <div className="mt-4 sm:rounded-lg">
          {tableData &&
            tableData.map((item: any, idx: number) => (
              <>
                <div className="flex items-center justify-center">
                  <Typography
                    type={'body'}
                    text={`Day ${idx + 1}`}
                    weight="normal"
                    color={'textDark'}
                    className={`${idx === 0 ? 'mt-8' : ''} w-1/12`}
                  />
                  <div className="grid grid-cols-4 gap-2">
                    <div>
                      {idx === 0 && (
                        <Typography
                          type={'h4'}
                          text={'Small group activity'}
                          weight="normal"
                          color={'textDark'}
                          className="my-2"
                        />
                      )}
                      <Dropdown<any>
                        placeholder={'Type to search...'}
                        list={smallGroupOptions}
                        fillType="filled"
                        fillColor="adminPortalBg"
                        textColor="textDark"
                        fullWidth
                        className="text-textDark h-full w-48"
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
                    <div>
                      {idx === 0 && (
                        <Typography
                          type={'h4'}
                          text={'Large group activity'}
                          weight="normal"
                          color={'textDark'}
                          className="my-2"
                        />
                      )}
                      <Dropdown<any>
                        placeholder={'Type to search...'}
                        list={largeGroupOptions}
                        fillType="filled"
                        fillColor="adminPortalBg"
                        textColor="textDark"
                        fullWidth
                        className="text-textDark h-full w-48"
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
                    <div>
                      {idx === 0 && (
                        <Typography
                          type={'h4'}
                          text={'Story'}
                          weight="normal"
                          color={'textDark'}
                          className="my-2"
                        />
                      )}
                      <Dropdown<any>
                        placeholder={'Type to search...'}
                        list={storyBookOptions}
                        fillType="filled"
                        fillColor="adminPortalBg"
                        textColor="textDark"
                        fullWidth
                        className="text-textDark h-full w-48"
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
                    <div>
                      {idx === 0 && (
                        <Typography
                          type={'h4'}
                          text={'Story activity'}
                          weight="normal"
                          color={'textDark'}
                          className="my-2"
                        />
                      )}
                      <Dropdown<any>
                        placeholder={'Type to search...'}
                        list={storyTimeOptions}
                        fillType="filled"
                        fillColor="adminPortalBg"
                        textColor="textDark"
                        fullWidth
                        className="text-textDark h-full w-48"
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
              </>
            ))}

          <Pagination
            recordsPerPage={16}
            items={tempDataArr}
            responseData={setTableData}
          />
        </div>
      </div>
    );
  } else {
    return <div>...loading</div>;
  }
};

export default ThemeContentSelector;
