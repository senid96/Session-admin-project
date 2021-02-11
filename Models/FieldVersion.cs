using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace SessionAdministration.Models
{
    public class FieldVersion
    {
        public string Version { get; set; }
        public string Format { get; set; }
        public string DateFrom { get; set; }
        public string DateTo { get; set; }
    }
}