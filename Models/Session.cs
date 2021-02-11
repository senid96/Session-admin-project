using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace SessionAdministration.Models
{
    public class Session
    {
        public int Id { get; set; }
        public DateTime SessionDate { get; set; }
        public DateTime FileDate { get; set; }
        public string FilePath { get; set; }
        public string FileName { get; set; }
        public int LastSuccessfulStep { get; set; }
        public DateTime DateOfLastChange { get; set; }
        public int FileRowCount { get; set; }
        public int TarificationCount { get; set; }
        public int RejectedCount { get; set; }
        public int SporniCount { get; set; }
        public string ErrorCount { get; set; }
    }
}