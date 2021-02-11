using SessionAdministration.Models;
using SessionAdministration.Models.Requests;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SessionAdministration.Services.IServices
{
    interface ISuspendedDetails
    {
        SuspendedRecord GetSuspendedFileInfo(int id);
        List<CDR> GetCDRsBySessionId(int id);
        List<ProcessedCDR> GetProcessedCDRsBySessionId(int id);
        List<CDRErrorFields> GetErrorFieldsOfSuspendedCDR(int cdrId);
        List<CDRFields> GetAllFieldsOfSuspendedCDR(int validationErrorId);
        void UpdateCDRFields(List<CDRFieldUpdateRequest> objs);
        void UpdateCdrStatusError(int cdrId, int status, string user, DateTime changeDate);


    }
}
