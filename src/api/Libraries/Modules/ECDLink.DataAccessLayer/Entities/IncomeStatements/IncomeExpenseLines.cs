using System.Collections.Generic;

namespace ECDLink.DataAccessLayer.Entities.IncomeStatements
{
    public class IncomeExpenseLines
    {
        public List<StatementsIncome> Income { get; set; }
        public List<StatementsExpenses> Expenses { get; set; }
        public double IncomeTotal { get; set; } = 0;
        public double ExpenseTotal { get; set; } = 0;
        public int Year { get; set; }
        public int Month { get; set; }
        public bool Submitted { get; set; } = false;
        public bool AutoSubmitted { get; set; } = false;



    }
    public class IncomeExpenseLinesMonthly
    {
        public IncomeExpenseLines AllSubmitted { get; set; }
        public IncomeExpenseLines AllUnSubmitted { get; set; }
        public IncomeExpenseLines AllLines { get; set; }

    }
}