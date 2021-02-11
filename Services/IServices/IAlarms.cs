using SessionAdministration.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SessionAdministration.Services.IServices
{
    interface IAlarms
    {
        List<Alarm> GetActiveAlarms();
        List<Alarm> GetAlarmsHistory(DateTime dateFrom, DateTime dateTo);
        void ConfirmAlarms(List<string> alarmId, string user, DateTime ackTime);
    }
}
