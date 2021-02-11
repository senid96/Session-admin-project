using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace SessionAdministration.Models.Requests
{
    public class CDRFieldUpdateRequest
    {
        public string CdrId { get; set; }
        public string NtsFieldId { get; set; }
        public string FieldValue { get; set; }
    }
}