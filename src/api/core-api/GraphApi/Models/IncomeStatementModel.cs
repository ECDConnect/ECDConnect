using ECDLink.DataAccessLayer.Entities.IncomeStatements;
using System;
using System.Collections.Generic;
using System.Linq;

namespace EcdLink.Api.CoreApi.GraphApi.Models
{
    public class IncomeStatementModel
    {
        public Guid Id { get; set; }
        public int Month { get; set; }
        public int Year { get; set; }
        public double IncomeTotal { get; set; }
        public double ExpenseTotal { get; set;}
        public double Balance { get; set;}
        public List<IncomeItemModel> IncomeItems { get; set; }
        public List<ExpenseItemModel> ExpenseItems { get; set; }

        public IncomeStatementModel(StatementsIncomeStatement statement)
        {
            Id = statement.Id;
            Month = statement.Month;
            Year = statement.Year;
            ExpenseTotal = statement.ExpenseTotal;
            IncomeTotal = statement.IncomeTotal;
            Balance = statement.Balance;
            IncomeItems = statement.IncomeItems.Select(x => new IncomeItemModel(x)).ToList();
            ExpenseItems = statement.ExpenseItems.Select(x => new ExpenseItemModel(x)).ToList();
        }
    }
}
