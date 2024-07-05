using ECDLink.DataAccessLayer.Entities.Community;
using System;

namespace EcdLink.Api.CoreApi.GraphApi.Models.Community
{
    public class CommunityProfileSkillModel
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public string ImageName { get; set; }
        public int Ordering { get; set; }
        public bool IsActive { get; set; }
        
        public CommunityProfileSkillModel(CommunitySkill skill, bool isActive)
        {
            Id = skill.Id;
            Name = skill.Name;
            Description = skill.Description;
            ImageName = skill.ImageName;
            Ordering = skill.Ordering;
            IsActive = isActive;
        }

        public CommunityProfileSkillModel()
        {
        }
    }
    
}