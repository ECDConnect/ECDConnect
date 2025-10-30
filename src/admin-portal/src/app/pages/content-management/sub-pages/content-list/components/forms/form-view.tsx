import {
  ContentDefinitionModelDto,
  ContentTypeDto,
  ContentValueDto,
  useDialog,
  useSnackbar,
} from '@ecdlink/core';
import { ContentLoader } from '../../../../../../components/content-loader/content-loader';
import * as styles from '../../../../../pages.styles';
import { XIcon } from '@heroicons/react/solid';
import {
  Alert,
  Button,
  DialogPosition,
  renderIcon,
  Typography,
} from '@ecdlink/ui';
import { useCallback, useEffect, useState } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import { RoleList, UpdatePublishStatus } from '@ecdlink/graphql';
import { useTenant } from '../../../../../../hooks/useTenant';
import { format } from 'date-fns';
import AlertModal from '../../../../../../components/dialog-alert/dialog-alert';

export interface FormViewProps {
  content: any;
  contentValues: ContentValueDto[];
  contentType: ContentTypeDto;
  optionDefinitions: ContentDefinitionModelDto[];
  cancelEdit?: () => void;
  savedContent: () => void;
}

export default function FormView({
  content,
  contentValues,
  contentType,
  optionDefinitions,
  cancelEdit,
  savedContent,
}: FormViewProps) {
  const [formData, setFormData] = useState(content);
  const [updatePublishStatus] = useMutation(UpdatePublishStatus);
  const tenant = useTenant();
  const dialog = useDialog();
  const { showMessage } = useSnackbar();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const { data: roleData, refetch } = useQuery(RoleList, {
    fetchPolicy: 'cache-first',
  });

  const [roles, setRoles] = useState<any[]>();
  useEffect(() => {
    if (roleData && roleData.roles) {
      setRoles(roleData.roles);
    }
  }, [roleData]);

  const [rolesToUse, setRolesToUse] = useState<string>();
  useEffect(() => {
    if (roles) {
      const contentRoleIds = content?.roleIds.split(',').map((id) => id.trim());
      const matchedRoles = roles
        .filter((role) => contentRoleIds.includes(role.id))
        .map((role) => role.name);
      matchedRoles.find((x) => x === 'Practitioner')
        ? setRolesToUse('Practitioners (including principals)')
        : setRolesToUse(matchedRoles.toString());
    }
  }, [roles]);

  const handleUnPublish = useCallback(() => {
    dialog({
      position: DialogPosition.Middle,
      render: (onClose) => (
        <AlertModal
          title={`Are you sure you want to unpublish this form?`}
          message={`Once unpublished, app users will no longer have access to the form.  You can always publish the form again in the future.`}
          btnText={['Yes, unpublish', 'No, cancel']}
          alertType="error"
          onCancel={() => {
            onClose();
          }}
          onSubmit={() => {
            updateForm('false');
            onClose();
          }}
        />
      ),
    });
  }, [dialog]);

  const handleDownload = () => {
    if (!formData?.pdfUrl) {
      console.error('No PDF URL found.');
      return;
    }

    const pdfUrl = formData.pdfUrl;

    // Create an invisible link element
    const link = document.createElement('a');
    link.href = pdfUrl;
    link.download = 'Self-assessment Preview.pdf';

    // Ensure it opens in the same tab if download attribute fails (some browsers)
    link.target = '_blank';

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const updateForm = async (isPublished: string) => {
    setIsLoading(true);

    // send update to back-end
    await updatePublishStatus({
      variables: {
        contentId: content.id.toString(),
        isPublished: isPublished,
      },
    })
      .then(() => {
        cancelEdit(); // go back to form list
        if (isPublished === 'true') {
          showMessage({ message: 'Form published', type: 'success' });
        }
      })
      .then(() => {
        setIsLoading(false);
      });
  };

  if (contentType && content) {
    return (
      <div className="flex flex-col space-y-4 rounded-md ">
        {formData?.isPublished === 'true' && formData?.publishedDate !== '' && (
          <Alert
            type="success"
            messageColor="successDark"
            message={`This form was published on ${format(
              new Date(formData?.publishedDate),
              'd MMMM yyyy'
            )} & is available to users on ${tenant.tenant.applicationName}.`}
          />
        )}

        <div className="-ml-4 flex flex-wrap items-center justify-between sm:flex-nowrap">
          <div className="ml-4 ">
            <h2 className="text-xl font-semibold leading-6 text-gray-900">
              {formData?.name} ({formData?.provider})
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
            text={'Which types of users can use this form?'}
            className="text-start"
          />
          <span className="font-bold">{rolesToUse} </span> can use this form to
          assess their programme quality.
        </div>
        <div className="rounded-xl bg-white px-12 pt-6 pb-8">
          <Typography
            type="h3"
            color="black"
            text={`More information about the "${formData?.name}"`}
            className="text-start pb-6"
          />

          <Typography
            type="h5"
            color="black"
            text={formData?.adminDescription.replace(
              '{AppName}',
              tenant.tenant.applicationName
            )}
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
            color={'secondary'}
            onClick={handleDownload}
            className="rounded-xl px-2"
          >
            <div className="flex flex-row items-center">
              {renderIcon('DownloadIcon', `text-secondary h-4 w-4 mr-2`)}
              <a download className="">
                Download preview
              </a>
            </div>
          </Button>
        </div>

        <div className="mt-4 flex flex-row">
          {formData?.isPublished === 'false' ? (
            <>
              <div className="flex justify-center">
                <Button
                  onClick={() => {
                    updateForm('true');
                  }}
                  icon={'SaveIcon'}
                  text="Publish"
                  size="small"
                  color="quatenary"
                  textColor="white"
                  type="filled"
                  isLoading={isLoading}
                  className="bg-quatenary focus:outline-none mt-1 inline-flex items-center justify-center rounded-xl border-2 border-transparent px-24 py-2 font-bold text-white shadow-sm focus:ring-2 focus:ring-offset-2"
                />
              </div>
            </>
          ) : (
            <>
              <div className="flex justify-center">
                <Button
                  onClick={() => {
                    handleUnPublish();
                  }}
                  icon={'LockClosedIcon'}
                  text="Unpublish"
                  type="filled"
                  textColor="quatenary"
                  color="transparent"
                  isLoading={isLoading}
                  className="bg-adminPortalBg focus:outline-none border-quatenary text-quatenary mt-1 inline-flex items-center justify-center rounded-xl border-2 px-24 py-2 font-bold shadow-sm focus:ring-2 focus:ring-offset-2"
                />
              </div>
            </>
          )}
        </div>
      </div>
    );
  } else {
    return <ContentLoader />;
  }
}
