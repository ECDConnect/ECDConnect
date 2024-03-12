using ECDLink.DataAccessLayer.Entities.Interfaces;
using System;

namespace ECDLink.DataAccessLayer.Entities.IncomeStatements
{
    public class StatementsBalanceSheet : ITrackableType
    {
        public int? Month { get; set; }
        public int Year { get; set; }
        public Guid? UserId { get; set; }
        public double IncomeTotal { get; set; }
        public double ExpenseTotal { get; set; }
        public double Balance { get; set; }
        public bool AutoSubmitted { get; set; }
        public bool Submitted { get; set; }
        public DateTime? SubmittedDate { get; set; }

    } 
}
