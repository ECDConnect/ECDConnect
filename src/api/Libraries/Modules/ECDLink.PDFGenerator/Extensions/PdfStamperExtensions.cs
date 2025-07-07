using ECDLink.PDFGenerator.Models;
using iTextSharp.text;
using iTextSharp.text.pdf;

namespace ECDLink.PDFGenerator.Extensions
{
    public static class PdfStamperExtensions
    {
        public static void AddParagraphToPage(this PdfStamper pdfStamper, RectangleWrapper rect, Paragraph paragraph, float fontSize)
        {
            PdfContentByte cb = pdfStamper.GetOverContent(rect.PageNumber);
            var column = new ColumnText(cb);

            column.SetSimpleColumn(
              paragraph,
              rect.Rectangle.Left,
              rect.Rectangle.Bottom,
              rect.Rectangle.Right,
              rect.Rectangle.Top,
              fontSize,
              Element.ALIGN_LEFT);

            column.Go();
        }

        public static void AddListToPage(this PdfStamper pdfStamper, RectangleWrapper rect, List list)
        {
            PdfContentByte cb = pdfStamper.GetOverContent(rect.PageNumber);
            var column = new ColumnText(cb);

            column.AddElement(list);

            column.SetSimpleColumn(
              rect.Rectangle.Left,
              rect.Rectangle.Bottom,
              rect.Rectangle.Right,
              rect.Rectangle.Top
              );

            column.Go();
        }

        public static void AddTableToPage(this PdfStamper pdfStamper, RectangleWrapper rect, PdfPTable table)
        {
            PdfContentByte cb = pdfStamper.GetOverContent(rect.PageNumber);
            var column = new ColumnText(cb);

            column.AddElement(table);

            column.SetSimpleColumn(
              rect.Rectangle.Left,
              rect.Rectangle.Bottom,
              rect.Rectangle.Right,
              rect.Rectangle.Top
              );

            column.Go();
        }
    }
}
