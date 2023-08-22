/* eslint-disable react-hooks/rules-of-hooks */
import { gql, useMutation, useQuery } from '@apollo/client';
import {
  camelCaseToSentanceCase,
  ContentDefinitionModelDto,
  ContentTypeDto,
  ContentTypeFieldDto,
  LanguageDto,
  NOTIFICATION,
  PermissionEnum,
  useDialog,
  useNotifications,
  usePanel,
} from '@ecdlink/core';
import { DialogPosition } from '@ecdlink/ui';
import { useEffect, useState } from 'react';
import { ContentLoader } from '../../../../components/content-loader/content-loader';
import AlertModal from '../../../../components/dialog-alert/dialog-alert';
import LanguageSelector from '../../../../components/language-selector/language-selector';
import UiTable from '../../../../components/ui-table';
import { useUser } from '../../../../hooks/useUser';
import {
  ContentManagementView,
  FieldType,
} from '../../content-management-models';
import ContentCreate from './components/content-create/content-create';

export interface ContentListProps {
  contentType: ContentTypeDto;
  optionDefinitions: ContentDefinitionModelDto[];
  languages: LanguageDto[];
  viewContent: (content?: ContentManagementView) => void;
  refreshParent: () => void;
}

export default function ContentList({
  contentType,
  languages,
  optionDefinitions,
  viewContent,
  refreshParent,
}: ContentListProps) {
  const { hasPermission } = useUser();

  const [tableData, setTableData] = useState<any[]>([]);
  const dialog = useDialog();
  const { setNotification } = useNotifications();
  const panel = usePanel();
  const type = contentType.description;

  const [languageId, setLanguageId] = useState<string>();

  const [displayFields, setDisplayFields] = useState<string[]>();

  useEffect(() => {
    if (contentType && contentType.fields) {
      const displayFields: string[] = [];

      const copy: ContentTypeFieldDto[] = Object.assign([], contentType.fields);

      const orderedList = copy?.sort(function (a, b) {
        return a.fieldOrder - b.fieldOrder;
      });

      orderedList.forEach((x) => {
        if (x.fieldType.dataType === FieldType.Text)
          displayFields.push(x.fieldName);
      });

      console.log(displayFields);

      setDisplayFields(displayFields);
    }
  }, [contentType]);

  const fields =
    contentType.fields?.map((x) => {
      if (
        x.fieldType.dataType !== FieldType.Link &&
        x.fieldType.dataType !== FieldType.StaticLink
      )
        return x.fieldName;
      else
        return `
        ${x.fieldName} {
          id
        }
      `;
    }) ?? [];

  const getAllCall = `GetAll${contentType.name}`;

  const query = gql` 
    query ${getAllCall} ($localeId: String) {
      ${getAllCall} (localeId: $localeId) {
        id
        ${fields.join('\n')}
        }
      }
  `;

  const { data: contentData, refetch: refetchContent } = useQuery(query, {
    fetchPolicy: 'cache-and-network',
    variables: {
      localeId: languageId,
    },
  });

  const mutationName = `delete${contentType.name}`;
  const deleteMutation = gql` 
    mutation ${mutationName} ($id: String!, $localeId: String!) {
      ${mutationName} (id: $id, localeId: $localeId) 
      }
  `;

  useEffect(() => {
    if (contentData && contentData[getAllCall]) {
      const copyItems = contentData[getAllCall].map((item) => ({
        ...item,
        _view: undefined,
        _edit: undefined,
        _url: undefined,
      }));
      setTableData(copyItems);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contentData]);

  useEffect(() => {
    if (languages) {
      const defaultLanguage = languages.find((x) => x.locale === 'en-za');
      setLanguageId(defaultLanguage.id);

      refetchContent({
        localeId: defaultLanguage.id.toString(),
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [languages]);

  const [deleteContent] = useMutation(deleteMutation);

  const getContentGroupContentByLanguageId = (languageId: string) => {
    setLanguageId(languageId);
    refetchContent({
      localeId: languageId.toString(),
    });
  };

  const viewSelectedRow = (item?: any) => {
    const model: ContentManagementView = {
      content: item,
      languageId: languageId,
    };
    viewContent(model);
  };

  const displayCreatePanel = () => {
    panel({
      noPadding: true,
      title: `Create ${type}`,
      render: (onSubmit: any) => (
        <ContentCreate
          key={`contentPanelCreate`}
          selectedLanguageId={languageId}
          languages={languages}
          contentType={contentType}
          optionDefinitions={optionDefinitions}
          closeDialog={(created: boolean) => {
            onSubmit();

            if (created) {
              refetchContent({
                localeId: languageId.toString(),
              });
              refreshParent();

              setNotification({
                title: 'Successfully Created Content!',
                variant: NOTIFICATION.SUCCESS,
              });
            }
          }}
        />
      ),
    });
  };

  const deleteAndRefresh = async (item: any) => {
    dialog({
      position: DialogPosition.Middle,
      render: (onSubmit: any, onCancel: any) => (
        <AlertModal
          title="Delete Content"
          message={`You are about to delete content that is part of the Collection ${type}, this can implicate data issues. Would you like to go ahead`}
          onCancel={onCancel}
          btnText={['Yes, Delete Content', 'No, Cancel']}
          onSubmit={() => {
            onSubmit();

            deleteContent({
              variables: {
                id: item.id.toString(),
                localeId: languageId.toString(),
              },
            })
              .then(() => {
                refetchContent({
                  localeId: languageId.toString(),
                });

                setNotification({
                  title: 'Successfully Deleted Content!',
                  variant: NOTIFICATION.SUCCESS,
                });
              })
              .catch((error) => {
                console.log(error);
              });
          }}
        />
      ),
    });
  };

  if (tableData && displayFields) {
    return (
      <div>
        <div className="flex flex-col">
          <div className="pb-5 sm:flex sm:items-center sm:justify-between">
            <h3 className="text-lg font-medium leading-6 text-white">{type}</h3>
            <div className="flex flex-row">
              <div className="flex flex-col">
                <LanguageSelector
                  disabled={false}
                  languages={languages}
                  currentLanguageId={languageId}
                  selectLanguage={getContentGroupContentByLanguageId}
                />
              </div>
              <div className="flex flex-col">
                <div className="mt-1 ml-4">
                  {hasPermission(PermissionEnum.create_static) &&
                    contentType.name !== 'Consent' && (
                      <button
                        onClick={() => displayCreatePanel()}
                        type="button"
                        className="bg-secondary hover:bg-uiMid focus:outline-none inline-flex items-center rounded-md border border-transparent px-4 py-2.5 text-sm font-medium text-white shadow-sm focus:ring-2 focus:ring-offset-2"
                      >
                        Create {camelCaseToSentanceCase(contentType.name)}
                      </button>
                    )}
                </div>
              </div>
            </div>
          </div>

          <div className=" -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
              <div className="overflow-hidden border-b border-gray-200 shadow sm:rounded-lg">
                <UiTable
                  columns={displayFields.map((item) => {
                    return { field: item, use: item };
                  })}
                  rows={tableData}
                  deleteRow={
                    hasPermission(PermissionEnum.delete_static) &&
                    deleteAndRefresh
                  }
                  component={'cms'}
                  viewRow={
                    hasPermission(PermissionEnum.update_static) &&
                    viewSelectedRow
                  }
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  } else {
    return <ContentLoader />;
  }
}
