using EcdLink.Api.CoreApi.GraphApi.Models.GrowGreat;
using ECDLink.Api.CoreApi.Services.Interfaces;
using HotChocolate;
using HotChocolate.Types;
using System.Collections.Generic;

namespace EcdLink.Api.CoreApi.GraphApi.Queries.GrowGreat
{
    [ExtendObjectType(OperationTypeNames.Query)]
    public class SubDistrictQueryExtension
    {
        public List<SubDistrictStatsModel> GetSubDistrictsAndStats([Service] IClinicService clinicService)
        {
            return clinicService.GetSubDistrictsAndStats();
        }
    }
}
