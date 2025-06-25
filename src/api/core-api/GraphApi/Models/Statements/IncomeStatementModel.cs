using ECDLink.DataAccessLayer.Entities.IncomeStatements;
using System;
using System.Collections.Generic;
using System.Linq;

namespace EcdLink.Api.CoreApi.GraphApi.Models.Statements
{
    public class IncomeStatementModel
    {
        public Guid Id { get; set; }
        public int Month { get; set; }
        public int Year { get; set; }
        public List<IncomeItemModel> IncomeItems { get; set; }
        public List<ExpenseItemModel> ExpenseItems { get; set; }
        public bool ContactedByCoach { get; set; }
        public bool Downloaded { get; set; }

        public IncomeStatementModel() { }

        public IncomeStatementModel(StatementsIncomeStatement statement)
        {
            Id = statement.Id;
            Month = statement.Month;
            Year = statement.Year;
            Downloaded = statement.Downloaded;
            IncomeItems = statement.IncomeItems.Select(x => new IncomeItemModel(x)).ToList();
            ExpenseItems = statement.ExpenseItems.Select(x => new ExpenseItemModel(x)).ToList();
            ContactedByCoach = statement.ContactedByCoach;
        }
    }
}
