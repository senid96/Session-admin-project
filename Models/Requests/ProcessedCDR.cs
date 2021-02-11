using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace SessionAdministration.Models.Requests
{
    public class ProcessedCDR
    {
        public string LineNumber { get; set; }
        public string Line { get; set; }
    }
}