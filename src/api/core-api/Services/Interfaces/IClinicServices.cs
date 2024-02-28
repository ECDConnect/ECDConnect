
using EcdLink.Api.CoreApi.GraphApi.Models;
using EcdLink.Api.CoreApi.GraphApi.Models.SmartStart;
using ECDLink.DataAccessLayer.Entities;
using ECDLink.DataAccessLayer.Entities.Clubs;
using ECDLink.DataAccessLayer.Entities.Users.Mapping;
using System;
using System.Collections.Generic;

namespace ECDLink.Api.CoreApi.Services.Interfaces
{
    public interface IClinicService
    {
        public List<DistrictStatsModel> GetDistrictsAndStats();
        public District AddDistrict(DistrictModel input);
        public District EditDistrict(DistrictModel input);
        public List<SubDistrictStatsModel> GetSubDistrictsAndStats();
        public SubDistrict AddSubDistrict(SubDistrictModel input);
        public SubDistrict EditSubDistrict(SubDistrictModel input);

    }
}