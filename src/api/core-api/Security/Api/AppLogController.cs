
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using System.Linq;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using ECDLink.DataAccessLayer.Context;
using ECDLink.DataAccessLayer.Entities;
using HotChocolate;

[ApiController]
[Route("api/applog")]
public class AppLogController : ControllerBase

{
    public class InsertAppLogModel
    {
        public string Details { get; set; }
        public DateTime EventDate { get; set; }
        public string AppVersion { get; set; }
        public string Type { get; set; }
        public string Message { get; set; }
        public string? Payload { get; set; }
        public string ClientUrl { get; set; }
        public bool? IsOnline { get; set; }
        public string? RequestPayload { get; set; }
        public string UserAgent { get; set; }
        
    }


    private readonly AuthenticationDbContext _context;
    private readonly Guid? _userId;


    public AppLogController(
    AuthenticationDbContext context,
    IHttpContextAccessor contextAccessor
  )
    {
        _context = context ?? throw new ArgumentNullException(nameof(context));
        contextAccessor = contextAccessor ?? throw new ArgumentNullException(nameof(contextAccessor));
        _userId = string.IsNullOrEmpty(contextAccessor.HttpContext?.User?.Identity?.Name) ? null : Guid.Parse(contextAccessor.HttpContext.User.Identity.Name);

    }

    [HttpPost]
    public async Task<ActionResult> PostAppLog([FromBody] List<InsertAppLogModel> logs,
        ILogger<AppLogController> logger)
    {
        if (logs == null || !logs.Any())
            return BadRequest("At least one error is required.");

        try
        {

            var appLogs = logs.Select(l => new AppLog
            {
                Id = Guid.NewGuid(),
                UserId = _userId,
                InsertedDate = DateTime.Now,
                EventDate = l.EventDate,
                AppVersion = l.AppVersion ?? string.Empty,
                Type = l.Type ?? string.Empty,
                Message = l.Message ?? string.Empty,
                Payload = l.Payload,
                ClientUrl = l.ClientUrl,
                IsOnline = l.IsOnline,
                RequestPayload = l.RequestPayload,
                UserAgent = l.UserAgent,
            }).ToList() ?? new List<AppLog>();

            _context.AppLog.AddRange(appLogs);
            await _context.SaveChangesAsync();

            return Ok();
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error saving app log " + ex.Message);
            return StatusCode(500, ex.InnerException?.Message ?? ex.Message);

        }
    }
}
