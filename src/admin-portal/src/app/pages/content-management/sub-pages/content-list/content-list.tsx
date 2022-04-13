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

  // const [getContentDefinitionsExcelTemplateGenerator, { data: templateData }] = useLazyQuery(
  //   contentDefinitionsExcelTemplateGenerator,
  //   {
  //     variables: {
  //       contentTypeId: contentType.id,
  //     },
  //     fetchPolicy: 'cache-and-network',
  //   }
  // );

  // const [templateDownloaded, setTemplateDownloaded] = useState<boolean>(false);

  // useEffect(() => {
  //   if (
  //     templateData &&
  //     templateData.contentDefinitionsExcelTemplateGenerator &&
  //     !templateDownloaded
  //   ) {
  //     const b64Data = templateData.contentDefinitionsExcelTemplateGenerator.base64File;
  //     const contentType = templateData.contentDefinitionsExcelTemplateGenerator.fileType;
  //     const fileName = templateData.contentDefinitionsExcelTemplateGenerator.fileName;
  //     const extension = templateData.contentDefinitionsExcelTemplateGenerator.extension;
  //     const blob = b64toBlob(b64Data, contentType);

  //     const link = document.createElement('a');

  //     if (link.download !== undefined) {
  //       const url = URL.createObjectURL(blob);
  //       link.setAttribute('href', url);
  //       link.setAttribute('download', `${fileName}${extension}`);
  //       link.style.visibility = 'hidden';
  //       document.body.appendChild(link);
  //       link.click();
  //       document.body.removeChild(link);
  //     }

  //     setTemplateDownloaded(true);
  //   }
  // }, [templateData, templateDownloaded]);

  // const downloadContentTypeTemplate = async () => {
  //   setTemplateDownloaded(false);
  //   await getContentDefinitionsExcelTemplateGenerator({
  //     variables: { contentTypeId: contentType.id },
  //   });
  // };

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

  const viewEdit = (item?: any) => {
    const model: ContentManagementView = {
      content: item,
      languageId: languageId,
    };
    console.log(model);
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

  // const UploadContent = () => {
  //   panel({
  //     noPadding: true,
  //     title: `Upload Content - ${type}`,
  //     render: (onSubmit: any) => (
  //       <UploadContentTemplate
  //         contentType={contentType}
  //         closeDialog={(created: boolean) => {
  //           onSubmit();

  //           if (created) {
  //             refetchContent({
  //               localeId: languageId.toString(),
  //             });
  //             refreshParent();
  //           }
  //         }}
  //       />
  //     ),
  //   });
  // };

  const deleteAndRefresh = async (item: any) => {
    dialog({
      position: DialogPosition.Middle,
      render: (onSubmit: any, onCancel: any) => (
        <AlertModal
          title="Delete Content"
          message={`You are about to delete content that is part of the Collection ${type}, this can implicate data issues. Would you like to go ahead`}
          onCancel={onCancel}
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
            <h3 className="text-lg leading-6 font-medium text-white">{type}</h3>
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
                  {hasPermission(PermissionEnum.create_static) && (
                    <button
                      onClick={() => displayCreatePanel()}
                      type="button"
                      className="inline-flex items-center px-4 py-2.5 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-uiMid hover:bg-uiLight focus:outline-none focus:ring-2 focus:ring-offset-2"
                    >
                      Create {camelCaseToSentanceCase(contentType.name)}
                    </button>
                  )}
                </div>
              </div>

              {/* <div className="flex flex-col">
                <div className="mt-1 ml-4">
                  <Menu as="div" className=" inline-block text-right">
                    {({ open }) => (
                      <>
                        <div>
                          <Menu.Button
                            onClick={() => displayCreatePanel()}
                            type="button"
                            className="inline-flex items-center px-4 py-2.5 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-uiMid hover:bg-uiLight focus:outline-none focus:ring-2 focus:ring-offset-2"
                          >
                            <span className="sr-only">Open options</span>
                            <CogIcon className="h-5 w-5" aria-hidden="true" />
                          </Menu.Button>
                        </div>

                        <Transition
                          show={open}
                          as={Fragment}
                          enter="transition ease-out duration-100"
                          enterFrom="transform opacity-0 scale-95"
                          enterTo="transform opacity-100 scale-100"
                          leave="transition ease-in duration-75"
                          leaveFrom="transform opacity-100 scale-100"
                          leaveTo="transform opacity-0 scale-95"
                        >
                          <Menu.Items
                            static
                            className="z-50 origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none"
                          >
                            <div className="py-1">
                              <Menu.Item>
                                <div
                                  onClick={() => downloadContentTypeTemplate()}
                                  className="text-gray-700 flex px-4 py-2 text-sm"
                                >
                                  <DownloadIcon
                                    className="mr-3 h-5 w-5 text-gray-400"
                                    aria-hidden="true"
                                  />
                                  Download {camelCaseToSentanceCase(contentType.name)} template
                                </div>
                              </Menu.Item>
                              <Menu.Item>
                                <div
                                  onClick={() => UploadContent()}
                                  className="text-gray-700 flex px-4 py-2 text-sm"
                                >
                                  <UploadIcon
                                    className="mr-3 h-5 w-5 text-gray-400"
                                    aria-hidden="true"
                                  />
                                  Upload {camelCaseToSentanceCase(contentType.name)} template
                                </div>
                              </Menu.Item>
                            </div>
                          </Menu.Items>
                        </Transition>
                      </>
                    )}
                  </Menu>
                </div>
              </div> */}
            </div>
          </div>

          <div className=" -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
              <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
                <UiTable
                  columns={displayFields.map((item) => {
                    return { field: item, use: item };
                  })}
                  rows={tableData}
                  editRow={
                    hasPermission(PermissionEnum.update_static) && viewEdit
                  }
                  deleteRow={
                    hasPermission(PermissionEnum.delete_static) &&
                    deleteAndRefresh
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
