import { useMutation } from '@apollo/client';
import { importAll } from '@ecdlink/graphql';
import { useForm } from 'react-hook-form';
import FormFileInput from '../../../../../../components/form-file-input/form-file-input';

export interface UploadAllTemplateProps {
  closeDialog: (value: boolean) => void;
}

const acceptedFormats = ['xls'];

export default function UploadAllTemplate({
  closeDialog,
}: UploadAllTemplateProps) {
  const { setValue, handleSubmit } = useForm();

  const [allImport] = useMutation(importAll);

  const onSubmit = async (values: any) => {
    const model = { ...values };

    if (model.templateFile?.file) {
      await allImport({
        variables: {
          file: model.templateFile?.file,
        },
      });

      closeDialog(true);
    }
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
