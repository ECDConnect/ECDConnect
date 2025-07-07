using System.Collections.Generic;

namespace EcdLink.Api.CoreApi.GraphApi.Models.Users
{
    public interface IBulkDeactivateResult
    {
        IList<string> Success { get; set; }
        IList<string> Failed { get; set; }
    }
}