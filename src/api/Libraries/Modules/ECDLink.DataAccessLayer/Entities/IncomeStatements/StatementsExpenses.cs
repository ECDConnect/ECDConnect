using ECDLink.Core.Models.Settings;
using ECDLink.DataAccessLayer.Entities.Base;
using ECDLink.DataAccessLayer.Entities.Classroom;
using ECDLink.DataAccessLayer.Entities.IncomeStatements;
using ECDLink.PostgresTenancy.Entities.Base;
using ECDLink.Security;
using ECDLink.Security.Attributes;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace ECDLink.DataAccessLayer.Entities
{
    [Table(nameof(StatementsExpenses))]
    [EntityPermission(PermissionGroups.INCOMESTATEMENTS)]
    public class StatementsExpenses : EntityBase
    {
        public string Notes { get; set; }

    }
}
