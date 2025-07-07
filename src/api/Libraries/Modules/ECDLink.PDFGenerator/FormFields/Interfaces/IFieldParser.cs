using ECDLink.PDFGenerator.Models;
using iTextSharp.text.pdf;
using static iTextSharp.text.pdf.AcroFields;

namespace ECDLink.PDFGenerator.FormFields.Interfaces
{
    public interface IFieldParser
    {
        public void AddItem(AcroFields form, string key, PdfFieldDescriptor desc, Item item, PdfStamper pdfStamper);
    }
}
