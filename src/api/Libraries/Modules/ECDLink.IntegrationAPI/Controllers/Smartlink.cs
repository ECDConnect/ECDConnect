using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ECDLink.IntegrationAPI.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class Smartlink : ControllerBase
    {

        private readonly ILogger<Smartlink> _logger;

        public Smartlink(ILogger<Smartlink> logger)
        {
            _logger = logger;
        }

    }
}
