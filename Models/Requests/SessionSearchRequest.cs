using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace SessionAdministration.Models.Requests
{
    public class SessionSearchRequest
    {
        public int DateTypeSearch { get; set; } //po datumu procesiranja 0, po datumu saobracaja 1
        public DateTime DateFrom { get; set; }
        public DateTime DateTo { get; set; }
        public string OperatorSign { get; set; }
        public string ProccessingStep { get; set; }
        public string PlatformName { get; set; }
        public string FileName { get; set; }
    }
}