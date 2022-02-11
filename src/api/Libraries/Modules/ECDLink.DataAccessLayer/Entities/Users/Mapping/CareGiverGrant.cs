using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace ECDLink.DataAccessLayer.Entities.Users.Mapping
{
    public class CareGiverGrant
    {
        public int Id { get; set; }

        [ForeignKey(nameof(GrantId))]
        public virtual Grant Grant { get; set; }

        public Guid GrantId { get; set; }
    }
}
