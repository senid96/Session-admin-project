using FORIS.Interbilling.NTS.Mediation.ConfigurationClasses;
using SessionAdministration.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SessionAdministration.Services.IServices
{
    interface ISuspended
    {
        List<string> GetRules(string platformName);
        List<SuspendedRecord> GetSuspendedRecords(int? platform, DateTime dateFrom, DateTime dateTo, string rule);
        List<SuspendedRecord> GetProcessedSuspendedRecords(int? platform, DateTime dateFrom, DateTime dateTo, string rule);
        void ProcessSuspendedCDR(int sessionId);
    }
}
