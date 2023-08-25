/*
 * using ECDLink.Moodle.Managers;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using System.Threading.Tasks;

namespace ECDLink.Moodle.Controllers
{
    [Route("api/moodle")]
    [ApiController]
    public class MoodleController : ControllerBase
    {
        private readonly ILogger<MoodleController> _logger;
        private readonly IConfiguration _configuration;

        public MoodleController(ILogger<MoodleController> logger, IConfiguration configuration)
        {
            _logger = logger;
            _configuration = configuration;
        }

        [HttpGet]
        [Route("create-session/{username}")]
        public async Task<string> GetSessionAsync([FromRoute] string username)
        {
            MoodleManager moodleManager = new MoodleManager(_configuration);
            return await moodleManager.CreateUserSessionAsync(username);
        }
    }
}
*/