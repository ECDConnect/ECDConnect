using ECDLink.DataAccessLayer.Entities;
using ECDLink.Notifications.Model;
using ECDLink.UrlShortner.Managers;
using System;
using System.Threading.Tasks;

namespace ECDLink.Notifications.Templates
{
    public class TemplateFilters
    {
        private readonly ShortUrlManager _shortenManager;

        public TemplateFilters(ShortUrlManager shortenManager)
        {
            _shortenManager = shortenManager;
        }

        public Func<ITemplateOverrideModel, Task> ShortenUrl(ApplicationUser user, string messageType, Guid? messageLogId)
        {
            return (async model =>
            {
                Uri uriResult;
                bool isCreated = Uri.TryCreate(model.Value, UriKind.Absolute, out uriResult);

                if (!isCreated)
                {
                    return;
                }

                if (!(uriResult.Scheme == Uri.UriSchemeHttp || uriResult.Scheme == Uri.UriSchemeHttps))
                {
                    return;
                }

                var token = await _shortenManager.GetUrlToken(model.Value, user.Id, messageType, messageLogId);

                model.Value = token;
            });
        }

        public Func<ITemplateOverrideModel, Task> ReplaceValue(string replaceValue)
        {
            return async (s) =>
            {
                s.Value = replaceValue;
            };
        }
    }
}
