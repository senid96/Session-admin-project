using FORIS.Interbilling.NTS.Mediation;
using FORIS.Interbilling.NTS.Mediation.Configurations;
using FORIS.Interbilling.NTS.Mediation.DAL;
using SessionAdministration.Services;
using SessionAdministration.Services.IServices;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Script.Serialization;

namespace SessionAdministration.Controllers
{
    public class AlarmsController : Controller
    {
        private readonly IAlarms _alarmService = new AlarmsService();

        // GET: Alarms
        public ActionResult Index()
        {
            LanguageResources.Init();
            FORIS.Interbilling.NTS.Mediation.Logger.Init();
            DataAccess.Init();
            Configuration.Init(); //initialise mediation configuration
            return View();
        }

        public JsonResult GetActiveAlarms()
        {
            var jsonResult = Json(_alarmService.GetActiveAlarms(), JsonRequestBehavior.AllowGet);
            jsonResult.MaxJsonLength = int.MaxValue;
            return jsonResult;
        }
        public JsonResult GetAlarmsHistory(DateTime dateFrom, DateTime dateTo)
        {
            return Json(_alarmService.GetAlarmsHistory(dateFrom,dateTo), JsonRequestBehavior.AllowGet);
        }
        public void ConfirmAlarms(List<string> alarmIds)
        {
            _alarmService.ConfirmAlarms(alarmIds, User.Identity.Name, DateTime.Now);
        }
    }
}