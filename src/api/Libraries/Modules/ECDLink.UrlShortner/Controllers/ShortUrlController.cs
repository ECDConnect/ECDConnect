using ECDLink.UrlShortner.Managers;
using Microsoft.AspNetCore.Mvc;
using System;

namespace ECDLink.UrlShortner.Controllers
{
    [ApiController]
    public class ShortUrlController : ControllerBase
    {
        private readonly ShortUrlManager _manager;

        public ShortUrlController(ShortUrlManager manager)
        {
            _manager = manager;
        }

        [HttpGet, Route("/{chunk}")]
        public IActionResult ShortenRedirect([FromRoute] string chunk)
        {
            var redirect = _manager.GetRedirectFromChunk(chunk);

            if (string.IsNullOrWhiteSpace(redirect))
            {
                throw new Exception("Error parsing Chunk");
            }

            return Redirect(redirect);
        }
    }
}
