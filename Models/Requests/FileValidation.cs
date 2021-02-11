using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace SessionAdministration.Models.Requests
{
    public class FileValidation
    {
        public string InputField { get; set; }
        public string ValidationRule { get; set; }
        public DateTime DateFrom { get; set; }
        public DateTime DateTo { get; set; }
        public string OutputFileType { get; set; }
        public string ValidationValues { get; set; }
    }
}