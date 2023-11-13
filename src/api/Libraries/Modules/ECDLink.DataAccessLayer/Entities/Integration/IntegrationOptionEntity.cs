using System.Collections.Generic;

namespace ECDLink.DataAccessLayer.Entities.Integration.IntegrationEntityMapping
{
    public class IntegrationOptionEntity
    {
        public bool AllColumns { get; set; }
        public string[] Columns { get; set; }
        public List<IntegrationOptionRelatedEntity> Related { get; set; }
        public List<IntegrationOptionConditionEntity> Conditions { get; set; }
        public List<IntegrationOptionRelatedConditionsEntity> RelatedConditions { get; set; } = null;
    }

    public class IntegrationOptionConditionEntity
    {
        public string Column { get; set; }
        public string Operator { get; set; }
        public object Value { get; set; }
    }


    public class IntegrationOptionRelatedEntity
    {
        public string RelatedBy { get; set; }
        public string AllColumns { get; set; }
        public string[] Columns { get; set; }
        public string JoinType { get; set; }
        public string Operator { get; set; }
        public string Value { get; set; }
        public IntegrationOptionConditionEntity Conditions { get; set; } = null;
    }

    public class IntegrationOptionRelatedConditionsEntity
    {
        public string RelatedBy { get; set; }
        public string AllColumns { get; set; }
        public string[] Columns { get; set; }
        public string JoinType { get; set; }
        public string Operator { get; set; }
        public string Value { get; set; }
        public IntegrationOptionConditionEntity Conditions { get; set; }
    }

}
