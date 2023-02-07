using System;

namespace ECDLink.DataAccessLayer.Entities
{
    public class StatementsSubmit
    {
        public string Period { get; set; }
        public int? Month { get; set; }
        public int Year { get; set; }
        public string UserId { get; set; }
        //public DateTime? StartDate { get; set; }
        //public DateTime? EndDate { get; set; }
    } 
}
