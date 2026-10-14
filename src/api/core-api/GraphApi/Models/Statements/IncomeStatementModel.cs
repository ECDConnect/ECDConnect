using ECDLink.DataAccessLayer.Entities.IncomeStatements;
using HotChocolate.Types;
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
        // Devices that saved a statement before this field existed omit it.
        // The update does not write this value; only the contact-status mutation does.
        [DefaultValue(false)]
        public bool ContactedByCoach { get; set; }
        public bool Downloaded { get; set; }

        public IncomeStatementModel() { }

        public IncomeStatementModel(StatementsIncomeStatement statement)
        {
            Id = statement.Id;
            Month = statement.Month;
            Year = statement.Year;
            Downloaded = statement.Downloaded;
            IncomeItems = (statement.IncomeItems ?? Enumerable.Empty<StatementsIncome>())
                .Select(x => new IncomeItemModel(x)).Where(x => x.IsActive).ToList();
            ExpenseItems = (statement.ExpenseItems ?? Enumerable.Empty<StatementsExpenses>())
                .Select(x => new ExpenseItemModel(x)).Where(x => x.IsActive).ToList();
            ContactedByCoach = statement.ContactedByCoach;
        }
    }
}
