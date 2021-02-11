using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace SessionAdministration.Models
{
    public class SuspendedRecord
    {
        public int MedSessionId { get; set; }
        public string FileSource { get; set; }
        public string FileName { get; set; }
        public DateTime SessionDate { get; set; }
        public int FileRowCount { get; set; }
        public int TarificationCount { get; set; }
        public int SuspendedCount { get; set; }
        public int RejectedCount { get; set; }
        public int ErrorCount { get; set; }
        public string Status { get; set; }

    }
}