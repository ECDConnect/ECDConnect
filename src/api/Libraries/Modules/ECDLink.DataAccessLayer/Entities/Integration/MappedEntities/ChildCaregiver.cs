using ECDLink.Core.Models.Settings;
using ECDLink.DataAccessLayer.Entities.Base;
using ECDLink.Security;
using ECDLink.Security.Attributes;
using Microsoft.Azure.Documents;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace ECDLink.DataAccessLayer.Entities.Integration.MappedEntities
{
    public class MappedChildCaregiver : MappedBaseEntity
    {
        
        MappedChild child { get; set; }
        MappedCaregiver caregiver { get; set; }

    }

}
