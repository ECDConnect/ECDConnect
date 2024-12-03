import { gql, useQuery } from '@apollo/client';
import {
  ContentDefinitionModelDto,
  ContentValueDto,
  camelCaseToSentanceCase,
} from '@ecdlink/core';
import { Alert, CheckboxGroup, Typography } from '@ecdlink/ui';
import { useEffect, useState } from 'react';
import {
  ActivitiesTitles,
  FieldType,
} from '../../pages/content-management/content-management-models';
import Pagination from '../pagination/pagination';

export interface ThemeSelectorProps {
  contentValue?: ContentValueDto;
  languageId?: string;
  title?: string;
  optionDefinition?: ContentDefinitionModelDto;
  isReview: boolean;
  setSelectedItems?: (value: string) => void;
  choosedSectionTitle?: string;
  isEdit: boolean;
}

const ThemeSelector: React.FC<ThemeSelectorProps> = ({
  contentValue,
  languageId,
  title,
  optionDefinition,
  isReview,
  setSelectedItems,
  choosedSectionTitle,
  isEdit,
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

  const { data: contentData } = useQuery(query, {
    fetchPolicy: 'cache-and-network',
    variables: {
      localeId: languageId?.toString(),
    },
    skip: choosedSectionTitle === ActivitiesTitles.StoryActivities,
  });

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

  if (
    choosedSectionTitle === ActivitiesTitles.StoryActivities
      ? tempData
      : tempData && displayFields
  ) {
    return (
      <div key={title}>
        <Typography
          type={'body'}
          weight={'bold'}
          color={'textMid'}
          text={
            title ??
            camelCaseToSentanceCase(optionDefinition?.contentName ?? '')
          }
        />
        <Typography type="help" color="textMid" text={`Optional`} />
        <Alert
          className="mt-2 mb-4 rounded-md"
          message={`Editing the theme here will update the theme for all translations of this page.`}
          type="warning"
        />

        <div className="mt-4 overflow-hidden border-b border-gray-200 shadow sm:rounded-lg">
          {tableData &&
            tableData.map((item: any, index: number) => {
              const maximumItemsChecked = tableData.filter((x) =>
                currentIds?.includes(x.id?.toString())
              );
              const itemChecked = currentIds?.some(
                (x) => x === item?.id?.toString()
              );
              return (
                <CheckboxGroup
                  checkboxColor="secondary"
                  id={item?.title}
                  key={index}
                  title={item?.name}
                  checked={itemChecked}
                  value={item?.title}
                  onChange={() => selectItem(item?.id)}
                  imageHexColor={item?.imageHexColor}
                  className={`${
                    itemChecked ? 'bg-quaternary' : ''
                  } mb-1 w-full`}
                  disabled={
                    choosedSectionTitle === ActivitiesTitles.StoryActivities
                      ? null
                      : maximumItemsChecked?.length === 2 && !itemChecked
                  }
                />
              );
            })}

          <Pagination
            recordsPerPage={8}
            items={tempData}
            responseData={setTableData || setTempData}
          />
        </div>
      </div>
    );
  } else {
    return <div key={title}>...loading</div>;
  }
};

export default ThemeSelector;
