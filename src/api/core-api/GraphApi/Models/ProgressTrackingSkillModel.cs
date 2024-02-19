using System.Collections.Generic;

namespace EcdLink.Api.CoreApi.GraphApi.Models
{
    public class ProgressSubCategoryModel
    {
        public int SubCatId { get; set; }
        public string Name { get; set; }
        public List<SubCategorySkillModel> Skills { get; set; }
    }
   
    public class SubCategorySkillModel
    {
        public string Id { get; set; }
        public string Name { get; set; }
        public string Level { get; set; }
        public int ContentTypeId { get; set; }
    }


}

