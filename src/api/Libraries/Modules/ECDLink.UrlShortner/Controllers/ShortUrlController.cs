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
            var loginUrl = _options.Value.Login;

            if (string.IsNullOrWhiteSpace(redirect))
            {
                Console.WriteLine("Error parsing chunk - redirect to Login");
                return Redirect(loginUrl);
                //throw new Exception("Error parsing Chunk");
            }

            return Redirect(redirect);
        }
    }
}
