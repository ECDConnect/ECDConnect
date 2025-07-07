using EcdLink.Api.CoreApi.Security.Managers;
using EcdLink.Api.CoreApi.Security.Models;
using EcdLink.Api.CoreApi.Security.Models.Requests;
using ECDLink.Core.Helpers;
using ECDLink.DataAccessLayer.Entities;
using ECDLink.Security.Helpers;
using ECDLink.Security.JwtSecurity.Enums;
using ECDLink.Tenancy.Context;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using System;
using System.Threading.Tasks;

namespace ECDLink.Security.Api
{
    //[Route("api/authentication/online")]
    [AllowAnonymous]
    [ApiController]
    public class OnlineCheckController : ControllerBase
    {
        public OnlineCheckController()
        {
        }


        [Route("api/authentication/online-check")]
        [AllowAnonymous]
        [HttpGet]
        public async ValueTask<IActionResult> OnlineCheckAsync()
        {
            return Ok();
        }
    }
}
