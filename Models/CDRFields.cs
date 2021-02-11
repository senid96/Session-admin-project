using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace SessionAdministration.Models
{
    public class CDRFields
    {
        public string NtsFieldId { get; set; }
        public string FieldKey { get; set; }
        public string FieldValue { get; set; }
        public string CdrId { get; set; }
        public string OrderNumber { get; set; }
    }
}