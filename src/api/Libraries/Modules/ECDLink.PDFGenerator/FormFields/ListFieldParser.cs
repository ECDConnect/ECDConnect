using ECDLink.PDFGenerator.Extensions;
using ECDLink.PDFGenerator.FormFields.Interfaces;
using ECDLink.PDFGenerator.Models;
using ECDLink.PDFGenerator.Utilities;
using iTextSharp.text;
using iTextSharp.text.pdf;
using System.Collections.Generic;

namespace ECDLink.PDFGenerator.FormFields
{
    public class ListFieldParser : IFieldParser
    {
        public void AddItem(AcroFields form, string key, PdfFieldDescriptor desc, AcroFields.Item item, PdfStamper pdfStamper)
        {
            var font = form.GetFieldFont(item);

            var fieldMetaData = form.GetFieldRectangle(key);

            var list = new List(List.UNORDERED, 20.0f);
            list.SetListSymbol("\u2022");
            list.IndentationLeft = 0f;
            list.Alignindent = true;

            var infoList = (IEnumerable<string>)desc.Value;

            foreach (var value in infoList)
            {
                var li = new ListItem();
                li.Font = font;
                li.Leading = font.Size;

                li.AddAll(PdfUtil.GetFormattedChunks(value, font));

                list.Add(li);
            }

            var fontSize = PdfUtil.FitList(list, fieldMetaData.Rectangle, font.Size, PdfWriter.RUN_DIRECTION_DEFAULT);

            foreach (Chunk chunk in list.Chunks)
            {
                chunk.Font.Size = fontSize;
            }

            if (list.Items.Count == 0)
            {
                return;
            }

            pdfStamper.AddListToPage(fieldMetaData, list);
        }
    }
}
