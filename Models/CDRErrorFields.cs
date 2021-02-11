using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace SessionAdministration.Models
{
    public class CDRErrorFields
    {
        public string ValidationErrorValue { get; set; }
        public string ValidationRule { get; set; }
        public string ErrorFieldKey { get; set; }
        public string ErrorFieldValue { get; set; }
    }
}