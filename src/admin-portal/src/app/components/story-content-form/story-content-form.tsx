import { gql, useQuery } from '@apollo/client';
import {
  ContentDefinitionModelDto,
  ContentValueDto,
  StoryBookPartDto,
  StoryBookQuestionDto,
  camelCaseToSentanceCase,
} from '@ecdlink/core';
import { CheckboxGroup, FormInput, Typography } from '@ecdlink/ui';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { FieldType } from '../../pages/content-management/content-management-models';
import Pagination from '../pagination/pagination';
import { StoryBookTypes } from '../../pages/content-management/sub-pages/content-list/components/create-story/create-story';
import ContentLoader from '../content-loader/content-loader';

export interface StoryContentFormProps {
  contentValue?: ContentValueDto;
  languageId?: string;
  title?: string;
  optionDefinition?: ContentDefinitionModelDto;
  isReview: boolean;
  setSelectedItems?: (value: string) => void;
  isSkillType?: boolean;
  setFilteredStoryBookParts?: (item?: StoryBookPartDto[]) => void;
  setFilteredStoryBookPartsQuestions?: (item?: StoryBookQuestionDto[]) => void;
  formType?: string;
}

const StoryContentForm: React.FC<StoryContentFormProps> = ({
  contentValue,
  languageId,
  title,
  optionDefinition,
  isReview,
  setSelectedItems,
  isSkillType,
  setFilteredStoryBookParts,
  setFilteredStoryBookPartsQuestions,
  formType,
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
  const currentStoryBooks = useMemo(
    () => tableData.filter((x) => currentIds?.includes(x.id?.toString())),
    [currentIds, tableData]
  );

  const query = gql` 
    query ${getAllCall} ($localeId: String) {
      ${getAllCall} (localeId: $localeId) {
        id
        ${fields.join('\n')}
        }
      }
  `;

  const storyBookPartsQuestionsQuery = gql`
    query GetAllStoryBookPartQuestion($localeId: String) {
      GetAllStoryBookPartQuestion(localeId: $localeId) {
        id
        question
        name
        __typename
      }
    }
  `;

  const { data: contentData } = useQuery(query, {
    fetchPolicy: 'no-cache',
    variables: {
      localeId: languageId?.toString(),
    },
  });

  const { data: storyBookPartQuestioncontentData, loading } = useQuery(
    storyBookPartsQuestionsQuery,
    {
      fetchPolicy: 'no-cache',
      variables: {
        localeId: languageId?.toString(),
      },
    }
  );

  const [storyBookPartsQuestions, setStoryBookPartsQuestions] =
    useState<StoryBookQuestionDto[]>();
  const [displayFields, setDisplayFields] = useState<string[]>();
  const [storyBookPartsValues, setStoryBookPartsValues] =
    useState(currentStoryBooks);
  const [storyBookPartsValuesFormatted, setStoryBookPartsDataValuesFormatted] =
    useState(currentStoryBooks);
  const [
    initialStoryBookPartsQuestionsFormatted,
    setInitialStoryBookPartsQuestionsFormatted,
  ] = useState([]);
  const [
    storyBookPartsQuestionsFormatted,
    setStoryBookPartsQuestionsFormatted,
  ] = useState([]);
  const [hasLoadedQuestionData, setHasLoadedQuestionData] = useState(false);

  const storyBookPartQuestionsIds = useMemo(
    () =>
      storyBookPartsValues?.map(
        (item) => item?.storyBookPartQuestions?.[0]?.id
      ),
    [storyBookPartsValues]
  );

  useEffect(() => {
    if (
      initialStoryBookPartsQuestionsFormatted &&
      hasLoadedQuestionData &&
      !loading
    ) {
      setStoryBookPartsQuestionsFormatted(
        initialStoryBookPartsQuestionsFormatted
      );
      setHasLoadedQuestionData(false);
    }
  }, [hasLoadedQuestionData, initialStoryBookPartsQuestionsFormatted, loading]);

  const currentStoryBooksPartQuestions = useMemo(
    () =>
      storyBookPartsQuestions?.filter((x) =>
        storyBookPartQuestionsIds?.includes(x.id)
      ),
    [storyBookPartQuestionsIds, storyBookPartsQuestions]
  );

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
    if (currentStoryBooks) {
      setStoryBookPartsValues(currentStoryBooks);
    }
  }, [currentStoryBooks]);

  useEffect(() => {
    if (storyBookPartQuestioncontentData) {
      setStoryBookPartsQuestions(
        storyBookPartQuestioncontentData?.GetAllStoryBookPartQuestion
      );
      setHasLoadedQuestionData(true);
    }
  }, [storyBookPartQuestioncontentData]);

  useEffect(() => {
    if (storyBookPartsValues) {
      const emptyArray = [];
      const inputLimit =
        formType === StoryBookTypes.storyBook
          ? 10 - storyBookPartsValues?.length
          : 1 - storyBookPartsValues?.length;
      for (let i = 0; i < inputLimit; i++) {
        emptyArray?.push({
          name: '',
          id: '',
          part: '',
          partText: '',
          storyBookPartQuestions: [],
        });
      }

      const tempArray = [...storyBookPartsValues, ...emptyArray];

      const indexArray = tempArray?.map((bookPart, idx) => {
        return {
          ...bookPart,
          idx: idx,
        };
      });

      setStoryBookPartsDataValuesFormatted(indexArray);
    }
  }, [formType, storyBookPartsValues]);

  useEffect(() => {
    if (currentStoryBooksPartQuestions && storyBookPartQuestionsIds) {
      const emptyArray = [];
      const inputLimit = 10;
      for (let i = 0; i < inputLimit; i++) {
        emptyArray?.push({
          name: '',
          id: '',
          question: '',
        });
      }

      storyBookPartsValuesFormatted?.map((bookPart, idx) => {
        if (bookPart?.storyBookPartQuestions?.length > 0) {
          emptyArray?.splice(idx, 1, {
            name: storyBookPartsQuestions?.find(
              (question) =>
                question?.id === bookPart?.storyBookPartQuestions?.[0]?.id
            )?.name,
            id: bookPart?.storyBookPartQuestions?.[0]?.id,
            question: storyBookPartsQuestions?.find(
              (question) =>
                question?.id === bookPart?.storyBookPartQuestions?.[0]?.id
            )?.question,
            idx: idx,
          });
        }
      });
      setInitialStoryBookPartsQuestionsFormatted([...emptyArray]);
    }
  }, [
    currentStoryBooksPartQuestions,
    storyBookPartQuestionsIds,
    storyBookPartsQuestions,
    storyBookPartsValuesFormatted,
  ]);

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

  const onChange = useCallback(
    (e, idx) => {
      let newArray = [...storyBookPartsValuesFormatted];

      newArray[idx] = {
        ...newArray[idx],
        partText: e.target.value,
        part: `Part ${idx + 1}`,
        name: `Part ${idx + 1}`,
        idx: idx,
      };

      setStoryBookPartsDataValuesFormatted(newArray);
    },
    [storyBookPartsValuesFormatted]
  );

  const onQuestionChange = useCallback(
    (e, idx, id) => {
      let newArray = [...storyBookPartsQuestionsFormatted];
      newArray[idx] = {
        ...newArray[idx],
        question: e.target.value,
        name: e.target.value,
        idx: idx,
        id: id,
      };
      setStoryBookPartsQuestionsFormatted(newArray);
    },
    [storyBookPartsQuestionsFormatted]
  );

  let changedStoryBookPartsArr = useMemo(
    () =>
      storyBookPartsValuesFormatted?.filter((o1) => {
        return storyBookPartsValues?.every(
          (o2) =>
            (o2.partText !== o1.partText && o1?.partText !== '') ||
            (o1?.partText === '' && o1?.id)
        );
      }),
    [storyBookPartsValues, storyBookPartsValuesFormatted]
  );

  const changedStoryBookPartsQuestionsArr = useMemo(
    () => storyBookPartsQuestionsFormatted?.filter((x) => x?.quest !== ''),
    [storyBookPartsQuestionsFormatted]
  );

  useEffect(() => {
    if (changedStoryBookPartsArr) {
      setFilteredStoryBookParts(changedStoryBookPartsArr);
    }
  }, [changedStoryBookPartsArr, setFilteredStoryBookParts]);

  useEffect(() => {
    if (changedStoryBookPartsQuestionsArr?.length > 0) {
      setFilteredStoryBookPartsQuestions(changedStoryBookPartsQuestionsArr);
      setFilteredStoryBookParts(storyBookPartsValuesFormatted);
    }
  }, [
    changedStoryBookPartsQuestionsArr,
    setFilteredStoryBookParts,
    setFilteredStoryBookPartsQuestions,
    storyBookPartsValuesFormatted,
  ]);

  if (
    tempData &&
    tempData.length > 0 &&
    displayFields &&
    storyBookPartsQuestions &&
    storyBookPartsValuesFormatted
  ) {
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
        <Typography
          type={'body'}
          color={'textMid'}
          text={'You must add at least one part.'}
        />

        <div className="mt-4 overflow-hidden border-b border-gray-200 shadow sm:rounded-lg">
          <div className="min-w-full divide-gray-200">
            {storyBookPartsValuesFormatted &&
              storyBookPartsValuesFormatted.map((item: any, idx: number) => {
                const formattedQuestion =
                  storyBookPartsQuestionsFormatted?.find(
                    (question) => question?.idx === idx
                  );
                const questionAnswer =
                  initialStoryBookPartsQuestionsFormatted?.find(
                    (question) => question?.idx === idx
                  );

                return (
                  <div className="mt-4" key={'storybook_' + idx}>
                    {formType === StoryBookTypes.storyBook && (
                      <>
                        <Typography
                          type={'h4'}
                          text={`Part ${idx + 1}`}
                          className={'text-sm font-normal'}
                          color={'textDark'}
                        />
                        <Typography
                          type={'small'}
                          text={idx === 0 ? 'Text *' : `Text`}
                          className={'mt-1 text-sm font-normal'}
                          color={'textDark'}
                          weight="bold"
                        />
                      </>
                    )}
                    {(formType === StoryBookTypes.readAloud ||
                      formType === StoryBookTypes.other) && (
                      <>
                        <Typography
                          type={'h4'}
                          text={`Story text *`}
                          className={'text-sm font-normal'}
                          color={'textDark'}
                        />
                      </>
                    )}
                    <div>
                      <FormInput
                        key={'story_' + idx}
                        className="bg-adminPortalBg"
                        isAdminPortalField={true}
                        id={item?.id}
                        value={item?.partText}
                        onChange={(e) => onChange(e, idx)}
                        textInputType="textarea"
                        placeholder={'Add story text...'}
                        error={
                          idx === 0 && !item?.partText
                            ? 'This field is required'
                            : ('' as any)
                        }
                      />
                      {idx === 0 && !item?.partText && (
                        <Typography
                          type="help"
                          color="errorMain"
                          text={'This field is required'}
                        />
                      )}
                    </div>
                    <Typography
                      type={'h4'}
                      text={`Question`}
                      className={'mt-2 text-sm font-normal'}
                      color={'textDark'}
                    />
                    <Typography
                      type={'small'}
                      text={`Optional`}
                      className={'mt-1 text-sm font-normal'}
                      color={'textDark'}
                    />
                    <FormInput
                      key={'question_' + idx}
                      className="bg-adminPortalBg"
                      isAdminPortalField={true}
                      id={item?.id}
                      disabled={item?.partText === ''}
                      onChange={(e) =>
                        onQuestionChange(
                          e,
                          idx,
                          item?.storyBookPartQuestions.length > 0
                            ? item?.storyBookPartQuestions[0].id
                            : ''
                        )
                      }
                      value={
                        formattedQuestion
                          ? formattedQuestion?.question
                          : questionAnswer
                          ? questionAnswer?.question
                          : ''
                      }
                      textInputType="textarea"
                      placeholder={'Add question...'}
                    />
                  </div>
                );
              })}
          </div>

          <Pagination
            recordsPerPage={1000}
            items={tempData}
            responseData={setTableData}
          />
        </div>
      </div>
    );
  } else {
    return <ContentLoader />;
  }
};

export default StoryContentForm;
