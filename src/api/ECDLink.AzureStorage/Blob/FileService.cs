using Azure.Storage.Blobs;
using ECDLink.Abstractrions.Enums;
using ECDLink.Core.Helpers;
using ECDLink.Core.Models.Storage;
using ECDLink.Core.Services.Interfaces;
using ECDLink.Core.SystemSettings.SystemOptions;
using FileSignatures;
using FileSignatures.Formats;
using System;
using System.IO;
using System.Threading.Tasks;

namespace ECDLink.AzureStorage.Blob
{
    public class FileService : IFileService
    {
        private ISystemSetting<AzureBlobOptions> _options;
        private BlobServiceClient _blobServiceClient;
        private FileFormatInspector _inspector;

        public FileService(ISystemSetting<AzureBlobOptions> options)
        {
            _options = options;
            _inspector = new FileFormatInspector();
        }

        private BlobServiceClient BlobClient
        {
            get
            {
                if (_blobServiceClient == null)
                {
                    _blobServiceClient = new BlobServiceClient(_options.Value.BlobStorageConnection);
                }

                return _blobServiceClient;
            }
        }

        public async Task<DocumentModel> UploadFile(string file, string fileName, FileTypeEnum fileType)
        {
            try
            {// TODO: \$”{guid}_profile_image/generic file name”
                var fileReference = fileName;

                var container = EnumHelper.GetDescription(fileType);
                var blobContainer = BlobClient.GetBlobContainerClient(container);
                await blobContainer.CreateIfNotExistsAsync();
                await blobContainer.SetAccessPolicyAsync(Azure.Storage.Blobs.Models.PublicAccessType.Blob);

                var blobClient = blobContainer.GetBlobClient(fileName);

                if (!blobClient.Exists())
                {
                    fileReference = $"{Guid.NewGuid()}_{fileName}";
                    blobClient = blobContainer.GetBlobClient(fileReference);
                }

                var bytes = Convert.FromBase64String(file);

                using MemoryStream fileStream = new MemoryStream(bytes);

                ValidateFileType(fileStream);

                await blobClient.UploadAsync(fileStream);

                fileStream.Dispose();

                var fileUrl = blobClient.Uri.AbsoluteUri;

                return new DocumentModel
                {
                    Name = fileName,
                    Url = fileUrl,
                    Reference = fileReference
                };
            }
            catch (Exception e)
            {

                throw;
            }
        }

        public async Task<string> UploadFileStream(MemoryStream file, string fileName, FileTypeEnum fileType)
        {
            try
            {
                ValidateFileType(file);

                var container = EnumHelper.GetDescription(fileType);
                var fileReference = $"{fileName}";
                var blobContainer = BlobClient.GetBlobContainerClient(container);
                await blobContainer.CreateIfNotExistsAsync();
                var blobClient = blobContainer.GetBlobClient(fileReference);
                await blobClient.DeleteIfExistsAsync();

                await blobClient.UploadAsync(file);
                file.Dispose();

                var fileUrl = blobClient.Uri.AbsoluteUri;

                return fileUrl;
            }
            catch (Exception e)
            {

                throw;
            }
        }

        public async Task<byte[]> GetFile(string fileName, FileTypeEnum fileType)
        {
            var memoryStream = new MemoryStream();

            try
            {
                var container = EnumHelper.GetDescription(fileType);
                var fileReference = $"{fileName}";
                var blobContainer = BlobClient.GetBlobContainerClient(container);

                if (!blobContainer.Exists())
                {
                    return null;
                }

                var blobClient = blobContainer.GetBlobClient(fileReference);

                await blobClient.DownloadToAsync(memoryStream);

                return memoryStream.ToArray();
            }
            catch (Exception e)
            {
                memoryStream.Dispose();
                memoryStream.Close();
                throw;
            }
        }

        public async Task<bool> DeleteFile(string fileName, FileTypeEnum fileType)
        {
            try
            {
                var container = EnumHelper.GetDescription(fileType);
                var blobContainer = BlobClient.GetBlobContainerClient(container);

                if (!blobContainer.Exists())
                {
                    return true;
                }

                var blobClient = blobContainer.GetBlobClient(fileName);

                await blobClient.DeleteAsync();

                return true;
            }
            catch (Exception e)
            {
                // log(e)
                return false;
            }
        }

        private void ValidateFileType(MemoryStream fileStream)
        {
            if (!IsUnknownOrValidFileType(fileStream))
            {
                throw new Exception("Unspoorted file type");
            }
        }

        private bool IsUnknownOrValidFileType(MemoryStream fileStream)
        {
            var format = _inspector.DetermineFileFormat(fileStream);

            if (format == null)
            {
                return true;
            }

            if (format is Image)
            {
                return true;
            }

            if (format is Pdf)
            {
                return true;
            }

            if (format is OfficeOpenXml)
            {
                return true;
            }

            return false;
        }
    }
}
