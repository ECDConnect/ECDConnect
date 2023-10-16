using System;
using System.Collections.Generic;

namespace EcdLink.Api.CoreApi.GraphApi.Models.SmartStart.Input
{
    public class SubmitStatementModel
    {
        public int Month { get; set; }
        public int Year { get; set; }
        public string UserId { get; set; }
        public List<Guid> IncomeItemIds { get; set; }
        public List<Guid> ExpenseItemIds { get; set; }
    }
}
