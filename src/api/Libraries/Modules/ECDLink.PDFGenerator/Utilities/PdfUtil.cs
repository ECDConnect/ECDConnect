using iTextSharp.text;
using iTextSharp.text.html.simpleparser;
using iTextSharp.text.pdf;
using System;
using System.Collections;
using System.Collections.Generic;
using System.IO;

namespace ECDLink.PDFGenerator.Utilities
{
    public static class PdfUtil
    {

        public static float FitParagraph(List<Chunk> chunks, Rectangle rect, float maxFontSize, int runDirection)
        {
            var ct = new ColumnText(null);

            var paragraph = new Paragraph();
            paragraph.AddAll(chunks);

            ct.SetSimpleColumn(paragraph, rect.Left, rect.Bottom, rect.Right, rect.Top, maxFontSize, Element.ALIGN_LEFT);

            ct.RunDirection = runDirection;
            var status = ct.Go(true);

            if ((status & ColumnText.NO_MORE_TEXT) != 0)
            {
                return maxFontSize;
            }

            float precision = 0.1f;
            float min = 0;
            float max = maxFontSize;
            float size = maxFontSize;
            for (int k = 0; k < 50; ++k)
            { //just in case it doesn't converge
                size = (min + max) / 2;
                ct = new ColumnText(null);

                // UPDATED WITH .NET8
                resizeChunks((ArrayList)paragraph.Chunks, size);

                ct.SetSimpleColumn(paragraph, rect.Left, rect.Bottom, rect.Right, rect.Top, size, Element.ALIGN_LEFT);
                ct.RunDirection = runDirection;
                status = ct.Go(true);

                if ((status & ColumnText.NO_MORE_TEXT) != 0)
                {
                    if (max - min < size * precision)
                    {
                        return size;
                    }
                    min = size;
                }
                else
                {
                    max = size;
                }
            }
            return size;
        }

        public static float FitList(List list, Rectangle rect, float maxFontSize, int runDirection)
        {
            try
            {
                var ct = new ColumnText(null);

                ct.AddElement(list);
                ct.SetSimpleColumn(
                rect.Left,
                rect.Bottom,
                rect.Right,
                rect.Top
                );

                ct.RunDirection = runDirection;
                var status = ct.Go(true);

                if ((status & ColumnText.NO_MORE_TEXT) != 0)
                {
                    return maxFontSize;
                }

                float precision = 0.1f;
                float min = 0;
                float max = maxFontSize;
                float size = maxFontSize;
                size = (min + max) / 2;
                size = size < (max / 2) ? size = max / 2 : size;
                for (int k = 0; k < 50; ++k)
                { //just in case it doesn't converge

                    ct = new ColumnText(null);

                    // UPDATED WITH .NET8
                    resizeChunks((ArrayList)list.Chunks, size);

                    ct.AddElement(list);
                    ct.SetSimpleColumn(
                    rect.Left,
                    rect.Bottom,
                    rect.Right,
                    rect.Top
                    );

                    ct.RunDirection = runDirection;
                    status = ct.Go(true);

                    if ((status & ColumnText.NO_MORE_TEXT) != 0)
                    {
                        if (max - min < size * precision)
                        {
                            return size;
                        }
                        min = size;
                    }
                    else
                    {
                        max = size;
                    }
                }
                return size;
            }
            catch (Exception e)
            {
                throw e;
            }
        }

        public static void resizeChunks(ArrayList chunks, float size)
        {
            foreach (Chunk chunk in chunks)
            {
                chunk.Font.Size = size;
            }
        }

        public static List<Chunk> GetFormattedChunks(string text, Font font)
        {
            //Our return object
            var list = new List<Chunk>();

            //ParseToList requires a StreamReader instead of just text
            using (StringReader sr = new StringReader(text))
            {
                //Parse and get a collection of elements
                var elements = HtmlWorker.ParseToList(sr, null);

                foreach (Paragraph element in elements)
                {
                    foreach (Chunk chunk in element.Chunks)
                    {
                        var newFont = new Font(font);

                        newFont.SetStyle(chunk.Font.Style);

                        chunk.Font = newFont;

                        list.Add(chunk);
                    }
                }
            }
            //Return the paragraph
            return list;
        }
    }
}
