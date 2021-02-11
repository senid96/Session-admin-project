using FORIS.Interbilling.NTS.Mediation;
using FORIS.Interbilling.NTS.Mediation.Configurations;
using FORIS.Interbilling.NTS.Mediation.DAL;
using SessionAdministration.Models.Requests;
using SessionAdministration.Services;
using SessionAdministration.Services.IServices;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace SessionAdministration.Controllers
{
    public class SessionAdministrationController : Controller
    {
        private readonly ISessionAdministration _sessionService = new SessionAdministrationService();

        // GET: SessionAdministration
        public ActionResult Index()
        {
           
            return View();
        }

        public JsonResult GetSessions(SessionSearchRequest obj)
        {
            return Json(_sessionService.GetSessions(obj), JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetSessionById(int sessionId)
        {
            return Json(_sessionService.GetSessionById(sessionId), JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetPlatformsFromConfiguration()
        {
            return Json(_sessionService.GetPlatformsFromConfiguration(), JsonRequestBehavior.AllowGet);
        }

        public void DeleteSessions(string sessions)
        {
            _sessionService.DeleteSessions(sessions);
        }

        [HttpPost]
        public void ReprocessSessions(List<ReprocessRequest> reqList)
        {
            _sessionService.ReprocessSessions(reqList);
        }
    }
}