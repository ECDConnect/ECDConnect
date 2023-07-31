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

        private Guid? GetId(string urlChunk)
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

        public string GetRedirectFromChunk(string urlChunk)
        {
            var id = GetId(urlChunk);
            if (id == null) return null;

            var shortUrl = _entities.SingleOrDefault(s => s.Id == id);

            if (shortUrl == default(ShortenUrlEntity))
            {
                return string.Empty;
            }

            return shortUrl.URL;
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

        public void RemoveShortUrl(string userId, string messageType)
        {
            var messages = _entities.Where(x => string.Equals(x.UserId, userId) && string.Equals(x.MessageType, messageType));

            if (messages.Any())
            {
                _entities.RemoveRange(messages);

                _dbContext.SaveChanges();
            }
        }

        public int GetMessageCountForUser(string userId, string messageType)
        {
            return _entities.Where(x => string.Equals(x.UserId, userId) && string.Equals(x.MessageType, messageType)).Count();
        }
        public string GetLastMessageDateForUser(string userId, string messageType)
        {
            var selectedEntities = _entities.Where(x => string.Equals(x.UserId, userId) && string.Equals(x.MessageType, messageType))
                .OrderBy(x => x.InsertedDate);
            return selectedEntities?.LastOrDefault()?.InsertedDate.ToString();
        }
        public List<DateTime> GetAllMessageInvitesForUser(string userId, string messageType)
        {
            return _entities.Where(x => string.Equals(x.UserId, userId) && string.Equals(x.MessageType, messageType)).OrderBy(x => x.InsertedDate).Select(x => x.InsertedDate).ToList();
        }
    }
}
