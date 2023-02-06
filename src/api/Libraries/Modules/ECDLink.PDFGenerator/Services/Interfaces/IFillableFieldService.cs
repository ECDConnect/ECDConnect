using ECDLink.PDFGenerator.Models;
using System.Collections.Generic;

namespace ECDLink.PDFGenerator.Services.Interfaces
{
    public interface IFillableFieldService
    {
        string FillForm(byte[] pdfDocument, Dictionary<string, PdfFieldDescriptor> pdfValueOverrides, int numberCoverPages = 1);
    }
}
