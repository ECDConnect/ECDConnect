import { useMutation } from '@apollo/client';
import { ContentTypeDto } from '@ecdlink/core';
import { contentTypeImport } from '@ecdlink/graphql';
import { useForm } from 'react-hook-form';
import { ContentLoader } from '../../../../../../components/content-loader/content-loader';
import FormFileInput from '../../../../../../components/form-file-input/form-file-input';

export interface UploadContentTemplateProps {
  contentType: ContentTypeDto;
  closeDialog: (value: boolean) => void;
}

const acceptedFormats = ['xlsx'];

export default function UploadContentTemplate({
  contentType,
  closeDialog,
}: UploadContentTemplateProps) {
  const { setValue, handleSubmit } = useForm();

  const [importContent] = useMutation(contentTypeImport);

  const onSubmit = async (values: any) => {
    const model = { ...values };

    if (model.templateFile?.file) {
      await importContent({
        variables: {
          contentTypeId: contentType.id,
          file: model.templateFile?.file,
        },
      });

      closeDialog(true);
    }
  };

  if (contentType) {
    return (
      <div className="flex flex-col">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-8 divide-y divide-gray-200"
        >
          <div className="-ml-4 -mt-2 flex items-center justify-between flex-wrap sm:flex-nowrap">
            <div className="ml-4 mt-2"></div>
            <div className="ml-4 mt-2 flex-shrink-0">
              <button
                onClick={() => closeDialog(false)}
                type="button"
                className="mr-2 inline-flex items-center px-4 py-2.5 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-uiMid hover:bg-primary focus:outline-none focus:ring-2 focus:ring-offset-2"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="inline-flex items-center px-4 py-2.5 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-uiMid focus:outline-none focus:ring-2 focus:ring-offset-2"
              >
                Upload
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
  } else {
    return <ContentLoader />;
  }
}
