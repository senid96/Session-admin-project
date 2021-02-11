using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace SessionAdministration.Models
{
    public class Alarm
    {
        public int AlarmId { get; set; }
        public DateTime AlarmTime { get; set; }
        public string Source { get; set; }
        public string Message { get; set; }
        public string Acknowledged { get; set; }
        public string AckUser { get; set; }
        public string AckTime { get; set; }
        public string MedSessionId { get; set; }
    }
}