using Azure.Storage.Blobs;
using ECDLink.Abstractrions.Enums;
using ECDLink.Core.Helpers;
using ECDLink.Core.Models.Storage;
using ECDLink.Core.Services.Interfaces;
using ECDLink.Core.SystemSettings.SystemOptions;
using FileSignatures;
using FileSignatures.Formats;
using HeyRed.Mime;
using System;
using System.IO;
using System.Linq;
using System.Net.Http;
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

        public async Task<DocumentModel> UploadBase64StringFileAsync(string base64stringFile, string fileName, FileTypeEnum fileType)
        {
            // TODO: Security, js injection at least.
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

                var bytes = Convert.FromBase64String(base64stringFile);

                using MemoryStream fileStream = new MemoryStream(bytes);

                ValidateFileType(fileStream);

                await blobClient.UploadAsync(fileStream);

                fileStream.Dispose();

                var fileUrl = blobClient.Uri.AbsoluteUri;

                return new DocumentModel
                {
                    Name = fileName,
                    Url = ConvertToDisplay(fileUrl),
                    Reference = fileReference
                };
            }
            catch (Exception)
            {

                throw;
            }
        }

        public DocumentModel UploadBase64StringFile(string base64stringFile, string fileName, FileTypeEnum fileType)
        {
            // TODO: Security, js injection at least.
            try
            {// TODO: \$”{guid}_profile_image/generic file name”
                var fileReference = fileName;

                var container = EnumHelper.GetDescription(fileType);
                var blobContainer = BlobClient.GetBlobContainerClient(container);
                blobContainer.CreateIfNotExists();
                blobContainer.SetAccessPolicy(Azure.Storage.Blobs.Models.PublicAccessType.Blob);

                var blobClient = blobContainer.GetBlobClient(fileName);

                if (!blobClient.Exists())
                {
                    fileReference = $"{Guid.NewGuid()}_{fileName}";
                    blobClient = blobContainer.GetBlobClient(fileReference);
                }

                var bytes = Convert.FromBase64String(base64stringFile);

                using MemoryStream fileStream = new MemoryStream(bytes);

                ValidateFileType(fileStream);

                blobClient.Upload(fileStream);

                fileStream.Dispose();

                var fileUrl = blobClient.Uri.AbsoluteUri;

                return new DocumentModel
                {
                    Name = fileName,
                    Url = ConvertToDisplay(fileUrl),
                    Reference = fileReference
                };
            }
            catch (Exception)
            {

                throw;
            }
        }

        public async Task<string> UploadFileStreamAsync(MemoryStream file, string fileName, FileTypeEnum fileType)
        {
            // TODO: Security, js injection at least.
            // TODO: Anyone in TenantA can overwrite TenantB's file if they know the file name? (filenames get guids appended though?)
            // make files tenant specific? What if they need to be mass removed or migrated?
            try
            {
                ValidateFileType(file);

                var container = EnumHelper.GetDescription(fileType);
                var fileReference = $"{fileName}";
                var blobContainer = BlobClient.GetBlobContainerClient(container);
                await blobContainer.CreateIfNotExistsAsync();
                var blobClient = blobContainer.GetBlobClient(fileReference);
                
                //await blobClient.DeleteIfExistsAsync();

                await blobClient.UploadAsync(file, true);
                file.Dispose();

                var fileUrl = blobClient.Uri.AbsoluteUri;

                return ConvertToDisplay(fileUrl);
            }
            catch (Exception)
            {
                throw;
            }
        }

        public async Task<byte[]> GetFileAsync(string fileName, FileTypeEnum fileType)
        {
            fileName = ConvertToActual(fileName);
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
            catch (Exception)
            {
                memoryStream.Dispose();
                memoryStream.Close();
                throw;
            }
        }

        public async Task<byte[]> GetFileAsync(string fileName, string fileTypeDescription)
        {
            return await GetFileAsync(fileName, EnumHelper.GetEnumFromDescription<FileTypeEnum>(fileTypeDescription));
        }

        public async Task<bool> DeleteFileAsync(string fileName, FileTypeEnum fileType)
        {
            try
            {
                fileName = ConvertToActual(fileName);
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
            catch (Exception)
            {
                // log(e)
                return false;
            }
        }

        private string ConvertToActual(string url)
        {
            var display = _options.Value.BlobStorageDisplayUrl;
            var actual = _options.Value.BlobStorageActualUrl;
            if (string.IsNullOrEmpty(display) || string.IsNullOrEmpty(actual) || string.Compare(display, actual, true) == 0)
                return url;
            return url.Replace(display, actual);
        }

        private string ConvertToDisplay(string url)
        {
            var display = _options.Value.BlobStorageDisplayUrl;
            var actual = _options.Value.BlobStorageActualUrl;
            if (string.IsNullOrEmpty(display) || string.IsNullOrEmpty(actual) || string.Compare(display, actual, true) == 0)
                return url;
            return url.Replace(actual, display);
        }

        private void ValidateFileType(MemoryStream fileStream)
        {
            if (!IsUnknownOrValidFileType(fileStream))
            {
                throw new Exception("Unsupported file type");
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

            if (format is MP4 || format is MP4V1)
            {
                return true;
            }

            return false;
        }

        public bool IsImageFileType(string base64stringFile)
        {
            var bytes = Convert.FromBase64String(base64stringFile);
            using MemoryStream fileStream = new MemoryStream(bytes);
            var format = _inspector.DetermineFileFormat(fileStream);
            if (format is FileSignatures.Formats.Image)
            {
                return true;
            }
            return false;
        }

        public async Task<string> GetFileAsBase64Async(string url) // return Task<string>
        {
            using (var client = new HttpClient())
            {
                var bytes = await client.GetByteArrayAsync(url); // there are other methods if you want to get involved with stream processing etc
                var base64String = Convert.ToBase64String(bytes);
                return base64String;
            }
        }

        public string GetFileExtensionFromUrl(string url)
        {
            url = url.Split('?')[0];
            url = url.Split('/').Last();
            return url.Contains('.') ? url.Substring(url.LastIndexOf('.')) : "";
        }

        public string GetMimeType(string extension)
        {
           return MimeTypesMap.GetMimeType(extension);
        }
        public string GetMimeTypeFromUrl(string url)
        {
            var extension = GetFileExtensionFromUrl(url);
            return GetMimeType(extension);
        }

        public FileTypeEnum GetFileTypeEnumFromContainer(string container)
        {
            return EnumHelper.GetEnumFromDescription<FileTypeEnum>(container);
        }

        public void OverrideBaseUrl(string baseUrl)
        {
            // not applicable for azure storage.
        }

    }
}
