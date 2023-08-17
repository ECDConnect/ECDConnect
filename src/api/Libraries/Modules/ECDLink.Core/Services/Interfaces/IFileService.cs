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
        Task<string> UploadFileStream(MemoryStream file, string fileName, FileTypeEnum fileType);
        Task<byte[]> GetFile(string fileName, FileTypeEnum fileType);

        Task<bool> DeleteFile(string fileName, FileTypeEnum fileType);
        Task<string> GetFileAsBase64Async(string url);
        Task<string> GetFileExtensionFromUrl(string url);
        Task<string> GetMimeType(string extension);
    }
}
