using ECDLink.PDFGenerator.Elements;
using ECDLink.PDFGenerator.Extensions;
using ECDLink.PDFGenerator.FormFields.Interfaces;
using ECDLink.PDFGenerator.Models;
using ECDLink.PDFGenerator.Utilities;
using iTextSharp.text;
using iTextSharp.text.pdf;
using System;
using System.Collections.Generic;
using System.Linq;

namespace ECDLink.PDFGenerator.FormFields
{
    public class ColumnSplitFieldParser : IFieldParser
    {
        public void AddItem(AcroFields form, string key, PdfFieldDescriptor desc, AcroFields.Item item, PdfStamper pdfStamper)
        {
            var font = form.GetFieldFont(item);
            var leftParagraphRectangle = form.GetFieldRectangle(key);
            var rightParagraphRectangle = form.GetFieldRectangle($"{key}_split");

            var bulletFont = new Font(font);
            bulletFont.Color = new BaseColor(74, 46, 145);

            var infoList = (IEnumerable<string>)desc.Value;

            var phrases = new List<Phrase>();

            foreach (var value in infoList)
            {
                var chunks = new List<Chunk>();

                chunks.Add(new Chunk("• ", bulletFont));
                chunks.AddRange(PdfUtil.GetFormattedChunks(value, font));

                var separator = new DashedLineSeparator();
                separator.Dash = 30;
                separator.LineWidth = 3;
                separator.Gap = 10;

                chunks.Add(new Chunk(Environment.NewLine));
                chunks.Add(new Chunk(separator));
                chunks.Add(new Chunk(Environment.NewLine));
                chunks.Add(new Chunk(Environment.NewLine));

                var phrase = new Phrase();
                phrase.AddAll(chunks);

                phrases.Add(phrase);
            }

            var leftParagraph = new Paragraph();
            leftParagraph.AddAll(phrases.Where((x, i) => i % 2 == 0).ToList());

            var rightParagraph = new Paragraph();
            rightParagraph.AddAll(phrases.Where((x, i) => i % 2 != 0).ToList());

            var leftSize = PdfUtil.FitParagraph(leftParagraph.Chunks.Cast<Chunk>().ToList(), leftParagraphRectangle.Rectangle, font.Size, PdfWriter.RUN_DIRECTION_DEFAULT);
            var rightSize = PdfUtil.FitParagraph(rightParagraph.Chunks.Cast<Chunk>().ToList(), rightParagraphRectangle.Rectangle, font.Size, PdfWriter.RUN_DIRECTION_DEFAULT);

            var fontSize = Math.Min(leftSize, rightSize);

            foreach (var phrase in phrases)
            {
                phrase.Font.Size = fontSize;
                foreach (var chunk in phrase.Chunks.Cast<Chunk>().ToList())
                {
                    chunk.Font.Size = fontSize;
                }
            }

            pdfStamper.AddParagraphToPage(leftParagraphRectangle, leftParagraph, fontSize);
            pdfStamper.AddParagraphToPage(rightParagraphRectangle, rightParagraph, fontSize);
        }
    }
}
