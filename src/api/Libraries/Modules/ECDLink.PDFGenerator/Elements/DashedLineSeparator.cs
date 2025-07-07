using iTextSharp.text.pdf;
using iTextSharp.text.pdf.draw;

namespace ECDLink.PDFGenerator.Elements
{
    public class DashedLineSeparator : DottedLineSeparator
    {
        public float Dash { get; set; } = 5.0f;

        public float Phase { get; set; } = 2.5f;

        public void draw(PdfContentByte canvas, float llx, float lly, float urx, float ury, float y)
        {
            canvas.SaveState();
            canvas.SetLineWidth(LineWidth);
            canvas.SetLineDash(Dash, Gap, Phase);
            DrawLine(canvas, llx, urx, y);
            canvas.RestoreState();
        }
    }
}
