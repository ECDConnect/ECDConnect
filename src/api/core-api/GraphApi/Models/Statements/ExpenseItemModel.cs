using ECDLink.DataAccessLayer.Entities.IncomeStatements;
using System;

namespace EcdLink.Api.CoreApi.GraphApi.Models.Statements
{
    public class ExpenseItemModel
    {
        public string ExpenseTypeId { get; set; }
        public Guid Id { get; set; }
        public DateTime DatePaid { get; set; }
        public double Amount { get; set; }
        public string Notes { get; set; }
        public string PhotoProof { get; set; }

        public ExpenseItemModel() { }

        public ExpenseItemModel(StatementsExpenses expense) 
        { 
            Id = expense.Id;
            ExpenseTypeId = expense.ExpenseTypeId;
            Amount = expense.Amount;
            DatePaid = expense.DatePaid;
            Notes = expense.Notes;
            PhotoProof = expense.PhotoProof;
        }
    }
}
