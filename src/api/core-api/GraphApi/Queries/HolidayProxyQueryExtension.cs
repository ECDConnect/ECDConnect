using ECDLink.Abstractrions.GraphQL.Enums;
using ECDLink.Abstractrions.Services;
using ECDLink.Core.Models;
using ECDLink.EGraphQL.Authorization;
using ECDLink.Security;
using HotChocolate;
using HotChocolate.Types;
using System;
using System.Collections.Generic;

namespace EcdLink.Api.CoreApi.GraphApi.Queries
{
    [ExtendObjectType(OperationTypeNames.Query)]
    public class HolidayProxyQueryExtension
    {
        [Permission(PermissionGroups.GENERAL, GraphActionEnum.View)]
        public IEnumerable<Holiday> GetHolidaysByYear(
          [Service] IHolidayService<Holiday> holidayService,
          int year)
        {
            return holidayService.GetHolidays(year);
        }

        [Permission(PermissionGroups.GENERAL, GraphActionEnum.View)]
        public IEnumerable<Holiday> GetHolidaysByMonth(
          [Service] IHolidayService<Holiday> holidayService,
          DateTime startMonth,
          DateTime endMonth)
        {
            return holidayService.GetHolidays(startMonth, endMonth);
        }
    }
}
