using System;
using System.Collections.Generic;

namespace EcdLink.Api.CoreApi.GraphApi.Models
{
    public class MessageLogModel
    {
        public string SendByUserId { get; set; }
        public string ProvinceId { get; set; }
        public string DistrictId { get; set; }
        public List<string> RoleIds { get; set; }
        public string RoleNames { get; set; }
        public string WardName { get; set; }
        public DateTime MessageDate { get; set; }
        public string MessageTime { get; set; }
        public string Subject { get; set; }
        public string Message { get; set; }
        public string ToGroups { get; set;}
        public string Status { get; set; }
        public bool IsEdit { get; set; }
        public List<Guid> MessageLogIds { get; set; }
    }
}

