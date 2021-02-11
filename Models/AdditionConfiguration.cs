using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace SessionAdministration.Models
{
    public class AdditionConfiguration
    {
        public string StartupTimeout { get; set; }
        public string StartTransfer { get; set; }
        public string FileCreatedTimeout { get; set; }
        public string NumberOfThreads { get; set; }
        public string ProcessedDirectory { get; set; }
        public string TarificationDirectory { get; set; }
        public string TariffDirectory { get; set; }
        public string TariffExtension { get; set; }
        public string RejDirectory { get; set; }
        public string RejExtension { get; set; }
        public string ErrExtension { get; set; }
        public string ErrDirectory { get; set; }
    }
}