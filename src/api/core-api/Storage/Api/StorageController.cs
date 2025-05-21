using ECDLink.Abstractrions.Enums;
using ECDLink.Core.Services.Interfaces;
using ECDLink.Security.Extensions;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.IO;
using System.Threading.Tasks;

namespace EcdLink.Api.CoreApi.Storage.Api
{
    [Authorize]
    [ApiController]

    public class StorageController : ControllerBase
    {
        private readonly IFileService _fileService;
        private readonly IHttpContextAccessor _contextAccessor;

        public StorageController(IFileService fileService, IHttpContextAccessor contextAccessor)
        {
            _fileService = fileService;
            _contextAccessor = contextAccessor;
        }

        [HttpGet]
        [AllowAnonymous]
        [Route("storage/{container}/{*path}")]
        public async Task<IActionResult> GetFile(string container, string path)
        {
            VerifyAccess(container);
            try
            {
                var fileBytes = await _fileService.GetFileAsync(path, container);

                if (fileBytes == null)
                {
                    return NotFound($"File not found: {container}/{path}");
                }

                var contentType = _fileService.GetMimeTypeFromUrl(path);

                return File(fileBytes, contentType);
            }
            catch (IOException ex)
            {
                return StatusCode(500, $"Error reading file: {ex.Message}");
            }
        }

        /*
        [AllowAnonymous]
        [HttpPost]
        [Route("storage/test")]
        public async Task<IActionResult> Test()
        {
            OverrideFileServiceBaseUrlIfNeeded();

            var docModel = await _fileService.UploadBase64StringFileAsync("", "test.png", ECDLink.Abstractrions.Enums.FileTypeEnum.ContentImage);

            {
                using MemoryStream memStream = new MemoryStream(new byte[] { });
                var uploadFileStreamResult = await _fileService.UploadFileStreamAsync(memStream, docModel.Reference, ECDLink.Abstractrions.Enums.FileTypeEnum.ContentImage);
            }

            return StatusCode(200);
        }
        */

        private void OverrideFileServiceBaseUrlIfNeeded()
        {
            var currentDomain = GetCurrentDomain();
            if (currentDomain.Contains("localhost")) _fileService.OverrideBaseUrl(currentDomain);
        }

        private string GetCurrentDomain()
        {
            var request = _contextAccessor.HttpContext.Request;
            return $"{request.Scheme}://{request.Host}";
        }

        private void VerifyAccess(string container)
        {
            if (container == null) throw new UnauthorizedAccessException();
            
            var fileType = _fileService.GetFileTypeEnumFromContainer(container);
            
            // anonymous access allowed
            if (fileType == FileTypeEnum.Theme) return;

            // authorized only.
            var user = _contextAccessor.HttpContext.GetUser();
            if (user == null) throw new UnauthorizedAccessException();
            return;
        }

    }



}
