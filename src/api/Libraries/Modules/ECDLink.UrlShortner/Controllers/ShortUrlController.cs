using ECDLink.Core.Services.Interfaces;
using ECDLink.Core.SystemSettings.SystemOptions;
using ECDLink.UrlShortner.Managers;
using Microsoft.AspNetCore.Mvc;
using System;

namespace ECDLink.UrlShortner.Controllers
{
    [ApiController]
    public class ShortUrlController : ControllerBase
    {
        private readonly ShortUrlManager _manager;
        private ISystemSetting<SecurityNotificationOptions> _options;

        public ShortUrlController(ShortUrlManager manager, ISystemSetting<SecurityNotificationOptions> optionAccessor)
        {
            _manager = manager;
            _options = optionAccessor;
        }

        [HttpGet, Route("/{chunk}")]
        public IActionResult ShortenRedirect([FromRoute] string chunk)
        {
            var redirect = _manager.GetRedirectFromChunk(chunk);

            if (string.IsNullOrWhiteSpace(redirect))
            {
                var loginUrl = _options.Value.Login;

                if (redirect == null)
                    Console.WriteLine("ShortenRedirect: Error parsing chunk - redirect to {0}", loginUrl);
                else
                    Console.WriteLine("ShortenRedirect: Unknown chunk - redirect to {0}", loginUrl);

                return Redirect(loginUrl);
                //throw new Exception("Error parsing Chunk");
            }

            return Redirect(redirect);
        }
    }
}
