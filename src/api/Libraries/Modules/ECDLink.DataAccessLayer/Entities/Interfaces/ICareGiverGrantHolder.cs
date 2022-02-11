using System.Collections.Generic;

namespace ECDLink.DataAccessLayer.Entities.Interfaces
{
    public interface ICareGiverGrantHolder
    {
        public int Id { get; set; }

        ICollection<Grant> Grants { get; set; }
    }
}
