using ECDLink.DataAccessLayer.Entities.Documents;
using System.Collections.Generic;

namespace ECDLink.DataAccessLayer.Entities.Interfaces
{
    public interface IDocumentQueryable
    {
        ICollection<Document> Documents { get; set; }
    }
}
