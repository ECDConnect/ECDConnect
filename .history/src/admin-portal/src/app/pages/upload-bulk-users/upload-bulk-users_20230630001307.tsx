import { useLazyQuery, useMutation } from '@apollo/client';
import { HealthCareWorkerTemplate, UploadHealthCareWorkers, importAll } from '@ecdlink/graphql';
import { useForm } from 'react-hook-form';
import FormFileInput from '../../../../../admin-portal/src/app/components/form-file-input/form-file-input';
import { useEffect, useState } from 'react';
import { b64toBlob } from '@ecdlink/core';
import { ArrowLeftIcon, DownloadIcon, PaperAirplaneIcon } from '@heroicons/react/solid';
import { useHistory } from 'react-router';

export interface UploadAllTemplateProps {
  closeDialog: (value: boolean) => void;
}

const acceptedFormats = ['xls', 'xlsx'];

export default function UploadBulkUser({
  closeDialog,
}: UploadAllTemplateProps) {
  const { setValue, handleSubmit, getValues } = useForm();
  const history = useHistory();

  const [templateDownloaded, setTemplateDownloaded] = useState<boolean>(false);

  const [getExcelTemplateGenerator, { data: templateData }] =
    useLazyQuery(HealthCareWorkerTemplate, {
      fetchPolicy: 'cache-and-network',
    });

  const [allImport] = useMutation(importAll);
  const [importPractitioners] = useMutation(UploadHealthCareWorkers);

  const onSubmit = async (values: any) => {
    const model = { ...values };

    if (model.templateFile?.file) {
      await importPractitioners({
        variables: {
          file: model.templateFile?.file,

        },
      });

      closeDialog(true);
    }
  };

  useEffect(() => {
    if (
      templateData &&
      templateData.healthCareWorkerTemplateGenerator &&
      !templateDownloaded
    ) {
      const b64Data =
        templateData.healthCareWorkerTemplateGenerator.base64File;

      console.log(">>>", b64Data)
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

  console.log(getValues('templateFile'))


  return (
    <div className="flex flex-col">
      <div className='justify-self col-end-3 '>
        <button
          onClick={() => history.goBack()}
          type="button"
          className="cursor text-secondary outline-none inline-flex w-full items-center border border-transparent px-4 py-2 text-14 font-medium "
        >
          <ArrowLeftIcon className="text-secondary h-4 w-4 mr-1"> </ArrowLeftIcon>
          Back
          {/* <span className="text-black pl-2"> / View User</span> */}
        </button>
      </div>
      <div className="flex flex-col pt-6">
        <h1 className='text-xl'>
          Step 1: Download the template
        </h1>

        <p className='text-normal pt-4'>
          Download the Excel template below and make sure all required fields are included. It includes instructions for each field. To avoid upload errors, do not modify the headers.
        </p>
        <div className='w-4/12 pt-2'>
          <button
            onClick={() => {
              downloadContentTypeTemplate()
            }}
            type="submit"
            className="bg-secondary hover:bg-uiMid focus:outline-none inline-flex items-center rounded-md border border-transparent px-4 py-2 text-sm font-medium text-white shadow-sm focus:ring-2 focus:ring-offset-2"
          >
            <DownloadIcon className="mr-4 h-5 w-5"> </DownloadIcon>

            Download the template
          </button>
        </div>

      </div>

      <div className='my-12'>
        <h1 className='text-xl'>
          Step 2: Upload excel file
        </h1>
      </div>

      <div className="flex flex-row">
        <div className='bg-white rounded-md w-6/12 p-12'>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className=" "
          >


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
                  disabled={getValues('templateFile') !== undefined  ? false : true}
                  type="submit"
                  className="bg-secondary hover:bg-uiMid focus:outline-none inline-flex items-center rounded-md border border-transparent px-4 py-2.5 text-sm font-medium text-white shadow-sm focus:ring-2 focus:ring-offset-2"
                >
                  <PaperAirplaneIcon className="mr-4 h-5 w-5"> </PaperAirplaneIcon>

                  Add & invite users
                </button>

              </div>
            </div>
          </form>
        </div>
        <div>

        </div>
      </div>

    </div>
  );
}

