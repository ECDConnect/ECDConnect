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
  StoryActivitiesTypes,
} from '../../pages/content-management/content-management-models';
import Pagination from '../pagination/pagination';

export interface DynamicSelectorProps {
  contentValue?: ContentValueDto;
  languageId?: string;
  title?: string;
  optionDefinition?: ContentDefinitionModelDto;
  isReview: boolean;
  setSelectedItems?: (value: string) => void;
  isSkillType?: boolean;
  choosedSectionTitle?: string;
  subLabel?: string;
}

const storyActivitiesTypes = [
  {
    name: StoryActivitiesTypes?.Storybook,
    id: StoryActivitiesTypes?.Storybook,
  },
  {
    name: StoryActivitiesTypes?.ReadAloud,
    id: StoryActivitiesTypes?.ReadAloud,
  },
  {
    name: StoryActivitiesTypes?.Other,
    id: StoryActivitiesTypes?.Other,
  },
];

const DynamicSelector: React.FC<DynamicSelectorProps> = ({
  contentValue,
  languageId,
  title,
  optionDefinition,
  isReview,
  setSelectedItems,
  isSkillType,
  choosedSectionTitle,
  subLabel,
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
    if (choosedSectionTitle) {
      setTempData(storyActivitiesTypes);
    }
  }, []);

  useEffect(() => {
    if (contentData && contentData[getAllCall]) {
      if (choosedSectionTitle === ActivitiesTitles.StoryActivities) {
        setTempData(storyActivitiesTypes);
        return;
      }
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
    if (isSkillType) {
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
          {choosedSectionTitle !== ActivitiesTitles.StoryActivities && (
            <Typography
              type={'help'}
              color={'textMid'}
              text={
                'You must choose exactly 2 skills from the list below. To change your selection, deselect the skills and choose a new pair.'
              }
            />
          )}
          {subLabel && (
            <Typography type={'help'} color={'textMid'} text={subLabel} />
          )}

          {choosedSectionTitle === ActivitiesTitles.StoryActivities && (
            <Alert
              className="mt-2 mb-4 rounded-md"
              message={`Editing the connected story types here will update the connected story types for all translations of this page.`}
              type="warning"
            />
          )}
          {choosedSectionTitle !== ActivitiesTitles.StoryActivities && (
            <Alert
              className="mt-2 mb-4 rounded-md"
              message={`Editing the skills here will update the skills for all translations of this page.`}
              type="warning"
            />
          )}

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
                    checkboxColor="secondary"
                    id={item?.title}
                    key={'story_' + item?.id}
                    image={item?.imageUrl}
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
    }
    if (title === 'Themes' || title === 'Theme(s)') {
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
          {subLabel && (
            <Typography type={'help'} color={'textMid'} text={subLabel} />
          )}

          <Alert
            className="mt-2 mb-4 rounded-md"
            message={`Editing the themes here will update the themes for all translations of this page.`}
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
                    id={item?.id}
                    key={'theme_' + index}
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

        <div className="mt-4 overflow-hidden border-b border-gray-200 shadow sm:rounded-lg">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className=" w-full px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                >
                  Name
                </th>
              </tr>
            </thead>
            <tbody className="z-10 divide-y divide-gray-200 bg-white">
              {tableData &&
                tableData.map((item: any) => (
                  <tr key={item.id}>
                    <td className="whitespace-nowrap px-2 py-4">
                      <div className="flex items-center">
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {item.name}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      <div className="flex items-center">
                        <div className="text-sm font-medium text-gray-900">
                          <input
                            disabled={isReview}
                            defaultChecked={currentIds?.some(
                              (x) => x === item.id.toString()
                            )}
                            type="checkbox"
                            className="focus:ring-primary text-primary h-4 w-4 rounded border-gray-300"
                            onChange={() => selectItem(item.id)}
                          />
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>

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

export default DynamicSelector;
