using System.Collections.Generic;

namespace EcdLink.Api.CoreApi.GraphApi.Mutations
{
    public interface IBulkInvitationResult
    {
        IList<string> Success { get; set; }
        IList<string> Failed { get; set; }
    }
}