using ECDLink.Core.Services.Interfaces;
using ECDLink.Core.SystemSettings.SystemOptions;
using ECDLink.DataAccessLayer.Context;
using ECDLink.DataAccessLayer.Entities;
using ECDLink.DataAccessLayer.Entities.Notifications;
using ECDLink.Tenancy.Context;
using HotChocolate.Types;
using Microsoft.AspNetCore.WebUtilities;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;

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

        private readonly AuthenticationDbContext _dbContext;
        private readonly DbSet<ShortenUrlEntity> _entities;
        private ISystemSetting<UrlShortnerOptions> _options;

        public ShortUrlManager(ISystemSetting<UrlShortnerOptions> optionsAccessor, AuthenticationDbContext dbContext)
        {
            _dbContext = dbContext;
            _entities = dbContext.ShortUrls;
            _options = optionsAccessor;
        }

        public string GetUrlChunk(Guid id)
        {
            // Transform the "Id" property on this object into a short piece of text
            return WebEncoders.Base64UrlEncode(id.ToByteArray());
        }

        public Guid? GetId(string urlChunk)
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

        public string GetRedirectFromChunk(string urlChunk, out REDIRECT_STATUS status)
        {
            var id = GetId(urlChunk);
            if (id == null)
            {
                status = REDIRECT_STATUS.INVALID;
                return null;
            }

            var shortUrl = _entities.SingleOrDefault(s => s.Id == id);
            
            if (shortUrl == default(ShortenUrlEntity))
            {
                status = REDIRECT_STATUS.UNKNOWN;
                return string.Empty;
            }
            
            if (shortUrl.Clicked == 0)
            {
                status = REDIRECT_STATUS.OK;
                return shortUrl.URL;
            }

            status = REDIRECT_STATUS.USED;
            var url = "";
            if (shortUrl.TenantId.HasValue && shortUrl.TenantId.Value != Guid.Empty)
            {
                var settings = _dbContext.SystemSettings.SingleOrDefault(x => x.TenantId == shortUrl.TenantId.Value && x.FullPath == "General.Callback.Security.Login");
                if (settings != null)
                {
                    url = settings.Value;
                }
            }
            if (string.IsNullOrEmpty(url))
            {
                var uri = new Uri(shortUrl.URL);
                if (uri.AbsolutePath.Length > 1)
                {
                    url = shortUrl.URL.Replace(uri.AbsolutePath, "");
                }
                else
                {
                    url = shortUrl.URL;
                }
            }
            return url;
        }

        public string GetUrlToken(string url, ApplicationUser user, string messageType)
        {
            var tenantId = TenantExecutionContext.Tenant.Id;
            
            var urlEntity = new ShortenUrlEntity
            {
                Id = new Guid(),
                URL = url,
                Clicked = 0,
                UserId = user.Id,
                MessageType = messageType,
                TenantId = tenantId
            };

            _entities.Add(urlEntity);

            _dbContext.SaveChanges();

            var chunk = GetUrlChunk(urlEntity.Id);

            return $"{_options.Value.RedirectUrl}/{chunk}";
        }

        public void RemoveShortUrl(Guid userId, string messageType)
        {
            var messages = _entities.Where(x => x.UserId == userId && string.Equals(x.MessageType, messageType) & x.IsActive);

            if (messages.Any())
            {
                foreach (var message in messages)
                {
                    message.Clicked++;
                }

                _dbContext.SaveChanges();
            }
        }

        public int GetMessageCountForUser(Guid userId, string messageType)
        {
            return _entities
                .Where(x => x.UserId == userId && string.Equals(x.MessageType, messageType) && x.Clicked == 0)
                .Count();
        }

        public string GetLastMessageDateForUser(Guid userId, string messageType)
        {
            var selectedEntities = _entities
                .Where(x => x.UserId == userId && string.Equals(x.MessageType, messageType) && x.Clicked == 0)
                .OrderBy(x => x.InsertedDate);
            return selectedEntities?.LastOrDefault()?.InsertedDate.ToString();
        }

        public List<DateTime> GetAllMessageInvitesForUser(Guid userId, string messageType)
        {
            return _entities
                .Where(x => x.UserId == userId && string.Equals(x.MessageType, messageType) && x.Clicked == 0)
                .OrderBy(x => x.InsertedDate)
                .Select(x => x.InsertedDate)
                .ToList();
        }

        public string GetLatestUrlInviteForUser(Guid userId, string messageType)
        {
            return _entities.Where(x => x.UserId == userId && string.Equals(x.MessageType, messageType) & x.IsActive && x.Clicked == 0).OrderByDescending(x => x.InsertedDate).Select(x => x.URL).FirstOrDefault();
        }

        public void UpdateMessageNotificationResult(Guid userId, string messageType, int notificationResult)
        {
            var message = _entities.Where(x => x.UserId == userId && string.Equals(x.MessageType, messageType) & x.IsActive).OrderByDescending(x => x.InsertedDate).FirstOrDefault();
            if (message != null)
            {
                message.NotificationResult = notificationResult;
                _dbContext.SaveChanges();
            }
        }
    }
}
