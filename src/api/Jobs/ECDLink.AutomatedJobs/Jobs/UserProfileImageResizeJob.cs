using ECDLink.AutomatedJobs.Cron;
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
using SixLabors.ImageSharp.Formats.Jpeg;
using Microsoft.EntityFrameworkCore;

namespace ECDLink.AutomatedJobs.Jobs;

public class UserProfileImageResizeJob : CronJobService
{
    private string _jobId = "ProfileImageResize";
    public UserProfileImageResizeJob(IServiceScopeFactory scopeFactory,
        CronJobConfig<UserProfileImageResizeJob> config, ILogger<UserProfileImageResizeJob> logger)
            : base(scopeFactory, config, logger)
    {
    }

    public override async Task DoWork(CancellationToken cancellationToken)
    {
        {
            var dbContext = Scope.ServiceProvider.GetRequiredService<AuthenticationDbContext>();

            var users = (from u in dbContext.Users
                         where u.ProfileImageUrl != null && u.ProfileImageUrl.Length > 10 * 1024
                         select new { u.Id, u.ProfileImageUrl }
                         ).ToList();

            int userIndex = 0, totalSize = 0, newTotalSize = 0;
            foreach (var user in users)
            {
                userIndex++;
                _logger.LogInformation($"Processing profile image [{userIndex}/{users.Count}]");

                string newDataUrl = "";
                totalSize = totalSize + (!string.IsNullOrEmpty(user.ProfileImageUrl) ? user.ProfileImageUrl.Length : 0);
                if (ResizeDataUrlImage(user.Id, user.ProfileImageUrl, out newDataUrl))
                {
                    if (string.IsNullOrEmpty(newDataUrl))
                    {
                        dbContext.Database.ExecuteSqlRaw(
$@"
    UPDATE ""AspNetUsers"" SET ""ProfileImageUrl""=null WHERE ""Id""='{user.Id}'::uuid;
"
                        );
                    }
                    else
                    {
                        newTotalSize = newTotalSize + newDataUrl.Length;
                        dbContext.Database.ExecuteSqlRaw(
$@"
    UPDATE ""AspNetUsers"" SET ""ProfileImageUrl""='{newDataUrl}' WHERE ""Id""='{user.Id}'::uuid;
"
                        );
                    }
                }
                else
                {
                    newTotalSize = newTotalSize + (!string.IsNullOrEmpty(user.ProfileImageUrl) ? user.ProfileImageUrl.Length : 0);
                }
            }
            _logger.LogInformation($"Total size before {totalSize} after {newTotalSize}");
        }
    }

    public bool ResizeDataUrlImage(Guid id, string dataUrl, out string newDataUrl)
    {
        int imageWidth = 100;
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
                if (image.Width < imageWidth)
                {
                    _logger.LogInformation($"{id} image size: {imageBytes.Length} Width < 100 IGNORED");
                }
                else
                {
                    image.Mutate(x => x.Resize(imageWidth, 0));
                    using (var outputStream = new MemoryStream())
                    {
                        image.Save(outputStream, new JpegEncoder());
                        byte[] resizedImageBytes = outputStream.ToArray();
                        if (resizedImageBytes.Length > imageBytes.Length)
                        {
                            _logger.LogInformation($"{id} image size: {imageBytes.Length} -> {resizedImageBytes.Length} IGNORED");
                        }
                        else
                        {
                            _logger.LogInformation($"{id} image size: {imageBytes.Length} -> {resizedImageBytes.Length}");
                            newDataUrl = "data:image/jpeg;base64," + Convert.ToBase64String(resizedImageBytes);
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
