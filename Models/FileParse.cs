using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace SessionAdministration.Models
{
    public class FileParse
    {
        public string FileType { get; set; }
        public string Delimiters { get; set; }
        public int SkipLines { get; set; }
    }
}