using ECDLink.PDFGenerator.Extensions;
using ECDLink.PDFGenerator.FormFields.Interfaces;
using ECDLink.PDFGenerator.Models;
using ECDLink.PDFGenerator.Utilities;
using iTextSharp.text;
using iTextSharp.text.pdf;

namespace ECDLink.PDFGenerator.FormFields
{
    public class TextFieldParser : IFieldParser
    {
        public void AddItem(AcroFields form, string key, PdfFieldDescriptor desc, AcroFields.Item item, PdfStamper pdfStamper)
        {
            for (int i = 0; i < item.Size; i++)
            {
                var font = form.GetFieldFont(item, i);

                var fieldMetaData = form.GetFieldRectangle(key, i);

                AddSingleInstance(font, desc, fieldMetaData, pdfStamper);
            }
        }

        private void AddSingleInstance(Font font, PdfFieldDescriptor desc, RectangleWrapper wrapper, PdfStamper stamper)
        {
            if (string.IsNullOrWhiteSpace(desc?.Value?.ToString()))
            {
                return;
            }

            var chunks = PdfUtil.GetFormattedChunks(desc.Value.ToString(), font);

            var fontSize = PdfUtil.FitParagraph(chunks, wrapper.Rectangle, font.Size, PdfWriter.RUN_DIRECTION_DEFAULT);

            var p = new Phrase();

            foreach (var chunk in chunks)
            {
                chunk.Font.Size = fontSize;
                p.Add(chunk);
            }

            var para = new Paragraph(p);

            if (desc.Alignment == Element.ALIGN_MIDDLE)
            {
                AddCenterParagraph(para, wrapper, stamper);
                return;
            }

            stamper.AddParagraphToPage(wrapper, para, fontSize);
        }

        private void AddCenterParagraph(Paragraph p, RectangleWrapper wrapper, PdfStamper stamper)
        {
            var table = new PdfPTable(1);
            table.SetTotalWidth(new float[] { wrapper.Rectangle.Width });
            table.WidthPercentage = 100f;

            table.AddCell(new PdfPCell(p)
            {
                HorizontalAlignment = Element.ALIGN_CENTER,
                VerticalAlignment = Element.ALIGN_MIDDLE,
                Top = wrapper.Rectangle.Top,
                Right = wrapper.Rectangle.Right,
                Left = wrapper.Rectangle.Left,
                Bottom = wrapper.Rectangle.Bottom,
                Border = Rectangle.NO_BORDER,
                Padding = 0,
                FixedHeight = wrapper.Rectangle.Height,
            });

            stamper.AddTableToPage(wrapper, table);
        }
    }
}
