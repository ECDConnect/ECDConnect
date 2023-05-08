using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ECDLink.DataAccessLayer.Entities.Integration.MappedEntities
{
    public enum MappingMaskDataMode
    {
        MaskAll,
        MaskNumbers,
        MaskEmailsAndNumbers,
        MaskIds,
        MaskEmails,
        None
    }
}
