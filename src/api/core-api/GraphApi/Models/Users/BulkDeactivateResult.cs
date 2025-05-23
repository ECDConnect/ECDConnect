using System.Collections.Generic;

namespace EcdLink.Api.CoreApi.GraphApi.Models.Users
{
    public class BulkDeactivateResult : IBulkDeactivateResult
    {
        public IList<string> Success { get; set; }
        public IList<string> Failed { get; set; }
    }
}