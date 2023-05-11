using System;
using System.Collections.Generic;

namespace EcdLink.Api.CoreApi.GraphApi.Models
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
        public int InvoiceNr { get; set; }
        public string PhotoProof { get; set; }
        public string Type { get; set; }

    }

    public class IncomeStatementPDFDoc
    {
        public string Reference { get; set; } // base64 string
        public string FileName { get; set; }
        public string UserId { get; set; }
        public string CreatedUserId { get; set; }
    }

}

