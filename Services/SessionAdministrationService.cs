using FORIS.Interbilling.NTS.Mediation.ConfigurationClasses;
using FORIS.Interbilling.NTS.Mediation.Configurations.ConfigurationClasses;
using FORIS.Interbilling.NTS.Mediation.DAL;
using SessionAdministration.Models;
using SessionAdministration.Models.Requests;
using SessionAdministration.Services.IServices;
using System;
using System.Collections.Generic;
using System.Data;
using System.IO;
using System.Linq;
using static FORIS.Interbilling.NTS.Mediation.Configurations.ConfigurationClasses.FileTypes;

namespace SessionAdministration.Services
{
    public class SessionAdministrationService : ISessionAdministration
    {
        public List<Session> GetSessions(SessionSearchRequest obj) {
            List<Session> list = (from DataRow dr in FORIS.Interbilling.NTS.Mediation.DAL.NtsMed.GetMedSession(obj.DateTypeSearch, obj.DateFrom, obj.DateTo, obj.OperatorSign, obj.ProccessingStep, obj.PlatformName, obj.FileName).Rows
                                  select new Session()
                                  {
                                      Id = Convert.ToInt32(dr["med_session_id"]),
                                      SessionDate = Convert.ToDateTime(dr["session_date"]),
                                      FileDate = Convert.ToDateTime(dr["file_date"]),
                                      FilePath = Convert.ToString(dr["file_path"]),
                                      FileName = Convert.ToString(dr["file_name"]),
                                      LastSuccessfulStep = Convert.ToInt32(dr["last_successful_step"]),
                                      DateOfLastChange = Convert.ToDateTime(dr["date_of_last_change"]),
                                      FileRowCount = Convert.ToInt32(dr["file_row_count"]),
                                      TarificationCount = Convert.ToInt32(dr["tarification_count"]),
                                      RejectedCount = Convert.ToInt32(dr["rejected_count"]),
                                      SporniCount = Convert.ToInt32(dr["sporni_count"]),
                                      ErrorCount = Convert.ToString(dr["error_count"])
                                  }).ToList();
            return list;
        }

        public List<Session> GetSessionById(int sessionId)
        {
            List<Session> list = (from DataRow dr in FORIS.Interbilling.NTS.Mediation.DAL.NtsMed.GetMedSessionById(sessionId).Rows
                                  select new Session()
                                  {
                                      Id = Convert.ToInt32(dr["med_session_id"]),
                                      SessionDate = Convert.ToDateTime(dr["session_date"]),
                                      FileDate = Convert.ToDateTime(dr["file_date"]),
                                      FilePath = Convert.ToString(dr["file_path"]),
                                      FileName = Convert.ToString(dr["file_name"]),
                                      LastSuccessfulStep = Convert.ToInt32(dr["last_successful_step"]),
                                      DateOfLastChange = Convert.ToDateTime(dr["date_of_last_change"]),
                                      FileRowCount = Convert.ToInt32(dr["file_row_count"]),
                                      TarificationCount = Convert.ToInt32(dr["tarification_count"]),
                                      RejectedCount = Convert.ToInt32(dr["rejected_count"]),
                                      SporniCount = Convert.ToInt32(dr["sporni_count"]),
                                      ErrorCount = Convert.ToString(dr["error_count"])
                                  }).ToList();
            return list;
        }

        public List<FileType> GetPlatformsFromConfiguration()
        {
            //read from configuration
            return FORIS.Interbilling.NTS.Mediation.Configurations.Configuration.GetNotCashedConfiguration<FORIS.Interbilling.NTS.Mediation.Configurations.ConfigurationClasses.FileTypes>().FileTypesList;
        }

        public void DeleteSessions(string sessions)
        {
            try
            {
                FORIS.Interbilling.NTS.Mediation.DAL.NtsMed.DeleteMEDSessions(sessions);
            }
            catch (Exception ex)
            {
                FORIS.Interbilling.NTS.Mediation.Logger.LogError(ex.ToString());
            }
        }

        public void ReprocessSessions(List<ReprocessRequest> req)
        {
            MediationServiceConfiguration mediationServiceConfig = FORIS.Interbilling.NTS.Mediation.Configurations.Configuration.GetNotCashedConfiguration<MediationServiceConfiguration>();

            foreach (var item in req)
            {
                string filePath = GetFilePath(item.Path);
                string folder = Path.GetFileName(Path.GetDirectoryName(item.Path));

                if (File.Exists(filePath))
                {
                    string fileName = Path.GetFileName(filePath);
                    string oldFile = Path.Combine(mediationServiceConfig.ProcessedDirectory, fileName);
                    string newFile = Path.Combine(InputPath(folder), "rep_" + item.Id + "_" + fileName);
                    File.Move(oldFile, newFile);

                    MedSessionToUpdate medSessionToUpdate = new MedSessionToUpdate();
                    medSessionToUpdate.MedSessionId = item.Id;
                    medSessionToUpdate.LastSuccessfulStep = 0;
                    NtsMed.UpdateMEDSession(medSessionToUpdate);
                }
            }
        }

        //helper methods
        private string GetFilePath(string filePath)
        {
            MediationServiceConfiguration mediationServiceConfig = FORIS.Interbilling.NTS.Mediation.Configurations.Configuration.GetNotCashedConfiguration<MediationServiceConfiguration>();
            string file = string.Empty;
            file = Path.GetFileName(filePath);
            string newFile = mediationServiceConfig.ProcessedDirectory + "\\" + file;
            return newFile;
        }

        private string InputPath(string folder)
        {
            MediationServiceConfiguration mediationServiceConfig = FORIS.Interbilling.NTS.Mediation.Configurations.Configuration.GetNotCashedConfiguration<MediationServiceConfiguration>();

            string output_path = string.Empty;

            foreach (var value in mediationServiceConfig.InputDirectories)
            {
                if (value.FileType.ToString() == folder)
                {
                    output_path = value.Directory.ToString();
                    break;
                }
            }
            return output_path;
        }
    }
}