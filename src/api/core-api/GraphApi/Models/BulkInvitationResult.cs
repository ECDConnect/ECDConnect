using System.Collections.Generic;

namespace EcdLink.Api.CoreApi.GraphApi.Models
{
    public class BulkInvitationResult : IBulkInvitationResult
    {
        public IList<string> Success { get; set; }
        public IList<string> Failed { get; set; }
    }
}