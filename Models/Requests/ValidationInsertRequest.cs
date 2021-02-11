using FORIS.Interbilling.NTS.Mediation.DataStructures;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace SessionAdministration.Models.Requests
{
    public class ValidationInsertRequest
    {
        public string Platform { get; set; }
        public string InputField { get; set; }
        public string ValidationRule { get; set; }
        public string OutputFileType { get; set; }
        public DateTime DateFrom { get; set; }
        public DateTime DateTo { get; set; }
        public string FieldValues { get; set; }
    }
}