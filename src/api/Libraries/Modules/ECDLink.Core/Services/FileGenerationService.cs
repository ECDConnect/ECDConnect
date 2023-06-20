using CsvHelper;
using ECDLink.Abstractrions.Files;
using ECDLink.Abstractrions.Services;
using HeyRed.Mime;
using NPOI.XSSF.UserModel;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Data;
using System.Globalization;
using System.IO;
using System.Threading.Tasks;

namespace ECDLink.Core.Services
{
    public class FileGenerationService : IFileGenerationService
    {
        public async Task<FileModel> GetBase64CsvFile<T>(T records, string fileName)
          where T : IEnumerable
        {
            using MemoryStream stream = new MemoryStream();
            using StreamWriter writer = new StreamWriter(stream);
            using CsvWriter csvWriter = new CsvWriter(writer, CultureInfo.InvariantCulture);

            await csvWriter.WriteRecordsAsync(records);

            await csvWriter.FlushAsync();
            await writer.FlushAsync();
            await stream.FlushAsync();

            var byteFile = stream.ToArray();

            return new FileModel
            {
                FileType = MimeTypesMap.GetMimeType(".csv"),
                Base64File = Convert.ToBase64String(byteFile),
                Extension = ".csv",
                FileName = $"{fileName}.csv"
            };
        }

        public async Task<FileModel> DataTableToExcelFile(DataTable data, string fileName)
        {
            int i;
            int j;
            int count;
            using MemoryStream stream = new MemoryStream();

            var workbook = new XSSFWorkbook();

            var sheet = workbook.CreateSheet(fileName);

            var headerRow = sheet.CreateRow(0);
            for (j = 0; j < data.Columns.Count; ++j)
            {
                headerRow.CreateCell(j).SetCellValue(data.Columns[j].ColumnName);
            }
            count = 1;

            for (i = 0; i < data.Rows.Count; ++i)
            {
                var row = sheet.CreateRow(count);
                for (j = 0; j < data.Columns.Count; ++j)
                {
                    row.CreateCell(j).SetCellValue(data.Rows[i][j].ToString());
                }

                ++count;
            }

            for (var z = 0; z < data.Columns.Count; z++)
            {
                sheet.AutoSizeColumn(z);
            }

            workbook.Write(stream);

            await stream.FlushAsync();

            var byteFile = stream.ToArray();

            return new FileModel
            {
                FileType = MimeTypesMap.GetMimeType(".xlsx"),
                Base64File = Convert.ToBase64String(byteFile),
                Extension = ".xlsx",
                FileName = $"{fileName}"
            };
        }

        public async Task<FileModel> FieldsToExcelTemplate(List<string> fields, Dictionary<string, string> contentDefinition, Dictionary<string, string> languages, string fileName)
        {
            using MemoryStream stream = new MemoryStream();

            var workbook = new XSSFWorkbook();

            var sheet = workbook.CreateSheet(fileName);

            var headerRow = sheet.CreateRow(0);
            for (int i = 0; i < fields.Count; ++i)
            {
                headerRow.CreateCell(i).SetCellValue(fields[i]);
            }

            int secondSheetRowcount;
            var secondSheet = workbook.CreateSheet("Content Definition");
            var secondHeaderRow = secondSheet.CreateRow(0);
            secondHeaderRow.CreateCell(0).SetCellValue("Field");
            secondHeaderRow.CreateCell(1).SetCellValue("Definition");

            secondSheetRowcount = 1;

            foreach (var definition in contentDefinition)
            {
                var row = secondSheet.CreateRow(secondSheetRowcount);
                row.CreateCell(0).SetCellValue(definition.Key);
                row.CreateCell(1).SetCellValue(definition.Value);

                ++secondSheetRowcount;
            }

            int thirdSheetRowcount;
            var thirdSheet = workbook.CreateSheet("Available Languages");
            var thirdHeaderRow = thirdSheet.CreateRow(0);
            thirdHeaderRow.CreateCell(0).SetCellValue("Locale");
            thirdHeaderRow.CreateCell(1).SetCellValue("Language");

            thirdSheetRowcount = 1;

            foreach (var language in languages)
            {
                var row = thirdSheet.CreateRow(thirdSheetRowcount);
                row.CreateCell(0).SetCellValue(language.Key);
                row.CreateCell(1).SetCellValue(language.Value);

                ++thirdSheetRowcount;
            }

            workbook.Write(stream);

            await stream.FlushAsync();

            var byteFile = stream.ToArray();

            return new FileModel
            {
                FileType = MimeTypesMap.GetMimeType(".xlsx"),
                Base64File = Convert.ToBase64String(byteFile),
                Extension = ".xlsx",
                FileName = $"{fileName}"
            };
        }

        public async Task<FileModel> DictionaryToExcelTemplate(Dictionary<string, List<List<string>>> sheetDefinitions, string fileName)
        {
            using MemoryStream stream = new MemoryStream();
            var workbook = new XSSFWorkbook();
            
            foreach (var newSheet in sheetDefinitions)
            {
                var sheet = workbook.CreateSheet(newSheet.Key);

                int rowNumber = 0;
                foreach (var columns in newSheet.Value) { 
                    var row = sheet.CreateRow(rowNumber);
                    int colNumber = 0;
                    foreach (var collumn in columns)
                    {
                        var cell = row.CreateCell(colNumber);
                        cell.SetCellValue(collumn);
                        colNumber++;
                    }
                    rowNumber++;
                }
            }

            workbook.Write(stream);
            await stream.FlushAsync();

            var byteFile = stream.ToArray();

            return new FileModel
            {
                FileType = MimeTypesMap.GetMimeType(".xlsx"),
                Base64File = Convert.ToBase64String(byteFile),
                Extension = ".xlsx",
                FileName = fileName
            };
        }
    }
}
