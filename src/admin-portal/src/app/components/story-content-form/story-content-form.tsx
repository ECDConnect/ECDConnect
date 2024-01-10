import { gql, useQuery } from '@apollo/client';
import {
  ContentDefinitionModelDto,
  ContentValueDto,
  StoryBookPartDto,
  StoryBookQuestionDto,
  camelCaseToSentanceCase,
} from '@ecdlink/core';
import { CheckboxGroup, FormInput, Typography } from '@ecdlink/ui';
import { useEffect, useMemo, useState } from 'react';
import { FieldType } from '../../pages/content-management/content-management-models';
import Pagination from '../pagination/pagination';

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
    fetchPolicy: 'cache-and-network',
    variables: {
      localeId: languageId?.toString(),
    },
  });

  const { data: storyBookPartQuestioncontentData } = useQuery(
    storyBookPartsQuestionsQuery,
    {
      fetchPolicy: 'cache-and-network',
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
    storyBookPartsQuestionsFormatted,
    setStoryBookPartsQuestionsFormatted,
  ] = useState(storyBookPartsQuestions);
  console.log({ storyBookPartsQuestionsFormatted });
  const storyBookPartQuestionsIds = useMemo(
    () =>
      storyBookPartsValues?.map(
        (item) => item?.storyBookPartQuestions?.[0]?.id
      ),
    [storyBookPartsValues]
  );

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
    }
  }, [storyBookPartQuestioncontentData]);

  useEffect(() => {
    if (storyBookPartsValues) {
      const emptyArray = [];
      const inputLimit = 10 - storyBookPartsValues?.length;
      for (let i = 0; i < inputLimit; i++) {
        emptyArray?.push({
          name: '',
          id: '',
          part: '',
          partText: '',
          storyBookPartQuestions: [],
        });
      }
      setStoryBookPartsDataValuesFormatted([
        ...storyBookPartsValues,
        ...emptyArray,
      ]);
    }
  }, [storyBookPartsValues]);

  // useEffect(() => {
  //   if (currentStoryBooksPartQuestions && storyBookPartQuestionsIds) {
  //     const emptyArray = [];
  //     const inputLimit = 10;
  //     for (let i = 0; i < inputLimit; i++) {
  //       emptyArray?.push({
  //         name: '',
  //         id: '',
  //         question: '',
  //       });
  //     }

  //     storyBookPartsValuesFormatted?.map((bookPart, idx) => {
  //       if (bookPart?.storyBookPartQuestions?.length > 0) {
  //         emptyArray?.splice(idx, 1, {
  //           name: storyBookPartsQuestions?.find(
  //             (question) =>
  //               question?.id === bookPart?.storyBookPartQuestions?.[0]?.id
  //           ).name,
  //           id: bookPart?.storyBookPartQuestions?.[0]?.id,
  //           question: storyBookPartsQuestions?.find(
  //             (question) =>
  //               question?.id === bookPart?.storyBookPartQuestions?.[0]?.id
  //           ).question,
  //         });
  //       }
  //     });

  //     setStoryBookPartsQuestionsFormatted([...emptyArray]);
  //   }
  // }, [
  //   currentStoryBooksPartQuestions,
  //   storyBookPartQuestionsIds,
  //   storyBookPartsQuestions,
  //   storyBookPartsValuesFormatted,
  // ]);

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

  const onChange = (e, idx) => {
    let newArray = [...storyBookPartsValuesFormatted];

    newArray[idx] = {
      ...newArray[idx],
      partText: e.target.value,
      part: `Part ${idx + 1}`,
      name: `Part ${idx + 1}`,
      idx: idx,
    };

    setStoryBookPartsDataValuesFormatted(newArray);
  };

  const onQuestionChange = (e, idx) => {
    let newArray = [...storyBookPartsQuestionsFormatted];

    newArray[idx] = {
      ...newArray[idx],
      question: e.target.value,
      name: e.target.value,
      idx: idx,
    };
    setStoryBookPartsQuestionsFormatted(newArray);
  };

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

  console.log({ changedStoryBookPartsArr });

  let changedStoryBookPartsQuestionsArr = useMemo(
    () =>
      storyBookPartsQuestionsFormatted?.filter((o1) => {
        return storyBookPartsQuestions?.every(
          (o2) =>
            (o2.question !== o1.question && o1?.question !== '') ||
            (o1?.question === '' && !!o1?.id)
        );
      }),
    [storyBookPartsQuestionsFormatted, storyBookPartsQuestions]
  );

  useEffect(() => {
    if (changedStoryBookPartsArr) {
      setFilteredStoryBookParts(changedStoryBookPartsArr);
    }
  }, [changedStoryBookPartsArr, setFilteredStoryBookParts]);

  // useEffect(() => {
  //   if (changedStoryBookPartsQuestionsArr) {
  //     setFilteredStoryBookPartsQuestions(changedStoryBookPartsQuestionsArr);
  //     setFilteredStoryBookParts(storyBookPartsValuesFormatted);
  //   }
  // }, [
  //   changedStoryBookPartsQuestionsArr,
  //   setFilteredStoryBookParts,
  //   setFilteredStoryBookPartsQuestions,
  //   storyBookPartsValuesFormatted,
  // ]);

  if (
    tempData &&
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
        {title === 'C T F35 - theme Days' || title === 'theme Days'}
        <Typography
          type={'body'}
          color={'textMid'}
          text={'You must add at least one part.'}
        />

        <div className="mt-4 overflow-hidden border-b border-gray-200 shadow sm:rounded-lg">
          <div className="min-w-full  divide-gray-200">
            {/* <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className=" w-full px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                >
                  Name
                </th>
              </tr>
            </thead> */}
            {/* <tbody className="z-10 divide-y divide-gray-200 bg-white"> */}
            {storyBookPartsValuesFormatted &&
              storyBookPartsValuesFormatted.map((item: any, idx: number) => {
                return (
                  <div className="mt-4">
                    <Typography
                      type={'h4'}
                      text={`Part ${idx + 1}`}
                      className={'text-sm font-normal'}
                      color={'textDark'}
                    />
                    <Typography
                      type={'body'}
                      text={`Text`}
                      className={'mt-1 text-sm font-normal'}
                      color={'textDark'}
                    />
                    <div>
                      {/* <Typography
                      type={'body'}
                      text={`${item?.partText}`}
                      className={'text-sm font-normal mt-1'}
                      color={'textDark'}
                    /> */}
                      <FormInput
                        key={idx}
                        className="bg-adminPortalBg my-4 p-4"
                        isAdminPortalField={true}
                        id={item?.id}
                        value={item?.partText}
                        // disabled={isViewAnswers}
                        onChange={(e) => onChange(e, idx)}
                        textInputType="input"
                        placeholder={'Add a response...'}
                        // error={
                        //   dataValuesDescriptionLength?.length === 0 && idx === 0
                        //     ? 'This field is required'
                        //     : ('' as any)
                        // }
                      />
                    </div>
                    {/* <Typography
                      type={'h4'}
                      text={`Question`}
                      className={'mt-2 text-sm font-normal'}
                      color={'textDark'}
                    />
                    <Typography
                      type={'body'}
                      text={`Optional`}
                      className={'mt-1 text-sm font-normal'}
                      color={'textDark'}
                    />
                    <FormInput
                      key={idx}
                      className="bg-adminPortalBg my-4 p-4"
                      isAdminPortalField={true}
                      id={item?.id}
                      value={
                        (storyBookPartsQuestionsFormatted &&
                          storyBookPartsQuestionsFormatted?.length &&
                          storyBookPartsQuestionsFormatted?.find(
                            (question) =>
                              question?.id ===
                              item?.storyBookPartQuestions?.[0]?.id
                          )?.question) ||
                        storyBookPartsQuestionsFormatted?.find(
                          (question) => question?.idx === idx
                        )?.question
                      }
                      disabled={item?.partText === ''}
                      onChange={(e) => onQuestionChange(e, idx)}
                      textInputType="input"
                      placeholder={'Add a question...'}
                      // error={
                      //   dataValuesDescriptionLength?.length === 0 && idx === 0
                      //     ? 'This field is required'
                      //     : ('' as any)
                      // }
                    /> */}
                  </div>
                );
              })}
            {/* </tbody> */}
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
    return <div>...loading</div>;
  }
};

export default StoryContentForm;
