import { gql, useQuery } from '@apollo/client';
import {
  ContentDefinitionModelDto,
  ContentValueDto,
  camelCaseToSentanceCase,
} from '@ecdlink/core';
import { CheckboxGroup, FormInput, Typography } from '@ecdlink/ui';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { FieldType } from '../../../../../../../content-management/content-management-models';
import Pagination from '../../../../../../../../components/pagination/pagination';

export interface DynamicSelectorProps {
  contentValue?: ContentValueDto;
  languageId?: string;
  title?: string;
  optionDefinition?: ContentDefinitionModelDto;
  isReview: boolean;
  setSelectedItems?: (value: string) => void;
  isSkillType?: boolean;
  contentId?: number;
  setChangedCategory?: (item: any[]) => void;
  changedCategory?: any[];
}

const DynamicSelector: React.FC<DynamicSelectorProps> = ({
  contentValue,
  languageId,
  title,
  optionDefinition,
  isReview,
  setSelectedItems,
  isSkillType,
  contentId,
  setChangedCategory,
  changedCategory,
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
  const [tableData, setTableData] = useState<any[]>([]);

  const [currentIds, setCurrentIds] = useState<string[]>();

  const query = gql` 
    query ${getAllCall} ($localeId: String) {
      ${getAllCall} (localeId: $localeId) {
        id
        ${fields.join('\n')}
        }
      }
  `;

  const categoriesQuery = gql`
    query GetAllProgressTrackingCategory($localeId: String) {
      GetAllProgressTrackingCategory(localeId: $localeId) {
        id
        subCategories {
          id
          name
          imageUrl
          __typename
          skills {
            id
            name
            level {
              id
            }
          }
        }
        imageUrl
        color
        description
        subTitle
        name
        __typename
      }
    }
  `;

  const levelsQuery = gql`
    query GetAllProgressTrackingLevel($localeId: String) {
      GetAllProgressTrackingLevel(localeId: $localeId) {
        id
        imageUrl
        description
        name
        imageUrlDim
        imageUrlDone
        __typename
      }
    }
  `;

  const { data: contentData } = useQuery(query, {
    fetchPolicy: 'cache-and-network',
    variables: {
      localeId: languageId?.toString(),
    },
  });

  const {
    data: levelsContentData,
    refetch: refetchLevelsContent,
    loading: loadingLevelsContent,
  } = useQuery(levelsQuery, {
    fetchPolicy: 'cache-and-network',
    variables: {
      localeId: languageId,
    },
  });

  const {
    data: categoriesContentData,
    refetch: refetchCategoriesContent,
    loading: loadingCategoriesContent,
  } = useQuery(categoriesQuery, {
    fetchPolicy: 'cache-and-network',
    variables: {
      localeId: languageId,
    },
  });
  const categories = categoriesContentData?.GetAllProgressTrackingCategory;
  const currentCategory = categories?.find((cat) => cat?.id === contentId);

  const subCategories = currentCategory?.subCategories;
  const levels = levelsContentData?.GetAllProgressTrackingLevel;
  const movingOnSubCategories = subCategories?.map((sub) => {
    return {
      ...sub,
      skills: sub.skills.filter((skill) => skill?.level?.[0]?.id === 657),
    };
  });
  const advancingFurtherSubCategories = subCategories?.map((sub) => {
    return {
      ...sub,
      skills: sub.skills.filter((skill) => skill?.level?.[0]?.id === 658),
    };
  });
  const towardsGradeRSubCategories = subCategories?.map((sub) => {
    return {
      ...sub,
      skills: sub.skills.filter((skill) => skill?.level?.[0]?.id === 659),
    };
  });
  const [handleInitialValue, setHandleInitialValue] = useState(true);

  const handleNumberOfInputs = (sub) => {
    sub?.map((item) => {
      while (item?.skills?.length < 5) {
        item?.skills?.push({
          id: '',
          name: '',
          level: [
            {
              id: '',
            },
          ],
          category: '',
          subCategory: '',
          idx: '',
        });
      }
    });
    return sub;
  };

  const movingOnLevel = levels?.find((lvl) => lvl?.id === 657);
  const advancingFurtherLevel = levels?.find((lvl) => lvl?.id === 658);
  const towardsGradeRLevel = levels?.find((lvl) => lvl?.id === 659);
  const movingOnLevelObj = useMemo(
    () => ({
      title: `Level: ${movingOnLevel?.name}`,
      subCategories: handleNumberOfInputs(movingOnSubCategories),
      category: currentCategory?.id,
      level: movingOnLevel?.id,
      idx: '',
    }),
    [
      currentCategory?.id,
      movingOnLevel?.id,
      movingOnLevel?.name,
      movingOnSubCategories,
    ]
  );

  const advancingFurtherLevelObj = useMemo(
    () => ({
      title: `Level: ${advancingFurtherLevel?.name}`,
      subCategories: handleNumberOfInputs(advancingFurtherSubCategories),
      category: currentCategory?.id,
      level: advancingFurtherLevel?.id,
    }),
    [
      advancingFurtherLevel?.id,
      advancingFurtherLevel?.name,
      advancingFurtherSubCategories,
      currentCategory?.id,
    ]
  );

  const towardsGradeRLevelObj = useMemo(
    () => ({
      title: `Level: ${towardsGradeRLevel?.name}`,
      subCategories: handleNumberOfInputs(towardsGradeRSubCategories),
      category: currentCategory?.id,
      level: towardsGradeRLevel?.id,
    }),
    [
      currentCategory?.id,
      towardsGradeRLevel?.id,
      towardsGradeRLevel?.name,
      towardsGradeRSubCategories,
    ]
  );

  const [displayFields, setDisplayFields] = useState<string[]>();
  const [movingOnState, setMovinOnState] = useState({
    category: '',
    level: '',
    subCategories: [],
    title: '',
  });
  const [advancingFurtherState, setAdvancingFurtherState] = useState({
    category: '',
    level: '',
    subCategories: [],
    title: '',
  });
  const [towardsGradeRState, setTowardsGradeRState] = useState({
    category: '',
    level: '',
    subCategories: [],
    title: '',
  });

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

  const [changedArr, setChangedArr] = useState([]);

  const onChange = useCallback(
    (e, idx, itemIdx, levelType) => {
      if (levelType === 'movingOn') {
        let newObj = { ...movingOnLevelObj };
        let newSubCategory =
          movingOnLevelObj?.subCategories[itemIdx]?.skills?.[idx];
        newSubCategory = {
          ...newSubCategory,
          name: e?.target.value,
        };

        newObj.subCategories[itemIdx].skills[idx] = newSubCategory;

        setMovinOnState(newObj);
        const tempArr = changedArr?.filter(
          (item) => item?.level !== newObj?.level
        );
        setChangedArr([...tempArr, newObj]);
      }

      if (levelType === 'advancingFurther') {
        let newObj = { ...advancingFurtherLevelObj };
        let newSubCategory =
          advancingFurtherLevelObj?.subCategories[itemIdx]?.skills?.[idx];
        newSubCategory = {
          ...newSubCategory,
          name: e?.target.value,
        };

        newObj.subCategories[itemIdx].skills[idx] = newSubCategory;

        setAdvancingFurtherState(newObj);
        const tempArr = changedArr?.filter(
          (item) => item?.level !== newObj?.level
        );
        setChangedArr([...tempArr, newObj]);
      }

      if (levelType === 'towardsGradeR') {
        let newObj = { ...towardsGradeRLevelObj };
        let newSubCategory =
          towardsGradeRLevelObj?.subCategories[itemIdx]?.skills?.[idx];
        newSubCategory = {
          ...newSubCategory,
          name: e?.target.value,
        };

        newObj.subCategories[itemIdx].skills[idx] = newSubCategory;
        setTowardsGradeRState(newObj);
        const tempArr = changedArr?.filter(
          (item) => item?.level !== newObj?.level
        );
        setChangedArr([...tempArr, newObj]);
      }
    },
    [
      advancingFurtherLevelObj,
      changedArr,
      movingOnLevelObj,
      towardsGradeRLevelObj,
    ]
  );

  useEffect(() => {
    if (movingOnLevelObj && handleInitialValue) {
      setMovinOnState(movingOnLevelObj);
    }

    if (advancingFurtherLevelObj && handleInitialValue) {
      setAdvancingFurtherState(advancingFurtherLevelObj);
    }

    if (towardsGradeRLevelObj && handleInitialValue) {
      setTowardsGradeRState(towardsGradeRLevelObj);
    }
    setHandleInitialValue(false);
  }, [
    advancingFurtherLevelObj,
    handleInitialValue,
    movingOnLevelObj,
    towardsGradeRLevelObj,
  ]);

  useEffect(() => {
    if (changedArr) {
      setChangedCategory(changedArr);
    }
  }, [changedArr, setChangedCategory]);

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

          <div className="mt-4 overflow-hidden border-b border-gray-200 shadow sm:rounded-lg">
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
          text={
            title ??
            camelCaseToSentanceCase(optionDefinition?.contentName ?? '')
          }
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

        <div className="mt-4 overflow-hidden sm:rounded-lg">
          <Typography
            type={'h2'}
            color={'textDark'}
            text={movingOnState?.title}
          />
          {movingOnState?.subCategories &&
            movingOnState?.subCategories?.map((item, itemIdx) => {
              return (
                <>
                  <div className="mt-4 flex items-center gap-4">
                    <div className="bg-tertiary flex h-8 w-8 items-center justify-center rounded-full">
                      <img
                        src={item?.imageUrl}
                        alt="skill"
                        className="h-6 w-6"
                      />
                    </div>
                    <Typography
                      type={'h4'}
                      color={'textDark'}
                      text={item?.name}
                    />
                  </div>
                  <Typography
                    type={'help'}
                    color={'textMid'}
                    text={'You must add at least 1 skill.'}
                  />
                  {item?.skills?.map((skill, idx) => {
                    return (
                      <>
                        <Typography
                          type={'h4'}
                          color={'textDark'}
                          text={idx === 0 ? `Skill text *` : `Skill text`}
                          className="mt-2"
                        />
                        <FormInput
                          key={idx}
                          className="bg-adminPortalBg my-1 rounded-md p-2"
                          isAdminPortalField={true}
                          id={item?.id}
                          value={skill?.name}
                          onChange={(e) =>
                            onChange(e, idx, itemIdx, 'movingOn')
                          }
                          textInputType="input"
                          placeholder={'Add a text...'}
                        />
                      </>
                    );
                  })}
                </>
              );
            })}
          <Typography
            type={'h2'}
            color={'textDark'}
            text={advancingFurtherState?.title}
            className="mt-8"
          />
          {advancingFurtherState?.subCategories &&
            advancingFurtherState?.subCategories?.map((item, itemIdx) => {
              return (
                <>
                  <div className="mt-4 flex items-center gap-4">
                    <div className="bg-tertiary flex h-8 w-8 items-center justify-center rounded-full">
                      <img
                        src={item?.imageUrl}
                        alt="skill"
                        className="h-6 w-6"
                      />
                    </div>
                    <Typography
                      type={'h4'}
                      color={'textDark'}
                      text={item?.name}
                    />
                  </div>
                  <Typography
                    type={'help'}
                    color={'textMid'}
                    text={'You must add at least 1 skill.'}
                  />
                  {item?.skills?.map((skill, idx) => {
                    return (
                      <>
                        <Typography
                          type={'h4'}
                          color={'textDark'}
                          text={idx === 0 ? `Skill text *` : `Skill text`}
                          className="mt-2"
                        />
                        <FormInput
                          key={idx}
                          className="bg-adminPortalBg my-1 rounded-md p-2"
                          isAdminPortalField={true}
                          id={item?.id}
                          value={skill?.name}
                          onChange={(e) =>
                            onChange(e, idx, itemIdx, 'advancingFurther')
                          }
                          textInputType="input"
                          placeholder={'Add a text...'}
                        />
                      </>
                    );
                  })}
                </>
              );
            })}
          <Typography
            type={'h2'}
            color={'textDark'}
            text={towardsGradeRState?.title}
            className="mt-8"
          />
          {towardsGradeRState?.subCategories &&
            towardsGradeRState?.subCategories?.map((item, itemIdx) => {
              return (
                <>
                  <div className="mt-4 flex items-center gap-4">
                    <div className="bg-tertiary flex h-8 w-8 items-center justify-center rounded-full">
                      <img
                        src={item?.imageUrl}
                        alt="skill"
                        className="h-6 w-6"
                      />
                    </div>
                    <Typography
                      type={'h4'}
                      color={'textDark'}
                      text={item?.name}
                    />
                  </div>
                  <Typography
                    type={'help'}
                    color={'textMid'}
                    text={'You must add at least 1 skill.'}
                  />
                  {item?.skills?.map((skill, idx) => {
                    return (
                      <>
                        <Typography
                          type={'h4'}
                          color={'textDark'}
                          text={idx === 0 ? `Skill text *` : `Skill text`}
                          className="mt-2"
                        />
                        <FormInput
                          key={idx}
                          className="bg-adminPortalBg my-1 rounded-md p-2"
                          isAdminPortalField={true}
                          id={item?.id}
                          value={skill?.name}
                          onChange={(e) =>
                            onChange(e, idx, itemIdx, 'towardsGradeR')
                          }
                          textInputType="input"
                          placeholder={'Add a text...'}
                        />
                      </>
                    );
                  })}
                </>
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
  } else {
    return <div>...loading</div>;
  }
};

export default DynamicSelector;
