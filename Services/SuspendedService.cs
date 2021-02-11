using FORIS.Interbilling.NTS.Mediation.ConfigurationClasses;
using FORIS.Interbilling.NTS.Mediation.Configurations;
using FORIS.Interbilling.NTS.Mediation.DAL;
using SessionAdministration.Models;
using SessionAdministration.Services.IServices;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Web;
using static FORIS.Interbilling.NTS.Mediation.ConfigurationClasses.FieldsValidation;

namespace SessionAdministration.Services
{
    public class SuspendedService : ISuspended
    {
        public List<string> GetRules(string platformName)
        {
            List<string> rules = new List<string>();
            FileControl fileControl = Configuration.GetNotCashedConfiguration<FileControl>();
            var fileVal = fileControl.FieldsValidations.Find(p => p.FileType.Equals(platformName));
            if (fileVal != null) //TODO
            {
                foreach (Validation v in fileVal.Validations)
                {
                    rules.Add(v.ValidationRule + "-" + v.InputField);
                }
            }
            return rules;
        }

        public List<SuspendedRecord> GetSuspendedRecords(int? platform, DateTime dateFrom, DateTime dateTo, string rule)
        {
            List<SuspendedRecord> list = (from DataRow dr in FORIS.Interbilling.NTS.Mediation.DAL.NtsMed.getSporniSessions(platform, dateFrom, dateTo, rule).Rows
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
            return list;
        }

        public List<SuspendedRecord> GetProcessedSuspendedRecords(int? platform, DateTime dateFrom, DateTime dateTo, string rule)
        {
            List<SuspendedRecord> list = (from DataRow dr in FORIS.Interbilling.NTS.Mediation.DAL.NtsMed.getSporniSessions2(platform, dateFrom, dateTo, rule).Rows
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
            return list;
        }

        public void ProcessSuspendedCDR(int sessionId)
        {
            try
            {
                DataTable sessionErrors = NtsMed.GetAllSessionErrors(sessionId);

                if (sessionErrors.Rows.Count > 0)
                {

                    string platformName = sessionErrors.Rows[0][0].ToString();
                    MediationServiceConfiguration medConfig = FORIS.Interbilling.NTS.Mediation.Configurations.Configuration.GetNotCashedConfiguration<MediationServiceConfiguration>();
                    var id = medConfig.InputDirectories;
                    string inputDirectory = id.FirstOrDefault(p => p.FileType.ToLower().Equals(platformName.ToLower())).Directory;
                    StringBuilder sb = new StringBuilder();
                    List<string> lines = new List<string>();
                    foreach (DataRow dr in sessionErrors.Rows)
                    {
                        DataTable correctedLines = NtsMed.GetCorrectedLines(dr["cdr_id"].ToString());
                        string line = "";
                        foreach (DataRow dr2 in correctedLines.Rows)
                        {
                            line += dr2["field"].ToString() + ";";
                        }
                        line = line.Remove(line.Length - 1);
                        lines.Add(line);
                    }
                    UpdateFileStatus(sessionId, 5); // 5 - status: procesiran 

                    System.IO.File.WriteAllLines(inputDirectory + "\\sporni\\" + "\\sporni_" + sessionId + ".txt", lines);

                }
                else
                {
                    UpdateFileStatus(sessionId, 5); // 5 - status: procesiran 
                }

            }

            catch (Exception ex)
            {
                FORIS.Interbilling.NTS.Mediation.Logger.LogError(ex.ToString());
            }
        }

        public void UpdateFileStatus(int sessionId, int status)
        {
            try
            {
                FORIS.Interbilling.NTS.Mediation.DAL.NtsMed.UpdateFileStatus(sessionId, status);
            }
            catch (Exception ex)
            {
                FORIS.Interbilling.NTS.Mediation.Logger.LogError(ex.ToString());
            }
        }

    }
}


