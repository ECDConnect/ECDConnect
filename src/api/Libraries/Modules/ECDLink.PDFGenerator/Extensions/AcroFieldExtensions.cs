using ECDLink.PDFGenerator.Models;
using iTextSharp.text;
using iTextSharp.text.pdf;
using System;
using static iTextSharp.text.pdf.AcroFields;

namespace ECDLink.PDFGenerator.Extensions
{
    public static class AcroFieldExtensions
    {
        public static Font GetFieldFont(this AcroFields form, Item item, int index = 0)
        {
            TextField temp = new TextField(null, null, null);

            form.DecodeGenericDictionary(item.GetMerged(index), temp);

            var font = new Font(temp.Font);
            font.Size = temp.FontSize;
            font.Color = temp.TextColor;

            return font;
        }

        public static RectangleWrapper GetFieldRectangle(this AcroFields form, string key, int index = 0)
        {
            var positionArr = form.GetFieldPositions(key);

            var position = index * 5;

            return new RectangleWrapper
            {
                PageNumber = Convert.ToInt32(positionArr[0 + position]),
                Rectangle = new Rectangle(positionArr[1 + position], positionArr[2 + position], positionArr[3 + position], positionArr[4 + position])
            };
        }
    }
}
