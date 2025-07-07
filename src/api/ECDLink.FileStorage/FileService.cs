using ECDLink.Abstractrions.Enums;
using ECDLink.Core.Helpers;
using ECDLink.Core.Models.Storage;
using ECDLink.Core.Services.Interfaces;
using ECDLink.Tenancy.Context;
using FileSignatures;
using FileSignatures.Formats;
using HeyRed.Mime;
using System;
using System.IO;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;

namespace ECDLink.FileStorage
{
    internal class FileService : IFileService
    {
        private FileServiceConfig _config;
        private FileFormatInspector _inspector;
        private string _storageUrl;

        public FileService(FileServiceConfig config)
        {
            _config = config;
            _inspector = new FileFormatInspector();

            var baseUrl = TenantExecutionContext.Tenant.BlobStorageAddress;
            _storageUrl = CombineUrl(baseUrl, "storage");
        }

        private string GetContainerPath(FileTypeEnum fileType)
        {
            var description = EnumHelper.GetDescription(fileType);
            var path = Path.Combine(_config.FullLocation, description);
            if (!Directory.Exists(path)) Directory.CreateDirectory(path);
            return path;
        }

        private string CombineUrl(string baseUrl, string pathSegment)
        {
            var baseUri = new Uri(baseUrl.EndsWith("/") ? baseUrl : baseUrl + "/");
            var combinedUri = new Uri(baseUri, pathSegment.TrimStart('/'));
            return combinedUri.ToString();
        }

        public async Task<DocumentModel> UploadBase64StringFileAsync(string base64stringFile, string fileName, FileTypeEnum fileType)
        {
            try
            {
                var fileReference = fileName;

                var path = GetContainerPath(fileType);
                var bytes = Convert.FromBase64String(base64stringFile);

                var fileNameWithPath = Path.Combine(path, fileName);
                if (File.Exists(fileNameWithPath))
                {
                    fileReference = $"{Guid.NewGuid()}_{fileName}";
                    fileNameWithPath = Path.Combine(path, fileReference);
                }

                using MemoryStream fileStream = new MemoryStream(bytes);
                ValidateFileType(fileStream);
                fileStream.Dispose();

                await File.WriteAllBytesAsync(fileNameWithPath, bytes);

                return new DocumentModel
                {
                    Name = fileName,
                    Url = ConvertToUrl(fileNameWithPath),
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
            try
            {
                var fileReference = fileName;

                var path = GetContainerPath(fileType);
                var bytes = Convert.FromBase64String(base64stringFile);

                var fileNameWithPath = Path.Combine(path, fileName);
                if (File.Exists(fileNameWithPath))
                {
                    fileReference = $"{Guid.NewGuid()}_{fileName}";
                    fileNameWithPath = Path.Combine(path, fileReference);
                }

                using MemoryStream fileStream = new MemoryStream(bytes);
                ValidateFileType(fileStream);
                fileStream.Dispose();

                File.WriteAllBytes(fileNameWithPath, bytes);

                return new DocumentModel
                {
                    Name = fileName,
                    Url = ConvertToUrl(fileNameWithPath),
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
            try
            {
                var fileReference = $"{fileName}";

                ValidateFileType(file);

                var path = GetContainerPath(fileType);
                var fileNameWithPath = Path.Combine(path, fileReference);
                using (FileStream fileStream = new FileStream(fileName, FileMode.Create, FileAccess.Write))
                {
                    file.Position = 0; // Reset stream position to start
                    await file.CopyToAsync(fileStream);
                }

                return ConvertToUrl(fileNameWithPath);
            }
            catch (Exception)
            {
                throw;
            }
        }

        public async Task<byte[]> GetFileAsync(string fileName, FileTypeEnum fileType)
        {
            try
            {
                var path = GetContainerPath(fileType);
                var fileNameWithPath = Path.Combine(path, fileName);

                if (!File.Exists(fileNameWithPath)) { return null; }

                var bytes = await File.ReadAllBytesAsync(fileNameWithPath);
                return bytes;
            }
            catch (Exception)
            {
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
                var path = GetContainerPath(fileType);
                var fileNameWithPath = Path.Combine(path, fileName);

                if (!File.Exists(fileNameWithPath)) { return false; }

                File.Delete(fileNameWithPath);
                return true;
            }
            catch (Exception)
            {
                // log(e)
                return false;
            }
        }

        private string ConvertToPath(string url)
        {
            return url.Replace(_storageUrl, _config.FullLocation).Replace("/", "\\");
        }

        private string ConvertToUrl(string path)
        {
            return path.Replace(_config.FullLocation, _storageUrl).Replace("\\", "/");
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
            _storageUrl = CombineUrl(baseUrl, "storage");
        }
    }
}
