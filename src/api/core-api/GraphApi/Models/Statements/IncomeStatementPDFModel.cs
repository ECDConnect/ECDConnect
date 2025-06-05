using System;
using System.Collections.Generic;

namespace EcdLink.Api.CoreApi.GraphApi.Models.Statements
{
    public class IncomeExpensePDFTableModel
    {

        public string TableName { get; set; }
        public string Type { get; set; } // Expenses or Income
        public double Total { get; set; }
        public virtual ICollection<IncomeExpensePDFHeaderModel> Headers { get; set; }
        public virtual ICollection<IncomeExpensePDFDataModel> Data { get; set; }
    }

    public class IncomeExpensePDFHeaderModel
    { 
        public string Header { get; set;}
        public string DataKey { get; set; }
    }

    public class IncomeExpensePDFDataModel
    {
        public string Child { get; set; }
        public DateTime? Date { get; set; }
        public string Description { get; set; }
        public double Amount { get; set; }
        public string InvoiceNr { get; set; }
        public string PhotoProof { get; set; }
        public string Type { get; set; }

    }

    public class ExpenseReceipt
    {
        public string Name { get; set; }
        public string PhotoProof { get; set; }
        public string InvoiceNr { get; set; }
    }

    public class StatementReport
    {
        public string StatementLine { get; set; }
        public double Value { get; set; } = 0.0;
        public string StatementType { get; set; } = "Income";
    }

}

