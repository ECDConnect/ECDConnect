import { gql, useQuery } from '@apollo/client';
import {
  ContentDefinitionModelDto,
  ContentValueDto,
  camelCaseToSentanceCase,
} from '@ecdlink/core';
import { FormInput, Typography } from '@ecdlink/ui';
import { useCallback, useEffect, useState } from 'react';
import { FieldType } from '../../pages/content-management/content-management-models';
import Pagination from '../pagination/pagination';
import FormFileInput from '../form-file-input/form-file-input';

export interface CategoryContentFormProps {
  contentValue?: ContentValueDto;
  languageId?: string;
  title?: string;
  optionDefinition?: ContentDefinitionModelDto;
  isReview: boolean;
  setSelectedItems?: (value: string) => void;
  acceptedFileFormats?: string[];
  setFilteredSubcategories?: (item: any[]) => void;
  content?: any;
}

const CategoryContentForm: React.FC<CategoryContentFormProps> = ({
  contentValue,
  languageId,
  title,
  optionDefinition,
  isReview,
  setSelectedItems,
  acceptedFileFormats,
  setFilteredSubcategories,
  content,
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
  const [subcategoriesFilt, setsubcategoriesFilt] = useState([]);
  const [subcategoriesFiltB, setsubcategoriesFiltB] = useState([]);
  const [defaultIds, setDefaultIds] = useState<string[]>();
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
      setTableData,
    },
  });

  const [displayFields, setDisplayFields] = useState<string[]>();
  const contentSubcategories = content?.subCategories?.map((item) =>
    String(item?.id)
  );

  useEffect(() => {
    if (contentSubcategories) {
      setDefaultIds(contentSubcategories);
    }
  }, []);

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

  useEffect(() => {
    if (tableData) {
      if (currentIds) {
        setsubcategoriesFilt(
          tableData?.filter((item) =>
            currentIds?.some((x) => x === item.id.toString())
          )
        );
        setsubcategoriesFiltB(
          tableData?.filter((item) =>
            currentIds?.some((x) => x === item.id.toString())
          )
        );
      } else {
        setsubcategoriesFilt(
          tableData?.filter((item) =>
            defaultIds?.some((x) => x === item.id.toString())
          )
        );
        setsubcategoriesFiltB(
          tableData?.filter((item) =>
            defaultIds?.some((x) => x === item.id.toString())
          )
        );
      }
    }
  }, [currentIds, defaultIds, tableData]);

  const onChange = useCallback(
    (e, idx, propName) => {
      let tempArray = [...subcategoriesFilt];

      let item = { ...tempArray[idx] };

      if (propName === 'name') {
        item.name = e?.target?.value;
      }

      if (propName === 'icon') {
        item.imageUrl = e;
      }

      if (propName === 'imageHexColor') {
        item.imageHexColor = e?.target?.value;
      }
      if (propName === 'description') {
        if (
          e?.target?.textLength === item?.description?.length &&
          e?.key === 'Backspace'
        ) {
          item.description = e.target.value;
          item.idx = idx;
          tempArray[idx] = item;
          setsubcategoriesFilt(tempArray);
          return;
        }

        item.description = e?.target?.value;
      }

      item.idx = idx;
      tempArray[idx] = item;
      setsubcategoriesFilt(tempArray);
    },
    [subcategoriesFilt]
  );

  const onSecondColumnChange = useCallback(
    (e, idx, propName) => {
      let tempArray = [...subcategoriesFiltB];

      let item = { ...tempArray[idx] };

      if (propName === 'name') {
        item.name = e?.target?.value;
      }

      if (propName === 'icon') {
        item.imageUrl = e;
      }

      if (propName === 'imageHexColor') {
        item.imageHexColor = e?.target?.value;
      }

      if (propName === 'description') {
        if (
          e?.target?.textLength === item?.description?.length &&
          e?.key === 'Backspace'
        ) {
          item.description = e.target.value;
          item.idx = idx;
          tempArray[idx] = item;
          setsubcategoriesFiltB(tempArray);
          return;
        }

        item.description = e?.target?.value;
      }

      item.idx = idx;
      tempArray[idx] = item;
      setsubcategoriesFiltB(tempArray);
    },
    [subcategoriesFiltB]
  );

  useEffect(() => {
    if (tableData && currentIds && subcategoriesFilt) {
      setFilteredSubcategories(subcategoriesFilt);
    } else {
      setFilteredSubcategories(subcategoriesFiltB);
    }
  }, [
    currentIds,
    setFilteredSubcategories,
    subcategoriesFilt,
    subcategoriesFiltB,
    tableData,
  ]);

  useEffect(() => {
    if (tableData && currentIds && subcategoriesFiltB) {
      setFilteredSubcategories(subcategoriesFiltB);
    }
  }, [currentIds, setFilteredSubcategories, subcategoriesFiltB, tableData]);

  if (tempData && displayFields) {
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
          text={'You must add at least one subcategory.'}
        />

        {tableData && currentIds ? (
          tableData
            ?.filter((item) =>
              currentIds?.some((x) => x === item.id.toString())
            )
            .map((item: any, idx: number) => {
              return (
                <>
                  <div className="mt-8" key={`subCats_` + idx}>
                    <Typography
                      type={'h4'}
                      color={'textDark'}
                      text={`Subcategory ${idx + 1} name *`}
                      weight="bold"
                    />
                    <FormInput
                      key={idx}
                      className="bg-adminPortalBg my-4 rounded-lg p-1"
                      isAdminPortalField={true}
                      id={subcategoriesFilt?.[idx]?.id}
                      value={subcategoriesFilt?.[idx]?.name}
                      onChange={(e) => onChange(e, idx, 'name')}
                      textInputType="input"
                      placeholder={'Add a response...'}
                    />
                    <Typography
                      type={'h4'}
                      color={'textDark'}
                      text={`Subcategory ${idx + 1} colour *`}
                      weight="bold"
                    />
                    <FormInput
                      key={idx}
                      className="bg-adminPortalBg my-4 rounded-lg p-1"
                      isAdminPortalField={true}
                      id={subcategoriesFilt?.[idx]?.id}
                      value={subcategoriesFilt?.[idx]?.imageHexColor}
                      onChange={(e) => onChange(e, idx, 'imageHexColor')}
                      textInputType="input"
                      placeholder={'Add a colour...'}
                    />
                    <div className="w-full rounded-lg" onClick={(e) => {}}>
                      <FormFileInput
                        acceptedFormats={acceptedFileFormats}
                        label={`Subcategory ${idx + 1} icon *`}
                        nameProp={String(idx)}
                        contentUrl={
                          subcategoriesFilt?.[idx]?.imageUrl
                            ? subcategoriesFilt?.[idx]?.imageUrl
                            : undefined
                        }
                        returnFullUrl={true}
                        setValue={() => {}}
                        isSubcategoryInput={true}
                        onChange={(e) => onChange(e, idx, 'icon')}
                      />
                    </div>
                    <Typography
                      type={'body'}
                      color={'textDark'}
                      text={`Tips for programme planning info page *`}
                      className="mt-4"
                      weight="bold"
                    />
                    <FormInput
                      className="bg-adminPortalBg my-2 rounded-lg p-1"
                      isAdminPortalField={true}
                      id={subcategoriesFilt?.[idx]?.id}
                      value={subcategoriesFilt?.[idx]?.description}
                      onChange={(e) => {
                        onChange(e, idx, 'description');
                      }}
                      onKeyDown={(e) => onChange(e, idx, 'description')}
                      textInputType="textarea"
                      placeholder={'Add a response...'}
                    />
                  </div>
                </>
              );
            })
        ) : tableData && defaultIds ? (
          tableData
            ?.filter((item) =>
              defaultIds?.some((x) => x === item.id.toString())
            )
            .map((item: any, idx: number) => {
              return (
                <>
                  <div className="mt-8" key={`subCat_` + idx}>
                    <Typography
                      type={'h4'}
                      color={'textDark'}
                      text={`Subcategory ${idx + 1} name *`}
                      weight="bold"
                    />
                    <FormInput
                      key={idx}
                      className="bg-adminPortalBg my-4 rounded-lg p-1"
                      isAdminPortalField={true}
                      id={subcategoriesFiltB?.[idx]?.id}
                      value={subcategoriesFiltB?.[idx]?.name}
                      onChange={(e) => onSecondColumnChange(e, idx, 'name')}
                      onKeyDown={(e) => onSecondColumnChange(e, idx, 'name')}
                      textInputType="input"
                      placeholder={'Add a response...'}
                    />
                    <Typography
                      type={'h4'}
                      color={'textDark'}
                      text={`Subcategory ${idx + 1} colour *`}
                      weight="bold"
                    />
                    <FormInput
                      key={idx}
                      className="bg-adminPortalBg my-4 rounded-lg p-1"
                      isAdminPortalField={true}
                      id={subcategoriesFiltB?.[idx]?.id}
                      value={subcategoriesFiltB?.[idx]?.imageHexColor}
                      onChange={(e) =>
                        onSecondColumnChange(e, idx, 'imageHexColor')
                      }
                      onKeyDown={(e) =>
                        onSecondColumnChange(e, idx, 'imageHexColor')
                      }
                      textInputType="input"
                      placeholder={'Add a colour...'}
                    />
                    <div className="w-full rounded-lg" onClick={(e) => {}}>
                      <FormFileInput
                        acceptedFormats={acceptedFileFormats}
                        label={`Subcategory ${idx + 1} icon *`}
                        nameProp={String(idx)}
                        contentUrl={
                          subcategoriesFiltB?.[idx]?.imageUrl
                            ? subcategoriesFiltB?.[idx]?.imageUrl
                            : undefined
                        }
                        returnFullUrl={true}
                        setValue={() => {}}
                        isSubcategoryInput={true}
                        onChange={(e) => onSecondColumnChange(e, idx, 'icon')}
                      />
                    </div>
                    <Typography
                      type={'body'}
                      color={'textDark'}
                      text={`Tips for programme planning info page *`}
                      className="mt-4"
                      weight="bold"
                    />
                    <FormInput
                      className="bg-adminPortalBg my-2 rounded-lg p-1"
                      isAdminPortalField={true}
                      id={subcategoriesFiltB?.[idx]?.id}
                      value={subcategoriesFiltB?.[idx]?.description}
                      onChange={(e) =>
                        onSecondColumnChange(e, idx, 'description')
                      }
                      onKeyDown={(e) =>
                        onSecondColumnChange(e, idx, 'description')
                      }
                      textInputType="textarea"
                      placeholder={'Add a response...'}
                    />
                  </div>
                </>
              );
            })
        ) : (
          <div></div>
        )}

        <Pagination
          recordsPerPage={8}
          items={tempData}
          responseData={setTableData}
        />
      </div>
    );
  } else {
    return <div>...loading</div>;
  }
};

export default CategoryContentForm;
