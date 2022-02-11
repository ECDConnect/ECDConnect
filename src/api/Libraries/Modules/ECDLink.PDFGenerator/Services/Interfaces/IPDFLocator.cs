using iTextSharp.text.pdf;

namespace ECDLink.PDFGenerator.Services.Interfaces
{
    public interface IPDFLocator
    {
        PdfDocument GetPdfDocument();
    }
}
