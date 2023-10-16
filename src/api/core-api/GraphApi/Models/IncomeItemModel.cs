using ECDLink.DataAccessLayer.Entities.IncomeStatements;
using System;

namespace EcdLink.Api.CoreApi.GraphApi.Models
{
    public class IncomeItemModel
    {
        public string IncomeTypeId { get; set; }
        public Guid Id { get; set; }
        public DateTime DateReceived { get; set; }
        public double Amount { get; set; }
        public string ChildUserId { get; set; }
        public string Notes { get; set; }
        public string Description { get; set; }
        public double AmountExpected { get; set; }
        public double ChildCoverAmount { get; set; }
        public string PayTypeId { get; set; }
        public string ContributionTypeId { get; set; }
        public string PhotoProof { get; set; }
        public string FeeTypeId { get; set; }

        public IncomeItemModel(StatementsIncome income) 
        { 
            Id = income.Id;
            IncomeTypeId = income.IncomeTypeId;
            Amount = income.Amount;
            DateReceived = income.DateReceived;
            ChildUserId = income.ChildUserId;
            Notes = income.Notes;
            Description = income.Description;
            AmountExpected = income.AmountExpected;
            ChildCoverAmount = income.ChildCoverAmount;
            PayTypeId = income.PayTypeId;
            ContributionTypeId = income.ContributionTypeId;
            PhotoProof = income.PhotoProof;
            FeeTypeId = income.FeeTypeId;
        }
    }
}
