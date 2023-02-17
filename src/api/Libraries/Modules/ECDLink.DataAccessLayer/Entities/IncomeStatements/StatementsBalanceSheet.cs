using System;

namespace ECDLink.DataAccessLayer.Entities.IncomeStatements
{
    public class StatementsBalanceSheet
    {
        public int? Month { get; set; }
        public int Year { get; set; }
        public string UserId { get; set; }

        public double IncomeTotal { get; set; }
        public double ExpenseTotal { get; set; }
        public double Balance { get; set; }
        public bool IsAutoSubmitted { get; set; }
        public DateTime SubmittedDate { get; set; }

    } 
}
