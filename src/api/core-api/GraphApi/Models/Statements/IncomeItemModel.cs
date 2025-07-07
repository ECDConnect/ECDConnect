using ECDLink.DataAccessLayer.Entities.IncomeStatements;
using System;

namespace EcdLink.Api.CoreApi.GraphApi.Models.Statements
{
    public class IncomeItemModel
    {
        public Guid Id { get; set; }
        public string IncomeTypeId { get; set; }
        public DateTime DateReceived { get; set; }
        public double Amount { get; set; }
        public Guid? ChildUserId { get; set; }
        public string Description { get; set; }
        public string Notes { get; set; }

        /// <summary>
        /// Payment type, item, money, voucher
        /// </summary>
        public string PayTypeId { get; set; }
        public string PhotoProof { get; set; }
        public int? NumberOfChildrenCovered { get; set; }

        public IncomeItemModel() { }

        public IncomeItemModel(StatementsIncome income) 
        { 
            Id = income.Id;
            IncomeTypeId = income.IncomeTypeId;
            Amount = income.Amount;
            DateReceived = income.DateReceived;
            ChildUserId = income.ChildUserId;
            Notes = income.Notes;
            NumberOfChildrenCovered = income.NumberOfChildrenCovered;
            PayTypeId = income.PayTypeId;
            PhotoProof = income.PhotoProof;
            Description = income.Description;
        }
    }
}
