using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace SessionAdministration.Models
{
    public class CDR
    {
        public int SessionId { get; set; }
        public int CdrId { get; set; }
        public string Line { get; set; }
        public int LineNumber { get; set; }
        public DateTime ChangeDate { get; set; }
        public string ChangeByUser { get; set; }
        public string Status { get; set; }
    }
}