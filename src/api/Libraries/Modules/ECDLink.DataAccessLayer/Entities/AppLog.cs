using ECDLink.Security;
using ECDLink.Security.Attributes;
using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace ECDLink.DataAccessLayer.Entities
{
    [Table(nameof(AppLog))]
    [EntityPermission(PermissionGroups.GENERAL)]
    public class AppLog
    {
        public Guid Id { get; set; }
        public DateTime InsertedDate { get; set; }
        public Guid? UserId { get; set; }
        public string Details { get; set; } = string.Empty;
        public DateTime EventDate { get; set; }
        public string AppVersion { get; set; } = string.Empty;
        public string Type { get; set; } = string.Empty;
        public string Message { get; set; } = string.Empty;
        public string? Payload { get; set; }
        public string? ClientUrl { get; set; }
        public bool? IsOnline { get; set; }
        public string? RequestPayload { get; set; }
        public string? UserAgent { get; set; }
    }
}