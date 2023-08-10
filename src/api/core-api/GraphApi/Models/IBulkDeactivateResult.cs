using System.Collections.Generic;

namespace EcdLink.Api.CoreApi.GraphApi.Models
{
    public interface IBulkDeactivateResult
    {
        IList<string> Success { get; set; }
        IList<string> Failed { get; set; }
    }
}