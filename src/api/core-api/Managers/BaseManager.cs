using ECDLink.DataAccessLayer.Entities.Users;
using ECDLink.DataAccessLayer.Repositories.Factories;
using ECDLink.DataAccessLayer.Repositories.Generic.Base;
using ECDLink.Security.Extensions;
using Microsoft.AspNetCore.Http;
using System;

namespace EcdLink.Api.CoreApi.Managers.Integration
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
            var result = "<ul>";
            foreach (var item in arrData)
            {
                result = result + "<li>" + item + "</li>";
            }
            result = result + "<ul>";

            return result;
        }

    }
}

