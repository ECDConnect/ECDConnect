import { FileTypeEnum, FileUpload } from '@ecdlink/graphql';
import { apolloClient } from '../app';
import { getCompressedImage } from '@ecdlink/core';

class CustomUploadAdapter {
  loader: any;

  constructor(loader) {
    // The file loader instance to use during the upload.
    this.loader = loader;
  }

  async readFileAsBase64Async(file) {
    return new Promise((resolve, reject) => {
      let reader = new FileReader();

      reader.onload = () => {
        resolve(reader.result?.toString().split('base64,')[1]);
      };

      reader.onerror = reject;

      reader.readAsDataURL(file);
    });
  }

  // Starts the upload process.
  async upload() {
    let file = await this.loader.file;
    let result = new Promise(async (resolve, reject) => {
      const loader = this.loader;
      const genericErrorText = `Couldn't upload file: ${file.name}.`;
      let compressedImage = await getCompressedImage(file);
      const base64Result = await this.readFileAsBase64Async(compressedImage);

      apolloClient
        .mutate({
          mutation: FileUpload,
          variables: {
            file: base64Result,
            fileName: file.name,
            fileType: FileTypeEnum.ContentImage,
          },
        })
        .then((result) => {
          if (result && result.data) {
            loader.uploadTotal = result.data.total;
            loader.uploaded = true;
            resolve({
              urls: { default: result.data.fileUpload.url },
            });
          } else {
            reject(genericErrorText);
          }
        })
        .catch(() => {
          loader.uploaded = false;
          loader.uploadTotal = 0;
          reject(genericErrorText);
        });
    });

    return result;
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
