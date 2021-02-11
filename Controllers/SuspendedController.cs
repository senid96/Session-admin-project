using SessionAdministration.Services;
using SessionAdministration.Services.IServices;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace SessionAdministration.Controllers
{
    public class SuspendedController : Controller
    {
        private readonly ISuspended _suspendedService = new SuspendedService();

        // GET: Suspended
        public ActionResult Index()
        {
            return View();
        }

        public JsonResult GetRules(string platformName)
        {
            return Json(_suspendedService.GetRules(platformName), JsonRequestBehavior.AllowGet);
        }


        public JsonResult GetSuspendedRecords(int? platform, DateTime dateFrom, DateTime dateTo, string rule)
        {
            return Json(_suspendedService.GetSuspendedRecords(platform, dateFrom, dateTo, rule), JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetProcessedSuspendedRecords(int? platform, DateTime dateFrom, DateTime dateTo, string rule)
        {
            return Json(_suspendedService.GetProcessedSuspendedRecords(platform, dateFrom, dateTo, rule), JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public void ProcessSuspendedCDR(int sessionId)
        {
            _suspendedService.ProcessSuspendedCDR(sessionId);
        }
    }
}