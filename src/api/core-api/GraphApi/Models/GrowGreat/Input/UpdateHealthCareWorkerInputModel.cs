using System;

namespace EcdLink.Api.CoreApi.GraphApi.Models.GrowGreat.Input
{
    public class UpdateHealthCareWorkerInputModel
    {
        public Guid? LanguageId { get; set; }
        public Guid? ClinicId { get; set; }
        public bool IsRegistered { get; set; }
    }
}
