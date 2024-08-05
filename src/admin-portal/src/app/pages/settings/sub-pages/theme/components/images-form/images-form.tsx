import { useTheme } from '@ecdlink/core';
import FormFileInput from '../../../../../../components/form-file-input/form-file-input';
import { FormComponentProps } from '../../../../../../models/FormComponentProps';
import { ThemeImages } from '../../../../../../schemas/themeImages';

const acceptedFormats = ['svg', 'png', 'PNG'];

export function ImagesForm({ setValue }: FormComponentProps<ThemeImages>) {
  const { theme } = useTheme();
  console.log({ theme });
  return (
    <form key={`themeimagesForm:${new Date().getTime()}`}>
      <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-12">
        <div className="sm:col-span-4">
          <FormFileInput
            acceptedFormats={acceptedFormats}
            contentUrl={theme?.images.logoUrl}
            label={'Logo'}
            nameProp="logoUrl"
            setValue={setValue}
          />
        </div>

        <div className="sm:col-span-4">
          <FormFileInput
            acceptedFormats={acceptedFormats}
            contentUrl={theme?.images.graphicOverlayUrl}
            label={'Graphic Overlay'}
            nameProp="graphicOverlayUrl"
            setValue={setValue}
          />
        </div>

        <div className="sm:col-span-4">
          <FormFileInput
            acceptedFormats={['ico']}
            contentUrl={theme?.images.faviconUrl}
            label={'Favicon'}
            nameProp="faviconUrl"
            setValue={setValue}
          />
        </div>

        <div className="sm:col-span-4">
          <FormFileInput
            acceptedFormats={acceptedFormats}
            contentUrl={theme?.images.portalLoginLogoUrl}
            label={'Portal Login Logo'}
            nameProp="portalLoginLogoUrl"
            setValue={setValue}
          />
        </div>

        <div className="sm:col-span-4">
          <FormFileInput
            acceptedFormats={acceptedFormats}
            contentUrl={theme?.images.portalLoginBackgroundUrl}
            label={'Portal Login Background'}
            nameProp="portalLoginBackgroundUrl"
            byPassCompression={true}
            setValue={setValue}
          />
        </div>
      </div>
    </form>
  );
}
