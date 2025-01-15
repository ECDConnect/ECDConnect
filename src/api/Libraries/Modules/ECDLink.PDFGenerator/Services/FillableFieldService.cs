using ECDLink.Core.Extensions;
using ECDLink.PDFGenerator.FormFields.Interfaces;
using ECDLink.PDFGenerator.Models;
using ECDLink.PDFGenerator.Services.Interfaces;
using iTextSharp.text.pdf;
using System;
using System.Collections;
using System.Collections.Generic;
using System.IO;

namespace ECDLink.PDFGenerator.Services
{
    public class FillableFieldService : IFillableFieldService
    {
        private readonly IFieldFactory _fieldFactory;

        public FillableFieldService(IFieldFactory fieldFactory)
        {
            _fieldFactory = fieldFactory;
        }

        public string FillForm(byte[] pdfDocument, Dictionary<string, PdfFieldDescriptor> pdfValueOverrides, int numberCoverPages = 1)
        {
            Stream outStream = null;
            PdfReader pdfReader = null;
            PdfStamper pdfStamper = null;

            try
            {
                outStream = new MemoryStream();

                pdfReader = new PdfReader(pdfDocument);
                TrimCoverPages(pdfReader, numberCoverPages);

                pdfStamper = new PdfStamper(pdfReader, outStream);

                AcroFields form = pdfStamper.AcroFields;

                // UPDATED WITH .NET8
                foreach (KeyValuePair<string, AcroFields.Item> field in form.Fields)
                {
                    var key = field.Key.ToString();
                    var item = field.Value as AcroFields.Item;

                    if (pdfValueOverrides.TryGetValue(key, out var value))
                    {
                        var parser = _fieldFactory.GetFieldParser(value.Type);

                        parser.AddItem(form, key, value, item, pdfStamper);
                    }
                }

                // set this if you want the result PDF to not be editable. 
                pdfStamper.FormFlattening = true;
                pdfStamper.FreeTextFlattening = true;

                pdfStamper?.Close();
                pdfReader?.Close();

                return outStream.ConvertToString();
            }
            finally
            {
                outStream?.Close();
            }
        }

        private void TrimCoverPages(PdfReader pdfReader, int numberCoverPages)
        {
            if (numberCoverPages > 1)
            {
                var random = new Random();
                var keepPage = random.Next(1, numberCoverPages);

                pdfReader.SelectPages($"{keepPage}, {numberCoverPages + 1}-{pdfReader.NumberOfPages}");
            }
        }
    }
}
