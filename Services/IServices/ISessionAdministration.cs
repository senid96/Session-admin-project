using FORIS.Interbilling.NTS.Mediation.Configurations.ConfigurationClasses;
using SessionAdministration.Models;
using SessionAdministration.Models.Requests;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using static FORIS.Interbilling.NTS.Mediation.Configurations.ConfigurationClasses.FileTypes;

namespace SessionAdministration.Services.IServices
{
    public interface ISessionAdministration
    {
        List<Session> GetSessions(SessionSearchRequest obj);
        List<Session> GetSessionById(int sessionId);
        List<FileType> GetPlatformsFromConfiguration();
        void DeleteSessions(string sessions);
        void ReprocessSessions(List<ReprocessRequest> req);
    }
}
