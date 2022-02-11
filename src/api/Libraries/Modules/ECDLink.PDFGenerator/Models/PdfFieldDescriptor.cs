using ECDLink.PDFGenerator.Enums;
using iTextSharp.text;

namespace ECDLink.PDFGenerator.Models
{
    public class PdfFieldDescriptor
    {
        public PdfFieldTypeEnum Type { get; set; }

        public bool IsDuplicateKey { get; set; }

        public object Value { get; set; }

        public int Alignment { get; set; } = Element.ALIGN_LEFT;
    }
}
