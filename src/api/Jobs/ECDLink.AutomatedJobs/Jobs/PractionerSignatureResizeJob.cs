using ECDLink.AutomatedJobs.Cron;
using ECDLink.AutomatedJobs.Util;
using ECDLink.DataAccessLayer.Context;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using System.Threading;
using System.Threading.Tasks;
using System.Linq;
using System.IO;
using System;
using SixLabors.ImageSharp;
using SixLabors.ImageSharp.Processing;
using SixLabors.ImageSharp.Formats.Png;
using Microsoft.EntityFrameworkCore;

namespace ECDLink.AutomatedJobs.Jobs;

public class PractitionerSignatureResizeJob : CronJobService
{
    private string _jobId = "ProfileImageResize";
    public PractitionerSignatureResizeJob(IServiceScopeFactory scopeFactory,
        CronJobConfig<PractitionerSignatureResizeJob> config, ILogger<PractitionerSignatureResizeJob> logger)
            : base(scopeFactory, config, logger)
    {
    }

    public override async Task DoWork(CancellationToken cancellationToken)
    {
        {
            var dbContext = Scope.ServiceProvider.GetRequiredService<AuthenticationDbContext>();

            var practitioners = (from u in dbContext.Practitioners
                         where u.SigningSignature != null /* && u.SigningSignature.Length > 10 * 1024*/
                         select new { u.Id, u.SigningSignature }
                         ).ToList();

            int practitionerIndex = 0, totalSize = 0, newTotalSize = 0;
            foreach ( var practitioner in practitioners)
            {
                practitionerIndex++;
                _logger.LogInformation($"Processing SigningSignature [{practitionerIndex}/{practitioners.Count}]");

                string newDataUrl = "";
                totalSize = totalSize + (!string.IsNullOrEmpty(practitioner.SigningSignature) ? practitioner.SigningSignature.Length : 0);
                if (ResizeDataUrlImage(practitioner.Id, practitioner.SigningSignature, out newDataUrl))
                {
                    if (string.IsNullOrEmpty(newDataUrl))
                    {
                        dbContext.Database.ExecuteSqlRaw(
$@"
    UPDATE ""Practitioner"" SET ""SigningSignature""=null WHERE ""Id""='{practitioner.Id}'::uuid;
"
                        );
                    }
                    else
                    {
                        newTotalSize = newTotalSize + newDataUrl.Length;
                        dbContext.Database.ExecuteSqlRaw(
$@"
    UPDATE ""Practitioner"" SET ""SigningSignature""='{newDataUrl}' WHERE ""Id""='{practitioner.Id}'::uuid;
"
                        );
                    }
                }
                else
                {
                    newTotalSize = newTotalSize + (!string.IsNullOrEmpty(practitioner.SigningSignature) ? practitioner.SigningSignature.Length : 0);
                }
            }
            _logger.LogInformation($"Total size before {totalSize} after {newTotalSize}");
        }
    }

    public bool ResizeDataUrlImage(Guid id, string dataUrl, out string newDataUrl)
    {
        int imageHeight = 80;
        newDataUrl = null;
        if (string.IsNullOrEmpty(dataUrl)) return false;
        if (!dataUrl.StartsWith("data:")) return true;
        var semiColonIdx = dataUrl.IndexOf(";");
        if (semiColonIdx < 0) return true;
        var mimeType = dataUrl.Substring(5, semiColonIdx - 5);
        if (!mimeType.StartsWith("image/")) return true;
        string base64Image = dataUrl.Substring(semiColonIdx + 1);
        if (base64Image.StartsWith("base64,")) base64Image = base64Image.Substring(7);

        bool result = false;
        try
        {
            byte[] imageBytes = Convert.FromBase64String(base64Image);
            using (MemoryStream inputStream = new MemoryStream(imageBytes))
            using (Image image = Image.Load(inputStream))
            {
                if (image.Height < imageHeight)
                {
                    _logger.LogInformation($"{id} image size: {imageBytes.Length} Width < 100 IGNORED");
                }
                else
                {
                    image.Mutate(x => x.Resize(0, imageHeight));
                    using (var outputStream = new MemoryStream())
                    {
                        image.Save(outputStream, new PngEncoder());
                        byte[] resizedImageBytes = outputStream.ToArray();
                        if (resizedImageBytes.Length > imageBytes.Length)
                        {
                            _logger.LogInformation($"{id} image size: {imageBytes.Length} -> {resizedImageBytes.Length} IGNORED");
                        }
                        else
                        {
                            _logger.LogInformation($"{id} image size: {imageBytes.Length} -> {resizedImageBytes.Length}");
                            newDataUrl = "data:image/png;base64," + Convert.ToBase64String(resizedImageBytes);
                            result = true;
                        }

                    }
                }
            }
        }
        catch (UnknownImageFormatException ex)
        {
            _logger.LogWarning($"Unknown image format ({dataUrl.Substring(0, 30)}) for {id}, no change made");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, $"Error processing for {id}");
        }
        return result;
    }

  }
