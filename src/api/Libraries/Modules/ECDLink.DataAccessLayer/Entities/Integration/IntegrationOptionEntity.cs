using System.Collections.Generic;

namespace ECDLink.DataAccessLayer.Entities.Integration.IntegrationEntityMapping
{
    public class IntegrationOptionEntity
    {
        public bool AllColumns { get; set; }
        public string Columns { get; set; }
        public List<IntegrationOptionRelatedEntity> Related { get; set; }
        public List<IntegrationOptionConditionEntity> Conditions { get; set; }
    }
    public class IntegrationOptionConditionEntity
    {
        public string Column { get; set; }
        public string Operator { get; set; }
        public string Value { get; set; }
    }
    public class IntegrationOptionRelatedEntity
    {
        public string RelatedBy { get; set; }
        public string AllColumns { get; set; }
        public string Columns { get; set; }
    }
}
