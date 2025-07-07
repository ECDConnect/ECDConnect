using ECDLink.Abstractrions.Files;
using System.Collections;
using System.Collections.Generic;
using System.Data;
using System.Threading.Tasks;

namespace ECDLink.Abstractrions.Services
{
    public interface IFileGenerationService
    {
        Task<FileModel> GetBase64CsvFile<T>(T records, string fileName) where T : IEnumerable;

        Task<FileModel> DataTableToExcelFile(DataTable data, string fileName);
        Task<FileModel> FieldsToExcelTemplate(List<string> fields, Dictionary<string, string> contentDefinition, Dictionary<string, string> languages, string fileName);
        Task<FileModel> DictionaryToExcelTemplate(Dictionary<string, List<List<string>>> sheetDefinitions, string fileName);
    }
}
