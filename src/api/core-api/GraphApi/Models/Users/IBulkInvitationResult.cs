using System.Collections.Generic;

namespace EcdLink.Api.CoreApi.GraphApi.Models.Users
{
    public interface IBulkInvitationResult
    {
        IList<string> Success { get; set; }
        IList<string> Failed { get; set; }
    }
}