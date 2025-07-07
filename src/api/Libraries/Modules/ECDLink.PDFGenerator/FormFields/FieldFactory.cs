using ECDLink.PDFGenerator.Enums;
using ECDLink.PDFGenerator.FormFields.Interfaces;
using System;

namespace ECDLink.PDFGenerator.FormFields
{
    public class FieldFactory : IFieldFactory
    {
        public IFieldParser GetFieldParser(PdfFieldTypeEnum type)
        {
            switch (type)
            {
                case PdfFieldTypeEnum.Text:
                    return new TextFieldParser();
                case PdfFieldTypeEnum.TextColumnSplit:
                    return new ColumnSplitFieldParser();
                case PdfFieldTypeEnum.TextListBulletPoints:
                    return new ListFieldParser();
                case PdfFieldTypeEnum.ReplaceImage:
                    throw new NotImplementedException();
                case PdfFieldTypeEnum.DownloadImage:
                    return new DownloadImageFieldParser();
                case PdfFieldTypeEnum.Base64Image:
                    return new Base64ImageFieldParser();
                default:
                    throw new NotImplementedException();
            }
        }
    }
}
