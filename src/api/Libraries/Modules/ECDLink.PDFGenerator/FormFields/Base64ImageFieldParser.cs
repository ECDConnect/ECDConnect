using ECDLink.PDFGenerator.FormFields.Interfaces;
using ECDLink.PDFGenerator.Models;
using iTextSharp.text;
using iTextSharp.text.pdf;
using System;
using System.Text.RegularExpressions;

namespace ECDLink.PDFGenerator.FormFields
{
    public class Base64ImageFieldParser : IFieldParser
    {
        public void AddItem(AcroFields form, string key, PdfFieldDescriptor desc, AcroFields.Item item, PdfStamper pdfStamper)
        {
            var btn = form.GetNewPushbuttonFromField(key);

            if (string.IsNullOrWhiteSpace(Convert.ToString(desc?.Value)))
            {
                btn.Visibility = PushbuttonField.HIDDEN;
                form.ReplacePushbuttonField(key, btn.Field);
                return;
            }

            btn.Layout = PushbuttonField.LAYOUT_ICON_ONLY;

            btn.ProportionalIcon = true;
            string rawBase64 = Convert.ToString(desc.Value);
            rawBase64 = Regex.Replace(rawBase64, @"^data:image\/[a-zA-Z]+;base64,", string.Empty);
            btn.Image = Image.GetInstance(Convert.FromBase64String(rawBase64));

            btn.BackgroundColor = null;

            form.ReplacePushbuttonField(key, btn.Field);
        }
    }
}
