using ECDLink.Core.Services.Interfaces;
using ECDLink.Core.SystemSettings.SystemOptions;
using ECDLink.DataAccessLayer.Context;
using ECDLink.DataAccessLayer.Entities.Notifications;
using ECDLink.Tenancy.Context;
using Microsoft.AspNetCore.WebUtilities;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ECDLink.UrlShortner.Managers
{
    public class ShortUrlManager
    {
        public enum REDIRECT_STATUS
        {
            OK = 0,
            INVALID = 1,
            UNKNOWN = 2,
            USED = 3
        };

        public class Redirect
        {
            public REDIRECT_STATUS Status { get; set; } = REDIRECT_STATUS.INVALID;
            public string Url { get; set; } = String.Empty;
        }

        private readonly AuthenticationDbContext _dbContext;
        private readonly ISystemSetting<UrlShortnerOptions> _options;

        public ShortUrlManager(ISystemSetting<UrlShortnerOptions> optionsAccessor, AuthenticationDbContext dbContext)
        {
            _dbContext = dbContext;
            _options = optionsAccessor;
        }

        public static string GetUrlChunk(Guid id)
        {
            // Transform the "Id" property on this object into a short piece of text
            return WebEncoders.Base64UrlEncode(id.ToByteArray());
        }

        public static Guid? GetId(string urlChunk)
        {
            if (string.IsNullOrEmpty(urlChunk)) return null;
            // Reverse our short url text back into an interger Id

            try
            {
                return new Guid(WebEncoders.Base64UrlDecode(urlChunk));
            }
            catch (Exception)
            {
                return null;
            }
        }

        public async Task<Redirect> GetRedirectFromChunk(string urlChunk)
        {
            Redirect redirect = new();
            var id = GetId(urlChunk);
            if (id == null)
            {
                redirect.Status = REDIRECT_STATUS.INVALID;
                return redirect;
            }

            var shortUrl = await _dbContext.ShortUrls.SingleOrDefaultAsync(s => s.Id == id && s.IsActive);
            if (shortUrl == null)
            {
                redirect.Status = REDIRECT_STATUS.UNKNOWN;
                return redirect;
            }

            if (shortUrl.MessageType == "ChildRegistration")
            {
                await UpdateClicked(shortUrl.Id);
                redirect.Status = REDIRECT_STATUS.OK;
                redirect.Url = shortUrl.URL;
                return redirect;
            }

            if (shortUrl.Clicked == 0)
            {
                redirect.Status = REDIRECT_STATUS.OK;
                redirect.Url = shortUrl.URL;
                return redirect;
            }

            redirect.Status = REDIRECT_STATUS.USED;
            if (shortUrl.TenantId.HasValue && shortUrl.TenantId.Value != Guid.Empty)
            {
                redirect.Url = await _dbContext.SystemSettings
                    .Where(x => x.TenantId == shortUrl.TenantId.Value && x.FullPath == "General.Callback.Security.Login")
                    .Select(x => x.Value)
                    .SingleOrDefaultAsync();
            }

            if (string.IsNullOrEmpty(redirect.Url))
            {
                var uri = new Uri(shortUrl.URL);
                if (uri.AbsolutePath.Length > 1)
                {
                    redirect.Url = shortUrl.URL.Replace(uri.AbsolutePath, "");
                }
                else
                {
                    redirect.Url = shortUrl.URL;
                }
            }
            return redirect;
        }

        public async Task<string> GetUrlToken(string url, Guid userId, string messageType, Guid? messageLogId = null)
        {
            var tenantId = TenantExecutionContext.Tenant.Id;
            
            var urlEntity = new ShortenUrlEntity
            {
                Id = Guid.NewGuid(),
                URL = url,
                Clicked = 0,
                UserId = userId,
                MessageType = messageType,
                TenantId = tenantId,
                MessageLogId = messageLogId
            };

            _dbContext.ShortUrls.Add(urlEntity);
            await _dbContext.SaveChangesAsync();

            var chunk = GetUrlChunk(urlEntity.Id);

            return $"{_options.Value.RedirectUrl}/{chunk}";
        }

        public async Task UpdateClicked(Guid id)
        {
            await _dbContext.ShortUrls
                .Where(x => x.Id == id)
                .ExecuteUpdateAsync(setters => setters
                    .SetProperty(m => m.Clicked, m => m.Clicked + 1)
                    .SetProperty(m => m.UpdatedDate, DateTime.Now));
        }

        public async Task RemoveShortUrl(Guid userId, string messageType)
        {
            await _dbContext.ShortUrls
                .Where(x => x.UserId == userId && x.MessageType == messageType && x.IsActive)
                .ExecuteUpdateAsync(setters => setters
                    .SetProperty(m => m.Clicked, m => m.Clicked + 1)
                    .SetProperty(m => m.IsActive, false)
                    .SetProperty(m => m.UpdatedDate, DateTime.Now));
        }

        public async Task<int> GetMessageCountForUser(Guid userId, string messageType)
        {
            return await _dbContext.ShortUrls
                .Where(x => x.UserId == userId && x.MessageType == messageType && x.Clicked == 0 && x.IsActive)
                .CountAsync();
        }

        public async Task<string> GetLastMessageDateForUser(Guid userId, string messageType)
        {
            return await _dbContext.ShortUrls
                .Where(x => x.UserId == userId && x.MessageType == messageType && x.Clicked == 0 && x.IsActive)
                .OrderByDescending(x => x.InsertedDate)
                .Select(x => x.InsertedDate.ToString())
                .FirstOrDefaultAsync();
        }

        public async Task<List<DateTime>> GetAllMessageInvitesForUser(Guid userId, string messageType)
        {
            return await _dbContext.ShortUrls
                .Where(x => x.UserId == userId && x.MessageType == messageType && x.Clicked == 0 && x.IsActive)
                .OrderBy(x => x.InsertedDate)
                .Select(x => x.InsertedDate)
                .ToListAsync();
        }

        public async Task<string> GetLatestUrlInviteForUser(Guid userId, string messageType)
        {
            return await _dbContext.ShortUrls
                .Where(x => x.UserId == userId && x.MessageType == messageType && x.Clicked == 0 && x.IsActive)
                .OrderByDescending(x => x.InsertedDate)
                .Select(x => x.URL)
                .FirstOrDefaultAsync();
        }

        public async Task UpdateMessageNotificationResult(Guid userId, string messageType, int notificationResult, Guid? messageLogId = null)
        {
            if (messageLogId.HasValue)
            {
                await _dbContext.ShortUrls
                    .Where(x => x.MessageLogId ==  messageLogId.Value)
                    .ExecuteUpdateAsync(setters => setters.SetProperty(m => m.NotificationResult, notificationResult));
            }
            else
            {

                var shortUrlId = await (from s in _dbContext.ShortUrls
                                        where s.UserId == userId && s.MessageType == messageType && s.IsActive
                                        orderby s.InsertedDate descending
                                        select s.Id as Guid?).FirstOrDefaultAsync();
                if (shortUrlId.HasValue)
                {
                    await _dbContext.ShortUrls
                        .Where(x => x.Id == shortUrlId.Value)
                        .ExecuteUpdateAsync(setters => setters.SetProperty(m => m.NotificationResult, notificationResult));
                }
            }
        }
    }
}
