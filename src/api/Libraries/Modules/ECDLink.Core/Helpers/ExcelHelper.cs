using NPOI.SS.UserModel;

namespace ECDLink.Core.Helpers
{
    public class ExcelHelper
    {
        public static string GetCellValue(ICell cell)
        {
            if (cell != null)
            {
                return cell.CellType switch
                {
                    CellType.Blank => null,
                    CellType.Boolean => cell.BooleanCellValue.ToString(),
                    CellType.Numeric => cell.NumericCellValue.ToString(),
                    CellType.String => cell.StringCellValue,
                    CellType.Unknown => null,
                    CellType.Formula => null,
                    CellType.Error => null,
                    _ => null,
                };
            }
            else
            {
                return null;
            }
        }
    }
}
