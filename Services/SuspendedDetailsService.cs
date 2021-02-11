using FORIS.Interbilling.NTS.Mediation;
using FORIS.Interbilling.NTS.Mediation.ConfigurationClasses;
using FORIS.Interbilling.NTS.Mediation.DAL;
using SessionAdministration.Models;
using SessionAdministration.Models.Requests;
using SessionAdministration.Services.IServices;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Web;

namespace SessionAdministration.Services
{
    public class SuspendedDetailsService:ISuspendedDetails
    {
        public List<CDRFields> GetAllFieldsOfSuspendedCDR(int cdrId)
        {
            List<CDRFields> list = (from DataRow dr in FORIS.Interbilling.NTS.Mediation.DAL.NtsMed.GetAllFieldsOfSuspendedCDR(cdrId).Rows
                                    select new CDRFields()
                                    {
                                        NtsFieldId = Convert.ToString(dr["NTS_FIELD_ID"]),
                                        FieldKey = Convert.ToString(dr["FIELD_KEY"]),
                                        FieldValue = Convert.ToString(dr["FIELD_VALUE"]),
                                        CdrId = Convert.ToString(dr["CDR_ID"]),
                                        OrderNumber = Convert.ToString(dr["ORDER_NUMBER"]),
                                    }).ToList();
            return list;
        }

        public List<CDRErrorFields> GetErrorFieldsOfSuspendedCDR(int cdrId)
        {
            List<CDRErrorFields> list = (from DataRow dr in FORIS.Interbilling.NTS.Mediation.DAL.NtsMed.GetErrorFieldsOfSuspendedCDR(cdrId).Rows
                              select new CDRErrorFields()
                              {
                                  ErrorFieldKey = Convert.ToString(dr["error_field_key"]),
                                  ErrorFieldValue = Convert.ToString(dr["error_field_value"]),
                                  ValidationErrorValue = Convert.ToString(dr["VALIDATION_ERROR_VALUE"]),
                                  ValidationRule = Convert.ToString(dr["VALIDATION_RULE"])

                              }).ToList();
            return list;
        }

        public List<CDR> GetCDRsBySessionId(int sessionId)
        {
            try
            {
                List<CDR> list = (from DataRow dr in FORIS.Interbilling.NTS.Mediation.DAL.NtsMed.getCDRsBySessionId(sessionId).Rows
                                  select new CDR()
                                  {
                                      SessionId = Convert.ToInt32(dr["SESSION_ID"]),
                                      CdrId = Convert.ToInt32(dr["CDR_ID"]),
                                      Line = Convert.ToString(dr["LINE"]),
                                      LineNumber = Convert.ToInt32(dr["LINE_NUMBER"]),
                                      ChangeDate = Convert.ToDateTime(dr["CHANGE_DATE"]),
                                      ChangeByUser = Convert.ToString(dr["CHANGE_BY_USER"]),
                                      Status = Convert.ToString(dr["VALIDATION_ERROR_VALUE"])

                                  }).ToList();

                return list;
            }
            catch (Exception e)
            {

                throw;
            }
           
        }

        public List<ProcessedCDR> GetProcessedCDRsBySessionId(int sessionId)
        {
            List<ProcessedCDR> list = (from DataRow dr in FORIS.Interbilling.NTS.Mediation.DAL.NtsMed.getProcessedCDRsBySessionId(sessionId).Rows
                              select new ProcessedCDR()
                              {
                                  Line = Convert.ToString(dr["LINE"]),
                                  LineNumber = Convert.ToString(dr["LINE_NUMBER"]),
                              }).ToList();
            return list;
        }

        public SuspendedRecord GetSuspendedFileInfo(int sessionId)
        {
                List<SuspendedRecord> list = (from DataRow dr in FORIS.Interbilling.NTS.Mediation.DAL.NtsMed.getSporniSessionById(sessionId).Rows
                                      select new SuspendedRecord()
                                      {
                                          MedSessionId = Convert.ToInt32(dr["MED_SESSION_ID"]),
                                          FileSource = Convert.ToString(dr["FILE_SOURCE"]),
                                          FileName = Convert.ToString(dr["FILE_NAME"]),
                                          SessionDate = Convert.ToDateTime(dr["SESSION_DATE"]),
                                          FileRowCount = Convert.ToInt32(dr["FILE_ROW_COUNT"]),
                                          TarificationCount = Convert.ToInt32(dr["TARIFICATION_COUNT"]),
                                          SuspendedCount = Convert.ToInt32(dr["SPORNI_COUNT"]),
                                          RejectedCount = Convert.ToInt32(dr["REJECTED_COUNT"]),
                                          ErrorCount = Convert.ToInt32(dr["ERROR_COUNT"]),
                                          Status = Convert.ToString(dr["STATUS"])
                                      }).ToList();
                return list[0];
        }

        public void UpdateCDRFields(List<CDRFieldUpdateRequest> objs)
        {
            try
            {
                for (int i = 0; i < objs.Count; i++)
                {
                    FORIS.Interbilling.NTS.Mediation.DAL.NtsMed.UpdateCDRFields(objs[i].NtsFieldId, objs[i].FieldValue);
                }
                FORIS.Interbilling.NTS.Mediation.DAL.NtsMed.UpdateCdrStatusError(Convert.ToInt32(objs[0].CdrId), 1, System.Web.HttpContext.Current.User.Identity.Name, DateTime.Now); //set status to 'korigovan'
            }
            catch (Exception e)
            {
               FORIS.Interbilling.NTS.Mediation.Logger.LogError(e.ToString());
            }
        }

        public void UpdateCdrStatusError(int cdrId, int status, string user, DateTime changeDate)
        {
            try
            {
                FORIS.Interbilling.NTS.Mediation.DAL.NtsMed.UpdateCdrStatusError(cdrId, status, user, changeDate);
            }
            catch (Exception ex)
            {
                FORIS.Interbilling.NTS.Mediation.Logger.LogError(ex.ToString());
            }
        }

    }
}