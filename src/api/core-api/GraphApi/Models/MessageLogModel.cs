using System;

namespace EcdLink.Api.CoreApi.GraphApi.Models
{
    public class MessageLogModel
    {
        public string SendByUserId { get; set; }
        public string ProvinceId { get; set; }
        public string DistrictId { get; set; }
        public DateTime? MessageDate { get; set; }
        public string MessageTime { get; set; }
        public string Subject { get; set; }
        public string Message { get; set; }
        public string ToGroups { get; set; }

    }
}

