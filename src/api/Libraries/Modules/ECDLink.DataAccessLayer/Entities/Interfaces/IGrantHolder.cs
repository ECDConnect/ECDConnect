using System.Collections.Generic;

namespace ECDLink.DataAccessLayer.Entities.Interfaces
{
    public interface IGrantHolder
    {
        public string UserId { get; set; }

        public int UserTypeId { get; set; }

        ICollection<Grant> Grants { get; set; }
    }
}
