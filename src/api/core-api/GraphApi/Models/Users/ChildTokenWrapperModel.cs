using System;

namespace EcdLink.Api.CoreApi.GraphApi.Models.Users
{
    public class ChildTokenWrapperModel
    {
        public string AddedByUserId { get; set; }

        public Guid ChildId { get; set; }

        public string ChildUserId { get; set; }

        public Guid ClassroomGroupId { get; set; }

        public string Token { get; set; }
    }
}
