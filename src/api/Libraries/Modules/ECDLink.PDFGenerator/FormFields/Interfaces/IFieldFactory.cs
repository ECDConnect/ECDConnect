using ECDLink.PDFGenerator.Enums;

namespace ECDLink.PDFGenerator.FormFields.Interfaces
{
    public interface IFieldFactory
    {
        IFieldParser GetFieldParser(PdfFieldTypeEnum type);
    }
}
