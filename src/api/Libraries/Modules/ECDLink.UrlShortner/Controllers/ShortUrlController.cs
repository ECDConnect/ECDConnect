using ECDLink.UrlShortner.Managers;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Threading.Tasks;

namespace ECDLink.UrlShortner.Controllers
{
    [ApiController, Route("/")]
    public class ShortUrlController : ControllerBase
    {
        private readonly ShortUrlManager _manager;

        public ShortUrlController(ShortUrlManager manager)
        {
            _manager = manager;
        }

        [HttpGet, Route("{chunk}")]
        public async Task<IActionResult> ShortenRedirect([FromRoute] string chunk)
        {
            var redirect = await _manager.GetRedirectFromChunk(chunk);
            if (redirect.Status == ShortUrlManager.REDIRECT_STATUS.OK)
            {
                return Redirect(redirect.Url);
            }
            
            if (redirect.Status == ShortUrlManager.REDIRECT_STATUS.USED)
            {
                return Redirect(redirect.Url);
            }

            return GetUnknownPage();
        }

        private ContentResult GetUnknownPage()
        {
            var html = @"
<!DOCTYPE html>
<html>
<head>
    <meta charset=""utf-8"" />
</head>
<body style='font-family: sans-serif'>
    <p>Unknown short url.</p>
</body>
</html>
";
            return base.Content(html, "text/html");
        }
    }
}
