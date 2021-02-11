using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace SessionAdministration.Models
{
    public class MappingGetReq
    {
        public string InputField { get; set; }
        public string OutputField { get; set; }
        public string Transformation { get; set; }
    }
}