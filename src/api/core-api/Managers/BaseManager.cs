using System;

namespace EcdLink.Api.CoreApi.Managers
{
    public class BaseManager
    {

        public BaseManager()
        {
        }

        public static DateTime StartOfWeek(DateTime dt, DayOfWeek startOfWeek)
        {
            int diff = (7 + (dt.DayOfWeek - startOfWeek)) % 7;
            return dt.AddDays(-1 * diff).Date;
        }

        public string FormatBulletList(Array arrData)
        {
            var result = "";
            foreach (var item in arrData)
            {
                result = result + "<li>" + item + "</li>";
            }

            return result;
        }

    }
}

