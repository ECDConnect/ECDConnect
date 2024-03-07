using System;

namespace EcdLink.Api.CoreApi.GraphApi.Models.GrowGreat.Input
{
    public class AddHealthCareWorkerInputModel
    {
        public Guid UserId { get; set; }

        public Guid? LanguageId { get; set; }
    }
}
