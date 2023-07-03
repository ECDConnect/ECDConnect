import { useLazyQuery, useMutation } from '@apollo/client';
import { HealthCareWorkerTemplate, UploadHealthCareWorkers, importAll } from '@ecdlink/graphql';
import { useForm } from 'react-hook-form';
import FormFileInput from '../../../../../admin-portal/src/app/components/form-file-input/form-file-input';
import { useEffect, useState } from 'react';
import { b64toBlob } from '@ecdlink/core';

export interface UploadAllTemplateProps {
  closeDialog: (value: boolean) => void;
}

const acceptedFormats = ['xls','xlsx'];

export default function UploadBulkUser({
  closeDialog,
}: UploadAllTemplateProps) {
  const { setValue, handleSubmit } = useForm();

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


  return (
    <div className="flex flex-col">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-8 divide-y divide-gray-200"
      >
        <div className="-ml-4 -mt-2 flex flex-wrap items-center justify-between sm:flex-nowrap">
          <div className="ml-4 mt-2"></div>
          <div className="ml-4 mt-2 flex-shrink-0">
            <button
              onClick={() => closeDialog(false)}
              type="button"
              className="bg-uiMid hover:bg-primary focus:outline-none mr-2 inline-flex items-center rounded-md border border-transparent px-4 py-2.5 text-sm font-medium text-white shadow-sm focus:ring-2 focus:ring-offset-2"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-primary hover:bg-uiMid focus:outline-none inline-flex items-center rounded-md border border-transparent px-4 py-2.5 text-sm font-medium text-white shadow-sm focus:ring-2 focus:ring-offset-2"
            >
              Upload
            </button>
            <button
            onClick={()=> {
            downloadContentTypeTemplate()
            }}
              type="submit"
              className="bg-primary hover:bg-uiMid focus:outline-none inline-flex items-center rounded-md border border-transparent px-4 py-2.5 text-sm font-medium text-white shadow-sm focus:ring-2 focus:ring-offset-2"
            >
              download
            </button>
          </div>
        </div>

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
      </form>
    </div>
  );
}

