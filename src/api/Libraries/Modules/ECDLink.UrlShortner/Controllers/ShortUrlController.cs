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
            ShortUrlManager.REDIRECT_STATUS redirectStatus;
            var url = _manager.GetRedirectFromChunk(chunk, out redirectStatus);
            if (redirectStatus == ShortUrlManager.REDIRECT_STATUS.OK)
            {
                return Redirect(url);
            }
            
            var id = _manager.GetId(chunk);
            if (redirectStatus == ShortUrlManager.REDIRECT_STATUS.USED)
            {
                Console.WriteLine("ShortenRedirect: {0}: {1} used before - redirect to {2}", chunk, id, url);
                return Redirect(url);
            }

            if (redirectStatus == ShortUrlManager.REDIRECT_STATUS.UNKNOWN) Console.WriteLine("ShortenRedirect: {0}: {1} unknown - return BadRequest (400)", chunk, id);
            
            if (redirectStatus == ShortUrlManager.REDIRECT_STATUS.INVALID) Console.WriteLine("ShortenRedirect: {0}: invalid - return BadRequest (400)", chunk);
            //return BadRequest();

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
