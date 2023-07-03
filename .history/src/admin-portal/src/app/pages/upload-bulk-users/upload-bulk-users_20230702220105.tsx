import { useLazyQuery, useMutation } from '@apollo/client';
import {
  HealthCareWorkerTemplate,
  UploadHealthCareWorkers,
  importAll,
} from '@ecdlink/graphql';
import { useForm } from 'react-hook-form';
import FormFileInput from '../../../../../admin-portal/src/app/components/form-file-input/form-file-input';
import { useEffect, useState } from 'react';
import { b64toBlob, useNotifications, NOTIFICATION } from '@ecdlink/core';
import {
  ArrowLeftIcon,
  DownloadIcon,
  PaperAirplaneIcon,
} from '@heroicons/react/solid';
import { useHistory } from 'react-router';
import { Alert } from '@ecdlink/ui';

export interface UploadAllTemplateProps {
  closeDialog: (value: boolean) => void;
}

const acceptedFormats = ['xls', 'xlsx'];

export default function UploadBulkUser({
  closeDialog,
}: UploadAllTemplateProps) {
  const { setValue, handleSubmit } = useForm();
  const history = useHistory();
  const { setNotification } = useNotifications();
  // props.location.state?.component === 'chw'
  const [templateDownloaded, setTemplateDownloaded] = useState<boolean>(false);

  const [getExcelTemplateGenerator, { data: templateData }] = useLazyQuery(
    HealthCareWorkerTemplate,
    {
      fetchPolicy: 'cache-and-network',
    }
  );

  const [allImport] = useMutation(importAll);
  const [importPractitioners, loading] = useMutation(UploadHealthCareWorkers);

  const onSubmit = async (values: any) => {
    const model = { ...values };

    if (model.templateFile?.file) {
      await importPractitioners({
        variables: {
          file: model.templateFile?.file,
        },
      }).then((res) => {
        console.log(res);
        // setNotification({
        //   title: 'Successfully Updated User!',
        //   variant: NOTIFICATION.SUCCESS,
        // });
        if (res.data?.importHealthCareWorkers.validationErrors.length !== 0) {
          setNotification({
            title: 'Error uploading CHWs!',
            variant: NOTIFICATION.ERROR,
          });
        } else {
          setNotification({
            title: `Successfully Uploaded ${res.data?.importHealthCareWorkers.createdUsers} CHWs!`,
            variant: NOTIFICATION.SUCCESS,
          });
        }
      });
    }
  };

  useEffect(() => {
    if (
      templateData &&
      templateData.healthCareWorkerTemplateGenerator &&
      !templateDownloaded
    ) {
      const b64Data = templateData.healthCareWorkerTemplateGenerator.base64File;
      const contentType =
        templateData.healthCareWorkerTemplateGenerator.fileType;
      const fileName = templateData.healthCareWorkerTemplateGenerator.fileName;
      const extension =
        templateData.healthCareWorkerTemplateGenerator.extension;
      const blob = b64toBlob(b64Data, contentType);

      const link = document.createElement('a');

      if (link.download !== undefined) {
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `${fileName}${extension}`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }

      setTemplateDownloaded(true);
    }
  }, [templateData, templateDownloaded]);

  const downloadContentTypeTemplate = async () => {
    setTemplateDownloaded(false);
    await getExcelTemplateGenerator();
  };

  return (
    <div className="flex flex-col">
      <div className="justify-self col-end-3 ">
        <button
          onClick={() => history.goBack()}
          type="button"
          className="cursor text-secondary outline-none text-14 inline-flex w-full items-center border border-transparent px-4 py-2 font-medium "
        >
          <ArrowLeftIcon className="text-secondary mr-1 h-4 w-4">
            {' '}
          </ArrowLeftIcon>
          Back
          {/* <span className="text-black pl-2"> / View User</span> */}
        </button>
      </div>
      <div className="flex flex-col pt-6">
        <h1 className="text-xl">Step 1: Download the template</h1>

        <p className="text-normal">
          Download the Excel template below and make sure all required fields
          are included. It includes instructions for each field. To avoid upload
          errors, do not modify the headers.
        </p>
        <div className="w-4/12 pt-4">
          <button
            onClick={() => {
              downloadContentTypeTemplate();
            }}
            type="submit"
            className="bg-secondary hover:bg-uiMid focus:outline-none inline-flex items-center rounded-md border border-transparent px-4 py-2 text-sm font-medium text-white shadow-sm focus:ring-2 focus:ring-offset-2"
          >
            <DownloadIcon className="mr-4 h-5 w-5"> </DownloadIcon>
            Download the template
          </button>
        </div>
      </div>

      <div className="my-12">
        <h1 className="text-xl">Step 2: Upload excel file</h1>
      </div>

      <div className="flex flex-row">
        <div className="w-6/12 rounded-md bg-white p-16">
          <form onSubmit={handleSubmit(onSubmit)} className=" ">
            <div className="pt-4 pb-8">
              <div className="sm:col-span-12">
                <FormFileInput
                  acceptedFormats={acceptedFormats}
                  label={'Template Upload'}
                  nameProp={'templateFile'}
                  returnFullUrl={false}
                  setValue={setValue}
                  isImage={false}
                />
              </div>
            </div>
            <div className="-ml-4 -mt-2 flex flex-wrap items-center justify-between sm:flex-nowrap">
              <div className="ml-4 mt-2 flex-shrink-0">
                <button
                  type="submit"
                  className="bg-secondary hover:bg-uiMid focus:outline-none inline-flex items-center rounded-md border border-transparent px-4 py-2.5 text-sm font-medium text-white shadow-sm focus:ring-2 focus:ring-offset-2"
                >
                  <PaperAirplaneIcon className=" mr-1 h-4 w-4">
                    {' '}
                  </PaperAirplaneIcon>
                  Add & invite users
                </button>
              </div>
            </div>
          </form>

      {/* { (
        <Alert
          className="mt-5 mb-3 rounded-md"
          message={`Error`}
          type="error"
        
        />
      )} */}
        </div>
        <div></div>
      </div>
    </div>
  );
}
