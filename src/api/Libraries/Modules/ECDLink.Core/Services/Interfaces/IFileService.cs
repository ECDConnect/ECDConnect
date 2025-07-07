using ECDLink.Abstractrions.Enums;
using ECDLink.Core.Models.Storage;
using System.IO;
using System.Threading.Tasks;

namespace ECDLink.Core.Services.Interfaces
{
    public interface IFileService
    {
        Task<DocumentModel> UploadBase64StringFileAsync(string base64stringFile, string fileName, FileTypeEnum fileType);
        DocumentModel UploadBase64StringFile(string base64stringFile, string fileName, FileTypeEnum fileType);
        Task<string> UploadFileStreamAsync(MemoryStream file, string fileName, FileTypeEnum fileType);
        Task<byte[]> GetFileAsync(string fileName, FileTypeEnum fileType);
        Task<byte[]> GetFileAsync(string fileName, string fileTypeDescription);
        Task<bool> DeleteFileAsync(string fileName, FileTypeEnum fileType);
        Task<string> GetFileAsBase64Async(string url);
        string GetFileExtensionFromUrl(string url);
        string GetMimeType(string extension);
        string GetMimeTypeFromUrl(string url);
        bool IsImageFileType(string base64stringFile);
        FileTypeEnum GetFileTypeEnumFromContainer(string container);
        void OverrideBaseUrl(string baseUrl);
    }
}
