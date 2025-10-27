import {
  ContentDefinitionModelDto,
  ContentTypeDto,
  ContentValueDto,
} from '@ecdlink/core';
import { ContentLoader } from '../../../../../../components/content-loader/content-loader';
import * as styles from '../../../../../pages.styles';
import { SaveIcon, XIcon } from '@heroicons/react/solid';
import { Button, renderIcon, Typography } from '@ecdlink/ui';
import { useEffect, useState } from 'react';
import { useQuery } from '@apollo/client';
import { RoleList } from '@ecdlink/graphql';

export interface FormViewProps {
  content: any;
  contentValues: ContentValueDto[];
  contentType: ContentTypeDto;
  optionDefinitions: ContentDefinitionModelDto[];
  cancelEdit?: () => void;
  savedContent: () => void;
}

const contentWrapper =
  'mt-2 bg-uiBg px-4 py-5 border-b border-gray-200 rounded-lg';

export default function FormView({
  content,
  contentValues,
  contentType,
  optionDefinitions,
  cancelEdit,
  savedContent,
}: FormViewProps) {
  const { data: roleData, refetch } = useQuery(RoleList, {
    fetchPolicy: 'cache-first',
  });

  const [roles, setRoles] = useState<any[]>();
  useEffect(() => {
    if (roleData && roleData.roles) {
      setRoles(roleData.roles);
    }
  }, [roleData]);

  const rolesToUse = 'Practitioners (including principals) ';

  console.log('contentType', contentType);
  console.log('contentValues', contentValues);
  console.log('content', content);

  if (contentType && contentValues) {
    return (
      <div className="flex flex-col rounded-md ">
        <form onSubmit={savedContent} className="space-y-4 ">
          <div className="-ml-4 flex flex-wrap items-center justify-between sm:flex-nowrap">
            <div className="ml-4 ">
              <h2 className="text-xl font-semibold leading-6 text-gray-900">
                {content?.name}
              </h2>
              <div className="mt-1 flex items-center gap-1"></div>
            </div>
            <div className="ml-4 mt-2 flex-shrink-0">
              {!!cancelEdit && (
                <button
                  onClick={cancelEdit}
                  type="button"
                  className={styles.cancelButton}
                >
                  Cancel
                  <XIcon width="22px" className="pl-1" />
                </button>
              )}
            </div>
          </div>

          <div className="rounded-xl bg-white px-12 pt-6 pb-8">
            <Typography
              type="h5"
              color="black"
              text={' Which types of users can use this form?'}
              className="text-start"
            />
            <Typography
              type="h5"
              color="black"
              text={`${rolesToUse} can use this form to assess their programme quality.`}
              className="text-start"
            />
          </div>
          <div className="rounded-xl bg-white px-12 pt-6 pb-8">
            <Typography
              type="h3"
              color="black"
              text={`More information about the ${content?.name}`}
              className="text-start pb-6"
            />

            <Typography
              type="h5"
              color="black"
              text={content?.adminDescription}
              className="text-start pb-6"
            />

            <Typography
              type="h5"
              color="black"
              text="Downlaod the preview document to see what the checklist will look like for app users."
              className="text-start pb-6"
            />

            <Button
              type={'outlined'}
              color={'tertiary'}
              onClick={() => {}}
              className="rounded-xl px-2"
            >
              <div className="flex flex-row items-center">
                {renderIcon('DownloadIcon', `text-tertiary h-4 w-4 mr-2`)}
                <a download className="">
                  Download preview
                </a>
              </div>
            </Button>
          </div>

          <div className="flex flex-row">
            <button
              type="submit"
              className="bg-primary hover:bg-uiMid focus:outline-none mt-3 inline-flex items-center rounded-2xl border border-transparent px-14 py-2.5 text-sm font-medium text-white shadow-sm focus:ring-2 focus:ring-offset-2"
              //   className={`bg-secondary ${
              //     disableButton?.length > 0 ||
              //     initialValues.authorsAuthorization !== 'true' ||
              //     (!isEdit
              //       ? storyBookAndReadAloudRequiredPart &&
              //         filledStoryParts?.length < 1
              //       : content.storyBookParts.length === 0)
              //       ? 'opacity-25'
              //       : ''
              //   } hover:bg-uiMid focus:outline-none mt-3 inline-flex items-center rounded-2xl border border-transparent px-14 py-2.5 text-sm font-medium text-white shadow-sm focus:ring-2 focus:ring-offset-2`}
              //   disabled={
              //     disableButton?.length > 0 ||
              //     initialValues.authorsAuthorization !== 'true' ||
              //     (!isEdit
              //       ? storyBookAndReadAloudRequiredPart &&
              //         filledStoryParts?.length < 1
              //       : content.storyBookParts.length === 0)
              //   }
            >
              <SaveIcon width="22px" className="mr-2" />
              publish
            </button>
          </div>
        </form>
      </div>
    );
  } else {
    return <ContentLoader />;
  }
}
