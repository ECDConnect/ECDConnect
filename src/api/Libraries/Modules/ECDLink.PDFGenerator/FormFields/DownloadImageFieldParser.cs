using ECDLink.PDFGenerator.FormFields.Interfaces;
using ECDLink.PDFGenerator.Models;
using iTextSharp.text;
using iTextSharp.text.pdf;
using System;

namespace ECDLink.PDFGenerator.FormFields
{
    public class DownloadImageFieldParser : IFieldParser
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

            btn.Image = Image.GetInstance(new Uri(Convert.ToString(desc.Value)));

            btn.BackgroundColor = null;

            form.ReplacePushbuttonField(key, btn.Field);
        }
    }
}
