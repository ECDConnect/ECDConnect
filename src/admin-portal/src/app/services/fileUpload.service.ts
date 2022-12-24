import { FileTypeEnum, FileUpload } from '@ecdlink/graphql';
import { apolloClient } from '../app';
import { getCompressedImage } from '@ecdlink/core';

class CustomUploadAdapter {
  loader: any;

  constructor(loader) {
    // The file loader instance to use during the upload.
    this.loader = loader;
  }

  // Starts the upload process.
  async upload() {
    return this.loader.file.then(
      (file) =>
        new Promise(async (resolve, reject) => {
          const loader = this.loader;
          const genericErrorText = `Couldn't upload file: ${file.name}.`;
          let compressedImage = await getCompressedImage(file);

          const reader = new FileReader();
          reader.readAsDataURL(compressedImage);
          reader.onload = (onload: any) => {
            const base64Result = reader.result?.toString().split('base64,')[1];
            apolloClient
              .mutate({
                mutation: FileUpload,
                variables: {
                  file: base64Result,
                  fileName: file.name,
                  fileType: FileTypeEnum.ContentImage, // TODO: Use new entry: FileTypeEnum.ContentImage
                },
              })
              .then((result) => {
                if (result && result.data) {
                  loader.uploadTotal = result.data.total;
                  loader.uploaded = true;
                  resolve(result.data.fileUpload.url);
                }
              })
              .catch(() => {
                loader.uploaded = false;
                loader.uploadTotal = 0;
                reject(genericErrorText);
              })
              .finally(() => console.log('Upload done running.'));
          };
        })
    );
  }

  // Aborts the upload process.
  abort() {
    // TODO: Can this be implemented with useMutation?
  }
}

export function CKEditorCustomUploadAdapterPlugin(editor: any) {
  editor.plugins.get('FileRepository').createUploadAdapter = (loader) => {
    // Configure the URL to the upload script in your back-end here!
    return new CustomUploadAdapter(loader);
  };
}
