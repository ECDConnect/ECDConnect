using ECDLink.DataAccessLayer.Entities;
using ECDLink.Notifications.Model;
using ECDLink.UrlShortner.Managers;
using System;

namespace ECDLink.Notifications.Templates
{
    public class TemplateFilters
    {
        private readonly ShortUrlManager _shortenManager;

        public TemplateFilters(ShortUrlManager shortenManager)
        {
            _shortenManager = shortenManager;
        }

        public Action<ITemplateOverrideModel> ShortenUrl(ApplicationUser user, string messageType)
        {
            return (model =>
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

                var token = _shortenManager.GetUrlToken(model.Value, user, messageType);

                model.Value = token;
            });

        }

        public Action<ITemplateOverrideModel> ReplaceValue(string replaceValue)
        {
            return (s) =>
            {
                s.Value = replaceValue;
            };
        }
    }
}
