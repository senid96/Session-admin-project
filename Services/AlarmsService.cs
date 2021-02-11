using FORIS.Interbilling.NTS.Mediation;
using SessionAdministration.Models;
using SessionAdministration.Services.IServices;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Web;


namespace SessionAdministration.Services
{
    public class AlarmsService : IAlarms
    {
        public List<Alarm> GetActiveAlarms()
        {

            List<Alarm> list = (from DataRow dr in FORIS.Interbilling.NTS.Mediation.DAL.NtsMed.GetActiveAlarms().Rows
                                select new Alarm()
                                {
                                    AlarmId = Convert.ToInt32(dr["alarm_id"]),
                                    AlarmTime = Convert.ToDateTime(dr["alarm_time"]),
                                    Source = Convert.ToString(dr["source"]),
                                    Message = Convert.ToString(dr["message"]),
                                    //Acknowledged = Convert.ToString(dr["acknowledged"]),
                                    //AckUser = Convert.ToString(dr["ack_user"]),
                                    //AckTime = Convert.ToString(dr["ack_time"]),
                                    MedSessionId = Convert.ToString(dr["med_session_id"])
                                }).ToList();
            return list;
        }

        public List<Alarm> GetAlarmsHistory(DateTime dateFrom, DateTime dateTo)
        {

            List<Alarm> list = (from DataRow dr in FORIS.Interbilling.NTS.Mediation.DAL.NtsMed.GetAlarmHistory(dateFrom,dateTo).Rows
                                select new Alarm()
                                {
                                    AlarmId = Convert.ToInt32(dr["alarm_id"]),
                                    AlarmTime = Convert.ToDateTime(dr["alarm_time"]),
                                    Source = Convert.ToString(dr["source"]),
                                    Message = Convert.ToString(dr["message"]),
                                    Acknowledged = Convert.ToString(dr["acknowledged"]),
                                    AckUser = Convert.ToString(dr["ack_user"]),
                                    AckTime = Convert.ToString(dr["ack_time"]),
                                    MedSessionId = Convert.ToString(dr["med_session_id"])
                                }).ToList();
            return list;
        }

        public void ConfirmAlarms(List<string> alarmIds, string user, DateTime ackTime)
        {
            foreach (var item in alarmIds)
            {
                try
                {
                    FORIS.Interbilling.NTS.Mediation.DAL.NtsMed.SetAlarmAck(item, user, ackTime);
                }
                catch (Exception ex)
                {
                    Logger.LogError(ex.ToString());
                }
            }
        }
    }
}