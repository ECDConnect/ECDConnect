using EcdLink.Api.CoreApi.Managers.Users.SmartStart;
using ECDLink.Abstractrions.GraphQL.Enums;
using ECDLink.DataAccessLayer.Entities;
using ECDLink.DataAccessLayer.Entities.Users.Mapping;
using ECDLink.EGraphQL.Authorization;
using ECDLink.Security;
using HotChocolate;
using HotChocolate.Types;
using System.Collections.Generic;
using System;
using System.Linq;

namespace EcdLink.Api.CoreApi.GraphApi.Queries.SmartStart
{
    [ExtendObjectType(OperationTypeNames.Query)]
    public class TraineeQueryExtension
    {
        public TraineeQueryExtension()
        {
        }

        [Permission(PermissionGroups.USER, GraphActionEnum.View)]
        public TraineeOnBoardTimeline GetOnBoardTraineeTimeline([Service] PersonnelService personnelService, string userId)
        {
            return personnelService.GetOnBoardTraineeTimeline(userId);
        }

        public List<string> GetTestNumbers()
        {
            List<int> rows = new List<int>(){1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12 };

            var range1 = rows.Where((value, index) => index >= start && index <= end).ToList();

            List<String> list = new List<String>();

            for (var i = 0; i < rows.Length; i++)
            {
                if (i % 3 == 0)
                {
                    list.Add((i+1).ToString());
                }
            }

            return list;

        }
              

    }
}
