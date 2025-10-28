/* eslint-disable react-hooks/rules-of-hooks */
import { useQuery } from '@apollo/client';
import {
  ContentDefinitionModelDto,
  ContentTypeDto,
  ContentTypeFieldDto,
  LanguageDto,
  useDialog,
  useNotifications,
} from '@ecdlink/core';
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { renderIcon, SearchDropDownOption, Table } from '@ecdlink/ui';
import {
  ContentManagementView,
  FieldType,
} from '../../../../content-management-models';
import { LanguageId } from '../../../../../../constants/language';
import { TableRefMethods } from '@ecdlink/ui/lib/components/table/types';
import debounce from 'lodash.debounce';
import { RoleList } from '@ecdlink/graphql';

export interface ContentListProps {
  selectedTab?: number;
  contentType: ContentTypeDto;
  optionDefinitions: ContentDefinitionModelDto[];
  languages: LanguageDto[];
  viewContent: (content?: ContentManagementView) => void;
  refreshParent: () => void;
  onSearch?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  choosedSectionTitle?: string;
  specialType?: string;
  setSelectedType?: (item: ContentTypeDto) => void;
  dataTypes?: any;
}

export default function FormList({
  selectedTab,
  contentType,
  languages,
  viewContent,
  refreshParent,
  onSearch,
  choosedSectionTitle,
  setSelectedType,
  dataTypes,
}: ContentListProps) {
  const [tableData, setTableData] = useState<any[]>();
  const [roles, setRoles] = useState<any[]>();
  const [languageId, setLanguageId] = useState<string>(LanguageId.enZa);
  const [searchText, setSearchText] = useState('Search by title or content...');
  const [displayFields, setDisplayFields] = useState<ContentTypeFieldDto[]>();
  const [typeFilter, setTypeFilter] = useState<SearchDropDownOption<string>[]>(
    []
  );

  // get & set roles for forms
  const { data: roleData, refetch } = useQuery(RoleList, {
    fetchPolicy: 'cache-first',
  });

  useEffect(() => {
    if (roleData && roleData.roles) {
      setRoles(roleData.roles);
    }
  }, [roleData]);

  const filterByValue = useCallback((array, value) => {
    return array?.filter(
      (data) =>
        JSON.stringify(data).toLowerCase().indexOf(value.toLowerCase()) !== -1
    );
  }, []);

  useEffect(() => {
    if (contentType && contentType.fields) {
      const displayFields: ContentTypeFieldDto[] = [];

      const copy: ContentTypeFieldDto[] = Object.assign([], contentType.fields);

      const orderedList = copy?.sort(function (a, b) {
        return a.fieldOrder - b.fieldOrder;
      });

      orderedList.forEach((x) => {
        if (
          ((x.fieldType.dataType === FieldType.Text ||
            x.fieldType.dataType === FieldType.Link ||
            x.fieldType.dataType === FieldType.DatePicker) &&
            !!x.displayMainTable) ||
          !!x.displayMainTable
        )
          displayFields.push(x);
      });

      const formFields = displayFields?.filter(
        (item) =>
          item?.fieldName === 'name' ||
          item?.fieldName === 'roleIds' ||
          item?.fieldName === 'isPublished'
      );

      const recordItems = formFields
        .map((item: any) => ({
          ...item,
          displayName:
            item.fieldName === 'name'
              ? 'Form title'
              : item.fieldName === 'roleIds'
              ? 'Role(s)'
              : item.fieldName === 'isPublished'
              ? 'Published?'
              : item.displayName,
          fieldOrder:
            item.fieldName === 'name'
              ? 1
              : item.fieldName === 'roleIds'
              ? 2
              : item.fieldName === 'isPublished'
              ? 3
              : item.fieldOrder,
        }))
        .sort(function (a, b) {
          return a.fieldOrder - b.fieldOrder;
        });

      setDisplayFields(recordItems);
    }
  }, [choosedSectionTitle, contentType]);

  // let us wait for the roles to populate otherwise the roles for the form is not showing
  useEffect(() => {
    if (contentType && contentType.content && !!roles) {
      const rows = contentType.content.map((content) => {
        const row: Record<string, string> = { id: content.id.toString() };
        content.contentValues.forEach((cv) => {
          row[cv.contentTypeField.fieldName] = cv.value || '';
        });
        return row;
      });
      setTableData(rows);
    }
  }, [contentType, roles]);

  const viewSelectedRow = (item?: any) => {
    const model: ContentManagementView = {
      content: item,
      languageId: languageId,
    };
    console.log('viewSelectedRow', model);

    viewContent(model);
  };

  //////////////////////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////////////////

  const tableRef = useRef<TableRefMethods>(null);
  const [searchValue, setSearchValue] = useState('');

  // free search function
  const search = debounce((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value || '');
  }, 150);

  const rows: Irow[] =
    (!!searchValue ? filterByValue(tableData, searchValue) : tableData)?.map(
      (item) => ({
        ...item,
        key: `form_` + item?.id,
        title: item?.title,
        roleComponent: (
          <div className="ml-0 flex cursor-pointer items-center">
            {item?.roleIds.split(',').map((roleId: string) => {
              const roleObj = roles?.find((x) => x.id === roleId);
              const chipColor = () => {
                switch (roleObj?.systemName) {
                  case 'Principal':
                    return 'bg-secondary';
                  case 'Practitioner':
                    return 'bg-infoMain';
                  case 'Coach':
                    return 'bg-tertiary';
                  default:
                    return 'bg-primary';
                }
              };
              return (
                <div
                  key={`role_` + roleId}
                  className={
                    `${chipColor()}` +
                    ' m-1 rounded-full p-3 py-1 text-xs text-white'
                  }
                >
                  {roleObj?.systemName}
                </div>
              );
            })}
          </div>
        ),
        publishComponent: (
          <p
            className={
              item?.isPublished === 'true'
                ? 'text-successMain'
                : 'text-errorMain'
            }
          >
            {item?.dataFree === 'true'
              ? renderIcon('CheckCircleIcon', 'success h-6 w-6')
              : renderIcon('XCircleIcon', 'error h-6 w-6')}
          </p>
        ),
      })
    ) ?? [];

  const columns: Icolumn[] = [
    {
      field: 'name',
      use: 'Form title',
    },
    {
      field: 'roleComponent',
      use: 'For role(s)',
    },
    {
      field: 'publishComponent',
      use: 'Published?',
    },
  ];

  return (
    <>
      <div className=" h-full rounded-2xl ">
        <div className="rounded-xl bg-white ">
          <Table
            watchMode={true}
            ref={tableRef}
            rows={rows}
            columns={columns}
            onClickRow={viewSelectedRow}
            noContentText={'No entries found'}
            loading={{
              isLoading: tableData === undefined,
              size: 'medium',
              spinnerColor: 'adminPortalBg',
              backgroundColor: 'secondary',
            }}
            search={{
              placeholder: 'Search by title or content...',
              onChange: search,
            }}
            filters={[]}
          />
        </div>
      </div>
    </>
  );
}
