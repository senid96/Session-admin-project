using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace SessionAdministration.Models
{
    public class PlatformInfo
    {
        public string PlatformId { get; set; }
        public string Platform { get; set; }
        public string InputFilePath { get; set; }
        public string InputFileFormat { get; set; }
        public string OutputFileDirectory { get; set; }
        public string OriginFileDirectory { get; set; }
        public string FTPServer { get; set; }
        public string Port { get; set; }
        public string Username { get; set; }
        public string Password { get; set; }
        public string IncomingInterval { get; set; }//minutes
    }
}